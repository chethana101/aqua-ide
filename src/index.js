const {app, BrowserWindow, ipcMain, dialog, shell, screen} = require('electron');
const path = require("path");
const fs = require("fs");
const ipc = ipcMain;
const log = require("electron-log");
const { autoUpdater } = require("electron-updater");

/**
 * Config logs
 * */
log.transports.file.getFile().path = __dirname + "\\aqua.log";
log.transports.file.format =
    "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}";

/**
 * Variables
 * */
let mainWindow;
let isOpenWindow = true;
const configJsonURL = __dirname + '\\renderer\\settings\\config.json';
let windows = new Set();

/**
 * Create main window function
 * */
function createWindow() {
    // Get current screen width height
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    // Create main window
    let mainWindow = new BrowserWindow({
        width: width,
        height: height,
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
    windows.add(mainWindow);

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

/**
 * Aqua IDE auto update configurations
 * */
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

autoUpdater.on("checking-for-update", function () {
    console.log("Checking for update...");
    log.info("Checking for update...");
});
autoUpdater.on("update-available", () => {
    log.info("Update available");
    const dialogOpts = {
        type: "question",
        buttons: ["Download Now", "Later"],
        title: "Update Found",
        message: "New Update Found!",
        detail: "A new version has been released. Click on download now button to download the new update."
    }

    dialog.showMessageBox(dialogOpts).then((returnValue) => {
        if (returnValue.response === 0) {
            autoUpdater.downloadUpdate();
        }
    });
});
autoUpdater.on("update-not-available", () => {
    log.info("No update available");
});
autoUpdater.on("download-progress", (event) => {
    console.log("Percentage: " + event.percent);
    console.log("Bytes Per Second: " + event.bytesPerSecond);
});
autoUpdater.on("update-downloaded", (event) => {
    log.info("update downloaded");
    const dialogOpts = {
        type: "question",
        buttons: ["Restart", "Later"],
        title: "Application Update",
        message: "New Update Downloaded",
        detail: "A new version has been downloaded. Restart the application to apply the updates."
    }

    dialog.showMessageBox(dialogOpts).then((returnValue) => {
        if (returnValue.response === 0) {
            autoUpdater.quitAndInstall();
        }
    });
});
autoUpdater.on("error", (message) => {
    console.error("There was a problem updating the application")
    console.error(message)
    log.info("There was a problem updating the application");
    log.info(message);
});

/**
 * Open new window
 * */
ipc.on("open-new-window", () => {
    createWindow();
    isOpenWindow = false;
});

/**
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

/**
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

/**
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

/**
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

/**
 * Move to the recycle bin, files or folders
 * */
ipc.on("move-to-trash", (event, json) => {
    if (!fs.existsSync(json.path)) {
        return "File not exists";
    }
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

/**
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

/**
 * Close all the windows
 * */
app.on("window-all-closed", function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

/**
 * Activate
 * */
app.on("activate", function () {
    if (windows.size === 0) {
        createWindow();
    }
});

/**
 * Close the window - function
 * */
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
