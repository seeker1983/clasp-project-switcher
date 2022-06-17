const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function clasp(folder) {
  const { stdout, stderr } = await exec(`cd ${folder} && echo y | clasp push`);
  console.log('stdout:', stdout);
  console.log('stderr:', stderr);
}

module.exports = { clasp };