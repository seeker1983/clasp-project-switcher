function generateExportUrl(sheet) {
  sheet = sheet || SpreadsheetApp.getActiveSheet();
  var newItems = process(sheet);

  new FilterService(sheet).remove().sortNewest();
  var range = sheet.getRange(4, 4, newItems.length, sheet.getLastColumn() - 3).getA1Notation();


  return newItems.length > 0 ? new ExportService(sheet).getExportUrl(range) : false;
}

