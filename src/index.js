process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = true;

const {
  app,
  BrowserWindow,
  ipcMain,
  Tray,
  Menu
} = require("electron");
const path = require("path");
const log = require("electron-log");

const { autoUpdater } = require('electron-updater');

app.disableHardwareAcceleration();

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";
log.info("App starting...");

let tray;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

let mainWindow;

const createWindow = () => {
  // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 1360,
      height: 850,
      icon: __dirname + "/assets/images/js.ico",
      autoHideMenuBar: true,
      frame: false,
      backgroundColor: "#eee",
      show: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
        preload: path.join(__dirname, '/assets/js/preload.js'),
        //   devTools: false,
      },
    });

    splash = new BrowserWindow({
        width: 510,
        height: 410,
        transparent: true,
        frame: false,
        alwaysOnTop: true,
    });

    //   and load the index.html of the app.
    splash.loadURL(path.join(__dirname, "splash.screen.html"));

    mainWindow.loadFile(path.join(__dirname, "index.html"));

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
    mainWindow.once("ready-to-show", () => {
        splash.destroy();
        mainWindow.show();
    });

    ipcMain.on("close", (event, arg) => {
        mainWindow.close();
    });

    ipcMain.on("maximize", (event, arg) => {
        
        if(mainWindow.isMaximized()) {
            mainWindow.unmaximize();
        }
        else {
            mainWindow.maximize();
        }
    });

    ipcMain.on("minimize", (event, arg) => {
        mainWindow.minimize();
    });
    
    const icon = __dirname + "/assets/images/js.ico";
    tray = new Tray(icon);
    
    const contextMenu = Menu.buildFromTemplate([
        { label: "Open", click() {mainWindow.focus()} },
        { label: "Setting" },
        { label: "About", role: 'about' },
        { label: "Exit", role: 'quit' },
    ]);
    
    tray.setToolTip("Postmaster");
    tray.setContextMenu(contextMenu);

    mainWindow.webContents.on("did-finish-load", () => {
      mainWindow.webContents.send("ping", app.getVersion());
    });

    autoUpdater.checkForUpdates();
};


app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {

  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

const sendStatusToWindow = (text,data) => {
  log.info(text);
  if (mainWindow) {
    mainWindow.webContents.send("message", text,data);
  }
};
autoUpdater.on("checking-for-update", () => {
  sendStatusToWindow('checking',null);
});

autoUpdater.on("update-available", () => {
  sendStatusToWindow('updateAvailable', null);
});

autoUpdater.on("update-not-available", () => {
  sendStatusToWindow('up-to-date', null);
});

autoUpdater.on("error", (err) => {
  sendStatusToWindow('error',err.toString());
});

autoUpdater.on("download-progress", (progressObj) => {
  sendStatusToWindow('downloading', progressObj);
});

autoUpdater.on("update-downloaded", (event, notes, name, date) => {
    let data = {
        name,
        notes,
        date
    }
  sendStatusToWindow('downloaded',data);

  autoUpdater.quitAndInstall();
});