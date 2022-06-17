const KSheetService = {
  openFrom : function (ssId, sheetName, options = {}) {
    return new KSheet( SpreadsheetApp.openById(ssId).getSheetByName(sheetName), options);
  },
  createOpen(ss_id, sheetName, options = {}) {
    var spreadsheet = SpreadsheetApp.openById(ss_id);
    var sheet = spreadsheet.getSheetByName(sheetName);
    if(! sheet) 
      sheet = spreadsheet.insertSheet(sheetName);
    return new KSheet(sheet, options);
  }
}

function KSheet(sheet, options = {}) {
  this.load = function () {
    var rows = this.numRows > 0 ? this._sheet.getRange(this.startRow, 1, this.numRows, this.headers.length).getValues() : [];
    return rows.map(r=> _.zipObject(this.headers, r));
  };
  this.setMaxColumns = function(maxColumns){
    if(maxColumns < this._sheet.getMaxColumns())
      this._sheet.deleteColumns(maxColumns + 1, this._sheet.getMaxColumns() - maxColumns);
  };
  this.loadNonEmpty = function(){
    return this.load().filter(row => ! _.every(row, r => r== ''));
  };
  
  this.loadColumn = function (columnName) {
    return this.numRows > 0 ? this._sheet.getRange(this.startRow, this.findColumn(columnName), this.numRows, 1).getValues().map(r=>r[0]) : [];
  };
  this.saveRowsColumn = function(columnName, rows) {
    return this.saveColumn(columnName, _.map(rows, columnName));
  };
  this.saveColumn = function(columnName, values) {
    if(values.length > 0) {
      this._sheet.getRange(this.startRow, this.findColumn(columnName), values.length, 1)
        .setValues(values.map(value=>[value]));
    }
  };
  this.saveRichColumn = function(columnName, values) {
    if(values.length > 0) {
      this._sheet.getRange(this.startRow, this.findColumn(columnName), values.length, 1)
        .setRichTextValues(values.map(value=>[value]));
    }
  };
  this.saveValues = function (values) {
    if(values.length > 0) {
      this._sheet.getRange(this.startRow, 1, values.length, values[0].length).setValues(values);
      if(this._sheet.getLastRow() >= this.startRow + values.length)
        this._sheet.getRange((this.startRow + values.length)+':' + this._sheet.getLastRow()).setValue('');
      }
  };
  this.saveRows = function (rows) {
    this.saveValues(rows.map(row => this.rowToValues(row)));
  };
  this.trunc = function () {  
    var rows = this.loadNonEmpty();
    this.saveRows(rows);
    if(this.startRow + rows.length + 1 < this.sheet.getMaxRows())
      this.sheet.deleteRows(this.startRow + rows.length + 1, this.sheet.getMaxRows() - (this.startRow + rows.length + 1));
    return this;
  };
  this.saveRowAt = function (row, rowIndex) {
    var values = this.headers.map(col => _.get(row, col, ''));
    this._sheet.getRange(rowIndex, 1, 1, values.length).setValues([values]);
  };
  this.findColumn = function (columnName) {
    return this.headers.indexOf(columnName) + 1;
  };
  this.findColumnLetter = function (columnName) {
    return this.columnToLetter(this.findColumn(columnName));
  };

this.setColumnFormat = function (columnName, format) {
      this.sheet.getRange(2,this.findColumn(columnName),this.sheet.getMaxRows(),1).setNumberFormat(format);
  };
  this.rowToValues = function (row) {
    return this.headers.map(col => _.get(row, col, ''));
  };
  this.appendRow = function (row) {
    this._sheet.appendRow(this.rowToValues(row));
  };
  this.getSpreadsheet = function() {
    var ss = _.has(this.options, 'spreadsheetId') ? SpreadsheetApp.openById(this.options.spreadsheetId) : SpreadsheetApp.getActive();
    if(!ss) throw('Cannot open spreadsheet' + this.options.spreadsheetId);
    return ss;
  };
  this.getSheet = function() {
    return this._sheet;
  };
  this.sortBy = function(columnName, ascending = true){
    var filter = this.sheet.getDataRange().getFilter() || this.sheet.getDataRange().createFilter()
    filter.sort(this.findColumn(columnName), ascending);
  },
  this.insertHeaderAfter = function(existingHeader, newHeader) {
    if(this.headers.indexOf(newHeader) !== -1) {
      return false;
    }
    if(this.headers.indexOf(existingHeader) == -1) throw(existingHeader + ' not found');
    this.sheet.insertColumnAfter(this.findColumn(existingHeader));
    this.sheet.getRange(1, this.findColumn(existingHeader) + 1).setValue(newHeader);
    this.headers.splice(this.headers.indexOf(existingHeader)+1, 0, newHeader);
    Logger.log(this.headers);
  },
  this.findColumn = function(columnName) {
    return this.headers.indexOf(columnName) + 1;
  };
  this.setHeaders = function(headers){
    this.sheet.getRange( 1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
    this.headers = headers;
  }
  this.renameHeader = function(columnName, newColumnName){
    var column = this.findColumn('Link type');
    if(column > 0)    
      this.sheet.getRange( 1, column).setValue(newColumnName);
    this.headers[column-1] = newColumnName;
  }

  this.setWidth = function(width){
    Logger.log([1,  this._sheet.getMaxColumns(), width]);
    this.sheet.setColumnWidths(1,  this._sheet.getMaxColumns(), width);
  }
  this.columnToLetter = function(column){
    var temp, letter = '';
    while (column > 0)
    {
      temp = (column - 1) % 26;
      letter = String.fromCharCode(temp + 65) + letter;
      column = (column - temp - 1) / 26;
    }
    return letter;
  },  
  this.letterToColumn = function (letter){
    var column = 0, length = letter.length;
    for (var i = 0; i < length; i++)
    {
      column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
    }
    return column;
  }
  var savedFilterStack = [];
  this.pushFilter = function() {
    var filter = sheet.getFilter();
    var criterias = _.range(filter.getRange().getWidth())
      .map(index => filter.getColumnFilterCriteria(index+1));

    filter.remove();

    savedFilterStack.push(criterias);
  };
  this.popFilter = function() {
    var newFilter = this._sheet.getRange(this.startRow - 1, 1, this.numRows + 1, this.headers.length).createFilter();

    savedFilterStack.pop().map((criteria, index) => newFilter.setColumnFilterCriteria(index+1, criteria));
  };
  

  if (!new.target) { return new KSheet(sheet, options); }  
  this.options = _.assign({}, options);  
  this._sheet = typeof sheet == 'string'? this.spreadsheet.getSheetByName(sheet) : sheet; 
}

Object.defineProperties(KSheet.prototype, {
  "startRow" : {
    get: function() {
      return 2 + parseInt(_.get(this.options, 'skipBefore',0)) + parseInt(_.get(this.options, 'skipAfter',0));
    }
  },
  "spreadsheet": {
    get: function() {
      var value = this.getSpreadsheet();
      Object.defineProperty(this, 'spreadsheet', { value });    
      return value;
    }
  },
  "headers": {
    get: function() {
      var value = this._sheet.getRange(_.get(this.options, 'skipBefore', 0) + 1, 1, 1, this._sheet.getLastColumn()).getValues()[0];
      Object.defineProperty(this, 'headers', { value });    
      return value;
    }
  },
  "numRows": {
    get: function() {
      return this._sheet.getLastRow() - this.startRow + 1;
    }
  },
  "dataRange": {
    get: function() {
      return this._sheet.getRange(this.startRow, 1, this.numRows, this.headers.length);
    }
  },
  "name": {
    get: function() {
      return this._sheet.getName();
    }
  },
  "sheet": {
    get: function() {
      return this._sheet;
    }
  }
});

