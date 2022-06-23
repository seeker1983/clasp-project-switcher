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

async function loadLibrary() {
	setScriptVersion(`${version}/lib/.clasp.json`, config.test.libraryId);
	await clasp.pull(`${version}/lib`);
}

async function loadContainer() {
	setScriptVersion(`${version}/container/.clasp.json`, config.test.containerScriptId);
	await clasp.pull(`${version}/container`);
}

loadLibrary();
loadContainer();



