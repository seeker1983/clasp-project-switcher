function generateExportUrl(sheet) {
  sheet = sheet || SpreadsheetApp.getActiveSheet();
  var newItems = process(sheet);

  new FilterService(sheet).remove().sortNewest();

  return newItems.length > 0 ? new ExportService(sheet).getExportUrl("A4:AA" + (newItems.length + 3).toString()) : false;
}

