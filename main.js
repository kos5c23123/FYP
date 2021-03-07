const { app, BrowserWindow, globalShortcut } = require('electron')

function createWindow() {
    process.env.GOOGLE_API_KEY = 'AIzaSyDNgedYtU-GR7aPCGcZUHCjtMKd7uomw1c';
    // window = new BrowserWindow({ width: 1024, height: 600 })
    window = new BrowserWindow()
    window.setFullScreen(true)
    // window.webContents.openDevTools()
    window.loadFile('index.html')
    globalShortcut.register('ESC', () => {
        process.exit();
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    console.log("Bye~");
    process.exit();
});