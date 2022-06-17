const fs = require('fs');

const LibraryId = '1GoB8SKDu_9nVyrtWcGfoWlv0pXM9mr3kvKOjtFxV2nBTNmCsgaphIIHK';

const containerIds = [
	'1qHNK8IxARCedG5cLeUYbSXjzEBfBzpkoX0mopH0OdNQ'
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

fs.writeFileSync(`${version}/lib/.clasp.json`, JSON.stringify({
	scriptId: LibraryId
}))