// terminal.js
const { spawn } = require('node-pty');

let shell = spawn('bash');

function writeToShell(data) {
  shell.write(data);
}

function onData(callback) {
  shell.on('data', callback);
}

module.exports = {
  writeToShell,
  onData
};