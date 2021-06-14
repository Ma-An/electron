const {app, BrowserWindow} = require('electron');
const {ipcMain} = require('electron');
const path = require('path');

// get rid of this garbage from my screen
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('./src/index.html');
}

app.whenReady().then(() => {
  createWindow();
});

let counter = 0;
ipcMain.on('synchronous-message', (event, message) => {
  console.log(message); // prints "ping"
  counter +=1;
  event.reply('synchronous-reply', `pong. we've ponged: ${counter} time(s)`);
});