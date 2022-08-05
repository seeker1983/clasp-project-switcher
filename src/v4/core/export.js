function ExportService(sheet) {
  this.getExportUrl = range => sheet.getParent().getUrl().replace(/edit$/,'') + 
    'export?exportFormat=pdf&format=pdf' +
    '&gid=' + sheet.getSheetId() + '&id=' + sheet.getParent().getId() +
    '&range=' + range +
    '&size=A3' +     // paper size
    '&portrait=false' +   // orientation, false for landscape
    '&fitw=true' +       // fit to width, false for actual size
    '&sheetnames=true' + 
    '&printtitle=true' + 
    '&pagenumbers=true' + //hide optional headers and footers
    '&gridlines=false' + // hide gridlines
    '&fzr=true';
}

function setTitle(title) {
  SpreadsheetApp.getActiveSheet().getRange('D1').setValue(title);
}

function test_ExportService() {
  var xs = new ExportService(SpreadsheetApp.openByUrl(SS_URL).getSheetByName(SHEETNAME));

  var url = xs.getExportUrl(4);
  console.log(url)
}
