import path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}

let mainWindow;
let databaseWorker;

const isDevMode = !!process.execPath.match(/[\\/]electron/);

const createWindow = async () => {

    // Create the browser window.
    mainWindow = new BrowserWindow({
        show: false,
        title: 'Pandora Market',
        width: 800,
        height: 600,
        icon: path.resolve(__dirname, '../assets/icons/favicon-96x96.png')
    });

    // Create hidden window for the Database manager
    databaseWorker = new BrowserWindow({
        webPreferences: {
            nodeIntegrationInWorker: true
        },
        icon: path.resolve(__dirname, '../assets/icons/favicon-96x96.png')
        // show: false
    });

    // Show loaded window
    mainWindow.on('ready-to-show', () => mainWindow.show());

    ipcMain.on('dbWorkerReadyForStart', () => {
        databaseWorker.webContents.send('dbStart');
    });

    ipcMain.on('dbInitialized', evt => {
        console.log('===== DB OK!!!!!');
    });

    ipcMain.on('dbError', (evt, err) => {
        console.log('===== DB ERROR!!!!!');
        console.error(err);
    });

    // Open the DevTools.
    // if (isDevMode) {
        
    //     await Promise.all([
    //         REACT_DEVELOPER_TOOLS, 
    //         REDUX_DEVTOOLS
    //     ].map(ext => installExtension(ext)));
        mainWindow.webContents.openDevTools();
        databaseWorker.webContents.openDevTools();        
    // }

    // Setup database
    // databaseWorker.loadFile(path.resolve(__dirname, '../db_worker/index.html'));
    databaseWorker.loadURL(DB_WORKER_WEBPACK_ENTRY);// eslint-disable-line

    // and load the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);// eslint-disable-line

    mainWindow.on('close', event => {
        // event.preventDefault();

        // databaseWorker.on('dbStopped', () => {
        //     databaseWorker.destroy();
        //     databaseWorker = null;            
        // });

        // console.log('!!! Going to stop DB');
        // setInterval(() => databaseWorker.send('helooo', 'whoooooooh!'), 1000);
        // databaseWorker.webContents.send('stop');
    });

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.

        mainWindow = null;
    });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});
