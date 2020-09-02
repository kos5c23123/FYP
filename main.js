const {app, BrowserWindow} = require('electron')

function createWindow () {
    window = new BrowserWindow({width: 900, height: 600})
    window.loadFile('index.html')
  }

  app.on('ready', createWindow)

  app.on('window-all-closed', () => {
    console.log("Bye~");
    process.exit();
  });