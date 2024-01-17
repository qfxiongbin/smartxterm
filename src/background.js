'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'

const { exec } = require('child_process');
const os = require('os');
const path = require('path');
let currentWorkingDirectory = os.homedir(); // 初始工作目录设置为用户的家目录
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: true,
      contextIsolation: false,

    }
  })

  ipcMain.on('execute-command', (event, command) => {
    if (command.trim() === '') {
      console.error('收到的命令为空');
      return;
    }
  
    // 处理特殊命令，如 'cd'
    if (command.startsWith('cd ')) {
      const newDir = command.substring(3).trim();
      try {
        // 尝试改变当前工作目录
        process.chdir(path.resolve(currentWorkingDirectory, newDir));
        currentWorkingDirectory = process.cwd();
        event.reply('command-output', `当前目录: ${currentWorkingDirectory}`);
      } catch (error) {
        console.error(`改变目录错误: ${error}`);
        event.reply('command-output', `错误: ${error.message}`);
      }
      return;
    }
  
    // 执行普通命令
    exec(command, { cwd: currentWorkingDirectory }, (error, stdout, stderr) => {
      if (error) {
        console.error(`执行的错误: ${error}`);
        event.reply('command-output', `错误: ${error.message}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      event.reply('command-output', stdout || stderr);
    });
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
