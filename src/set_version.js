const fs = require('fs');
const exec = require('./exec');

const libraryId = '1GoB8SKDu_9nVyrtWcGfoWlv0pXM9mr3kvKOjtFxV2nBTNmCsgaphIIHK';

const containerIds = [
	'1rhDLmLgCUuP99AIw7xManwkaoRLLS1vaDMDui2Sq0eQ8-WhFfLq-LXmI'
];

const version = process.argv[2];

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
	setScriptVersion(`${version}/lib/.clasp.json`, libraryId);
	return await exec.clasp(`${version}/lib`);
}

async function updateContainer(containerId) {
	var manifestFile = `${version}/container/appsscript.json`
	var manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf-8'));
	manifest.dependencies.libraries[0].libraryId = LibraryId;
	fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2))

	setScriptVersion(`${version}/container/.clasp.json`, containerId);
	exec.clasp(`${version}/container`);
}

//updateLib();
//containerIds.map(updateContainer)
	setScriptVersion(`${version}/container/.clasp.json`, containerIds[0]);
	exec.clasp(`${version}/container`);


//


