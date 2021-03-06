/**
 * git clone, checkout and clear
 */

const spawn = require('child_process').spawn;

function download(url, callback) {
  const targetPath = './';

  // git clone
  const gitClone = spawn('git', ['clone', '--depth', '1', '--', url, targetPath]);

  gitClone.on('close', (status) => {
    if (status === 0) {
      checkout();
    } else {
      callback && callback(new Error(`'git checkout' failed with status ${status}`));
    }
  });

  // checkout branch
  function checkout() {
    const branchArr = url.split('#');
    const branch = branchArr[1] || 'master';
    const args = ['checkout', branch];
    const process = spawn('git', args, { cwd: targetPath });
    process.on('close', function (status) {
      if (status === 0) {
        removeDotGit();
      } else {
        callback && callback(new Error(`'git checkout' failed with status ${status}`));
      }
    });
  }

  // remove .git directory
  function removeDotGit() {
    const args = ['-rf', '.git'];
    const process = spawn('rm', args, { cwd: targetPath });
    process.on('close', function (status) {
      if (status === 0) {
        callback && callback();
      } else {
        callback && callback(new Error(`'clear git' failed with status ${status}`));
      }
    });
  }
}

module.exports = download;
