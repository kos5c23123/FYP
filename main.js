const { app, BrowserWindow } = require('electron')

function createWindow() {
  process.env.GOOGLE_API_KEY = 'AIzaSyAw9PVACjlLl2HtKdUwxBw0DGhyKwpK9pQ';
  window = new BrowserWindow({ width: 1000, height: 700 })
  window.loadFile('index.html')
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  console.log("Bye~");
  process.exit();
});