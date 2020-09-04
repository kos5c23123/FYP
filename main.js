const { app, BrowserWindow } = require('electron')
process.env.GOOGLE_API_KEY = 'AIzaSyAnlHl2nExfcWUlkqUltF9gemlHVvrzthk';

function createWindow() {
  window = new BrowserWindow({ width: 900, height: 600 })
  window.loadFile('index.html')
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  console.log("Bye~");
  process.exit();
});