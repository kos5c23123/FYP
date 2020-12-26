const { app, BrowserWindow } = require('electron')

function createWindow() {
  process.env.GOOGLE_API_KEY = 'AIzaSyDNgedYtU-GR7aPCGcZUHCjtMKd7uomw1c';
  window = new BrowserWindow({ width: 1024, height: 600 })
  window.loadFile('index.html')
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  console.log("Bye~");
  process.exit();
});