const util = require('util');
const exec = util.promisify(require('child_process').exec);


async function execLog(cmd) {
  const { stdout, stderr } = await exec(cmd);
  console.log('stdout:', stdout);
  console.log('stderr:', stderr);
}

async function push(folder) {
  return await execLog(`cd ${folder} && echo y | clasp push`);
}

async function pull(folder) {
  return await execLog(`cd ${folder} && clasp pull`);
}

module.exports = { push, pull };