const {app, BrowserWindow, ipcMain, dialog, shell, remote} = require('electron');
const path = require("path");
const electronReload = require('electron-reload')
const ipc = ipcMain;

let mainWindow;
let isOpenWindow = true;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        icon: path.join(__dirname, "renderer/assets/images/aqua-ide-logo.png"),
        frame: true,
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

    ipc.on("close-all-aqua-ide", () => {
        app.quit();
    });

    // Example ipcMain event handler
    // mainWindow.webContents.on('did-finish-load', function () {
    //     mainWindow.webContents.send('window-loaded');
    // });

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

    /*
     * Get opened file path
     * */
    ipc.on("open-file-dialog", (event, json) => {
        dialog.showOpenDialog({properties: ["openFile"]}).then((data) => {
            if (data.canceled) {
                event.returnValue = {state: false, filePath: null, error: "Canceled"};
            } else {
                event.returnValue = {state: true, filePath: data.filePaths, error: null};
            }
        }).catch(err => {
            console.log(err);
            event.returnValue = {state: false, pathGet: null, error: err};
        })
    });

    /*
     * Move to the recycle bin, files or folders
     * */
    ipc.on("move-to-trash", (event, json) => {
        console.log(event);
        console.log(json);
        shell.trashItem(json.path)
            .then(() => {
                event.returnValue = {
                    status: "success",
                    message: "File moved to the recycle bin successfully!",
                };
            })
            .catch((error) => {
                event.returnValue = {
                    status: "error",
                    message: 'Error moving file to the recycle bin:' + error,
                };
            });
    });

    isOpenWindow = true;
}

ipc.on("open-new-window", () => {
    createWindow();
    isOpenWindow = false;
});

app.on('ready', () => {
    if (isOpenWindow) {
        createWindow();
    }
});


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
//
// require('electron-reload')(__dirname, {
//     electron: path.join("node_modules\\", '.bin', 'electron')
// });
