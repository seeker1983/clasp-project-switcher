function FilterService(sheet) {
  const DATE_COLUMN_NAME = 'Last Update date';
  this.sheet = sheet;
  this.clear = () => {
    _.range(1, sheet.getLastColumn() + 1).map(
      column => ! sheet.isColumnHiddenByUser(column) && sheet.getFilter().removeColumnFilterCriteria(column)
    );
    return this;
  };

  this.remove = () => {
    var filter = this.sheet.getFilter();
    filter && filter.remove();
    return this;
  };

  this.sortNewest = () => {
    var filter = this.sheet.getFilter() || this.range.createFilter();
    filter.sort(this.DATE_COLUMN, false);
    return 'Sorted'
    return this;
  }

  _.defineProps(this, {
    range: () => this.sheet.getRange(3, 1, this.sheet.getLastRow() - 2, this.sheet.getLastColumn())
  });

  _.defineGlobal(this, {
    DATE_COLUMN: () => this.sheet.getRange('2:2').getValues()[0].indexOf(DATE_COLUMN_NAME) + 1
  });
}


function test_global() {
  console.log(new FilterService(SpreadsheetApp.openByUrl(SS_URL).getSheetByName(SHEETNAME)).DATE_COLUMN)

}

function test_FilterService() {
  var fs = new FilterService(SpreadsheetApp.openByUrl(SS_URL).getSheetByName(SHEETNAME));

  fs.clear();
  fs.sortNewest();
}


