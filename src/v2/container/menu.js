function listFolders() {
  return v2FolderListLib.updateListModal();
}
function getDownloadUrl() {
  return v2FolderListLib.generateExportUrl(SpreadsheetApp.getActiveSheet());
}
function ClearFilter() {
  return v2FolderListLib.FilterService(SpreadsheetApp.getActiveSheet());
}

function setTitle(title) {
  return v2FolderListLib.setTitle(title);
}
