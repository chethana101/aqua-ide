const {app, BrowserWindow, ipcMain, dialog, shell} = require('electron');
const path = require("path");
const fs = require("fs");
const ipc = ipcMain;
const log = require("electron-log");
const { autoUpdater } = require("electron-updater");

/* Config Log Options */
log.transports.file.getFile().path = __dirname + "\\aqua.log";
log.transports.file.format =
    "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}";

let mainWindow;
let isOpenWindow = true;
const configJsonURL = __dirname + '\\renderer\\settings\\config.json';
let windows = new Set();

function createWindow() {
    let mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        icon: path.join(__dirname, "./renderer/assets/images/aqua-ide-logo.png"),
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, "./renderer/assets/js/preload.js"),
            enableRemoteModule: true,
            nodeIntegration: true,
            webSecurity: false, // Disable same-origin policy
            allowRunningInsecureContent: true, // Allow loading of resources over http
            contextIsolation: false,
            webviewTag: true,
        },
    });
    windows.add(mainWindow)

    mainWindow.loadFile('./src/renderer/index.html');

    mainWindow.on('closed', async function () {
        windows.delete(mainWindow);
        mainWindow = null;
        await allWindowClosed();
    });

    ipc.on("maximize-aqua-ide", () => {
        if (mainWindow.isMaximized()) {
            mainWindow.restore();
        } else {
            mainWindow.maximize();
        }
    });

    ipc.on("minimize-aqua-ide", () => {
        mainWindow.minimize();
    });

    allWindowClosed();

    isOpenWindow = true;
}

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

autoUpdater.on("update-downloaded", (event) => {
    log.error("update downloaded");
    const dialogOpts = {
        type: "question",
        buttons: ["Restart", "Later"],
        title: "Application Update",
        message: "New Update Downloaded",
        detail: "A new version has been downloaded. Restart the application to apply the updates."
    }

    dialog.showMessageBox(dialogOpts).then((returnValue) => {
        if (returnValue.response === 0) autoUpdater.quitAndInstall()
    })
})

autoUpdater.on('update-not-available', () => {
    log.error("No update available");
})

autoUpdater.on('checking-for-update', function () {
    console.log('Checking for update...');
    log.error("Checking for update...");
});

autoUpdater.on('error', (message) => {
    console.error('There was a problem updating the application')
    console.error(message)
    log.error("There was a problem updating the application");
    log.error(message);
})

ipc.on("open-new-window", () => {
    createWindow();
    isOpenWindow = false;
});

/*
 * When window is ready
 * */
app.on('ready', () => {
    if (isOpenWindow) {
        createWindow();
    }
    autoUpdater.checkForUpdates().then((e) => {
        console.log("Update check function called");
        log.info("Update check function called");
    });
});

/*
 * Close all the windows
 * */
ipc.on("close-all-aqua-ide", async () => {
    const readConfigData = await fs.readFileSync(configJsonURL);
    // Parse the JSON data
    const configJson = JSON.parse(readConfigData);
    // Clear the recent opened folder
    configJson.recentOpened = "";
    configJson.windowOpen = false;
    await fs.writeFileSync(configJsonURL, JSON.stringify(configJson));
    // Quite all the windows
    app.quit();
});

/*
 * Restart the IDE
 * */
ipc.on("restart-ide", async () => {
    const readConfigData = await fs.readFileSync(configJsonURL);
    // Parse the JSON data
    const configJson = JSON.parse(readConfigData);
    // Clear the recent opened folder
    configJson.windowOpen = false;
    await fs.writeFileSync(configJsonURL, JSON.stringify(configJson));
    // Quite all the windows
    app.relaunch();
    app.quit();
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

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (windows.size === 0) {
        createWindow();
    }
});
//
// require('electron-reload')(__dirname, {
//     electron: path.join("node_modules\\", '.bin', 'electron')
// });

async function allWindowClosed() {
    if (windows.size === 0) {
        const readConfigData = await fs.readFileSync(configJsonURL);
        // Parse the JSON data
        const configJson = JSON.parse(readConfigData);
        // Clear the recent opened folder
        configJson.windowOpen = false;
        await fs.writeFileSync(configJsonURL, JSON.stringify(configJson));
    }
}
