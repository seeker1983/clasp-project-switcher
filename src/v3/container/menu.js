function onOpen() {
  SpreadsheetApp.getUi().createMenu('BIM Intelligence')
    .addItem('Mise à jour du tableau', 'displayUpdateListDialog')
    .addItem('Créer un bordereau', 'displayExportSelectedDialog')
    .addItem('Supprimer les filtres', 'ClearFilter')
    .addToUi();
}

function displayUpdateListDialog() {
  return v2FolderListLib.displayUpdateListDialog();
}

function displayExportSelectedDialog() {
  return v2FolderListLib.displayExportSelectedDialog();
}

function ClearFilter() {
  return new v2FolderListLib.FilterService(SpreadsheetApp.getActiveSheet()).clear();
}

/* For internal use of dialogs */
function execute(fn, options) {
  return v2FolderListLib.execute(fn, options);
}


