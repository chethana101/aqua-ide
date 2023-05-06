const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const path = require("path");
const electronReload = require('electron-reload')
const ipc = ipcMain;

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        // icon: path.join(__dirname, "aqua/ui/root_icon/aqua-ide-logo.png"),
        frame: false,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true,
            webSecurity: false, // Disable same-origin policy
            allowRunningInsecureContent: true, // Allow loading of resources over http
            contextIsolation: false,
            webviewTag: true,
        },
    });

    mainWindow.loadFile('./renderer/index.html');

    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    ipc.on("maximize-aqua-ide", () => {
        if (mainWindow.isMaximized()) {
            mainWindow.restore();
        } else {
            mainWindow.maximize();
        }
    });

    ipc.on("close-aqua-ide", () => {
        mainWindow.close();
    });

    ipc.on("minimize-aqua-ide", () => {
        mainWindow.minimize();
    });

    // Example ipcMain event handler
    mainWindow.webContents.on('did-finish-load', function () {
        mainWindow.webContents.send('window-loaded');
    });


    /*
     * Get opened folder path
     * */
    ipc.on("open-output-dialog", (event, json) => {
        dialog.showOpenDialog({properties: ["openDirectory"]}).then((data) => {
            if (data.canceled) {
                event.returnValue = {state: false, folderPath: null, error: "Canceled"};
            } else {
                event.returnValue = {state: true, folderPath: data.filePaths, error: null};
            }
        }).catch(err => {
            console.log(err);
            event.returnValue = {state: false, pathGet: null, error: err};
        })
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

require('electron-reload')(__dirname, {
    electron: path.join("node_modules\\", '.bin', 'electron')
});
