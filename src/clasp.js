const util = require('util');
const exec = util.promisify(require('child_process').exec);


async function clasp(folder, cmd) {
  const { stdout, stderr } = await exec(`cd ${folder} && echo y | clasp ${cmd}`);
  console.log('stdout:', stdout);
  console.log('stderr:', stderr);
}

async function push(folder) {
  return await clasp(folder, 'push');
}

async function pull(folder) {
  return await clasp(folder, 'pull');
}

module.exports = { push, pull };