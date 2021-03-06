const fs = require('fs');
const clasp = require('./clasp');

const version = process.argv[2];

const config = require('./config');

if(! version) {
	console.log('Usage: node set_version <version-folder>')
	process.exit();
}

if(! fs.existsSync(version)) {
	console.log(`Cannot find folder for version '${version}'`)
	process.exit();
}

var setScriptVersion = (file, scriptId) => fs.writeFileSync(file, JSON.stringify({ scriptId }));

async function updateLib() {
	setScriptVersion(`${version}/lib/.clasp.json`, config.production.libraryId);
	return await clasp.push(`${version}/lib`);
}

async function updateContainer(containerId) {
	var manifestFile = `${version}/container/appsscript.json`
	var manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf-8'));
	manifest.dependencies.libraries[0].libraryId = config.production.libraryId;
	fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2))

	setScriptVersion(`${version}/container/.clasp.json`, containerId);
	clasp.push(`${version}/container`);
}

updateLib();
config.production.containerScriptIds.map(updateContainer)



