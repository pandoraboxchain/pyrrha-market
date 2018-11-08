import path from 'path';
import { app, ipcMain, BrowserWindow, Tray, Menu } from 'electron';
import pack from '../package.json';
import log, { createLogger } from './logger';
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS, REACT_PERF } from 'electron-devtools-installer';
import startBoxproxy, { stop as stopBoxproxy } from './boxproxy';

// Main Browser window
let mainWindow;
let mainTray = null;

// Database API referense
let boxproxyDbApi;

const isDevMode = !!process.execPath.match(/[\\/]electron/);

createLogger(isDevMode ? 'silly' : 'warn');

startBoxproxy()
    .then(boxproxy => {
        boxproxyDbApi = boxproxy.api;
    })
    .catch(err => {
        log.error('Boxproxy error occurred:', err);
        app.quit();
    });

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}

const createWindow = async () => {

    try {

        // Create the browser window.
        mainWindow = new BrowserWindow({
            show: false,
            title: 'Pandora Market',
            width: 800,
            height: 600,
            icon: path.resolve(__dirname, '../assets/icons/favicon-96x96.png')
        });

        // Show loaded window
        mainWindow.on('ready-to-show', () => {
            mainWindow.show();

            // Open the DevTools
            if (isDevMode) {

                mainWindow.webContents.openDevTools();
            }
        });

        mainWindow.on('close', event => {
            
        });

        // Emitted when the window is closed.
        mainWindow.on('closed', () => {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.

            stopBoxproxy()
                .then(() => {
                    log.debug('Boxproxy has been closed');
                    mainWindow = null;
                })
                .catch(err => {
                    log.error('Boxproxy error occurred:', err);
                    mainWindow = null;
                });            
        });

        // Install the DevTools
        if (isDevMode) {
            
            await Promise.all([
                REACT_DEVELOPER_TOOLS, 
                REDUX_DEVTOOLS,
                REACT_PERF
            ].map(ext => installExtension(ext)));
        }

        // and load the app.
        mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);// eslint-disable-line
        
        // System Tray
        mainTray = new Tray(path.resolve(__dirname, '../assets/icons/favicon-96x96.png'));
        mainTray.setTitle(pack.name);
        const mainTrayMenu = Menu.buildFromTemplate([
            {
                label: 'Quit',
                click: () => app.quit()
            }
        ]);
        mainTray.setContextMenu(mainTrayMenu);
        
    } catch (err) {

        log.error('An error occurred during createWindow:', err);
        app.quit();
    }
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

        createWindow().catch(err => {
            log.error('Error occurred during main window creation:', err);
            app.quit();
        });
    }
});

// ipcMain.on('cmd', (event, data) => console.log('!!!', data));
