function generateExportUrl(sheet, action) {
  sheet = sheet || SpreadsheetApp.getActiveSheet();
  var newItems = process(sheet, action);

  //new FilterService(sheet).remove().sortNewest();

  return newItems.length > 0 ? new ExportService(sheet).getExportUrl(sheet.getRange(4, 4, newItems.length, sheet.getLastColumn() - 3).getA1Notation()) : false;
}

