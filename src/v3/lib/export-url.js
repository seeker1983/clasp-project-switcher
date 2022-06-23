function generateExportUrl(sheet) {
  sheet = sheet || SpreadsheetApp.getActiveSheet();
  var newItems = process(sheet);

  var fs = new FilterService(SpreadsheetApp.openByUrl(SS_URL).getSheetByName(SHEETNAME));

  fs.clear();
  fs.sortNewest();

  return newItems.length > 0 ? new ExportService(sheet).getExportUrl("A4:AA" + (newItems.length + 3).toString()) : false;
}

