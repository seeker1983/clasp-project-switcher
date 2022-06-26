function onOpen() {
   
   var ui = SpreadsheetApp.getUi();
   ui.createMenu('BIM Intelligence')
    .addItem('1ère Utilisation', 'init')
    .addSubMenu(ui.createMenu('Modes d\'emploi')
      .addItem('Ajouter des fichiers', 'help.AddFile')
      .addItem('Faire un bordereau', 'help.bordereau')
      .addItem('Voir tout ', 'help.filter'))
    .addSeparator()
    .addItem('Mise à jour du tableau', 'displayUpdateListDialog')
    .addItem('Créer un bordereau', 'displayExportSelectedDialog')
    .addItem('Supprimer les filtres', 'ClearFilter')      
    .addToUi();
   
}

function displayUpdateListDialog() {
  return ProductionFolderListLib.displayUpdateListDialog();
}

function displayExportSelectedDialog() {
  return ProductionFolderListLib.displayExportSelectedDialog();
}

function ClearFilter() {
  return new ProductionFolderListLib.FilterService(SpreadsheetApp.getActiveSheet()).remove().sortNewest();
}

/* For internal use of dialogs */
function execute(fn, options) {
  return ProductionFolderListLib.execute(fn, options);
}


function help() {
  linkOpen('https://video.wixstatic.com/video/6d1d7e_4dd4af902ffd4754aab3434d6c95d1ba/720p/mp4/file.mp4')
}

function linkOpen(url) {
  // Source : https://www.sheets-pratique.com/fr/codes/link-open  
  SpreadsheetApp.getUi().showModalDialog(HtmlService.createHtmlOutput(`<script>window.addEventListener('load',()=>{window.open('${url}'),google.script.host.close()});</script></body></html>`), 'Ouverture ...');
}

