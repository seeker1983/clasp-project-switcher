function FilterService(sheet) {
  const DATE_COLUMN = 8;
  this.sheet = sheet;
  this.clear = () => {
    var filter = this.sheet.getFilter();
    filter && filter.remove();
  };

  this.sortNewest = () => {
    var filter = this.sheet.getFilter() || this.range.createFilter();
    filter.sort(DATE_COLUMN, false);
  }

  _.defineProps(this, {
    range: () => this.sheet.getRange(3, 1, this.sheet.getLastRow() - 2, this.sheet.getLastColumn())
  })
}

function test_FilterService() {
  var fs = new FilterService(SpreadsheetApp.openByUrl(SS_URL).getSheetByName(SHEETNAME));

  fs.clear();
  fs.sortNewest();
}


