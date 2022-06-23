function generateExportSelectedUrl() {
  var lastRow = SpreadsheetApp.getActiveRange().getLastRow();
  var firstRow = SpreadsheetApp.getActiveRange().getRow();
  var range = `D${firstRow}:AA${lastRow}`;

  return new ExportService(SpreadsheetApp.getActiveSheet()).getExportUrl(range);
}

function displayExportSelectedDialog() {
    var template = HtmlService.createTemplateFromFile('html/exportSelected')
    _.assign(template, {
      link : generateExportSelectedUrl()
    });
    var html = template.evaluate().setWidth(600).setHeight(250);
    SpreadsheetApp.getUi().showModalDialog(html, 'Enter title...')
}

