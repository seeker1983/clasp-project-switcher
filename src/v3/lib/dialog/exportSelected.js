function generateExportSelectedUrl() {
  var lastRow = SpreadsheetApp.getActiveRange().getLastRow();
  var firstRow = SpreadsheetApp.getActiveRange().getRow();
  var range = SpreadsheetApp.getActiveSheet().getRange(firstRow, 4, lastRow - firstRow + 1, SpreadsheetApp.getActiveSheet().getLastColumn() - 3).getA1Notation();

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

function test_exportRange() {
  var sheet = SpreadsheetApp.openById('1qHNK8IxARCedG5cLeUYbSXjzEBfBzpkoX0mopH0OdNQ').getSheetByName('Détail Visa Plan VDC');
  console.log(sheet.getActiveRange().getA1Notation)
}

