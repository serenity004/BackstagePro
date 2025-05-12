const { app, BrowserWindow, ipcMain, screen } = require('electron'); // Added screen
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;
let displayWindow;

function getSecondaryDisplay() {
    const displays = screen.getAllDisplays();
    const primaryDisplay = screen.getPrimaryDisplay();
    return displays.find(display => display.id !== primaryDisplay.id);
}

function moveDisplayToSecondary() {
    const secondaryDisplay = getSecondaryDisplay();
    if (secondaryDisplay && displayWindow) {
        displayWindow.setBounds({
            x: secondaryDisplay.bounds.x,
            y: secondaryDisplay.bounds.y,
            width: secondaryDisplay.bounds.width,
            height: secondaryDisplay.bounds.height
        });
        displayWindow.setFullScreen(true);
    }
}

function createWindows() {
    // Control window
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    // Display window
    const secondaryDisplay = getSecondaryDisplay();
    displayWindow = new BrowserWindow({
        fullscreen: true,
        x: secondaryDisplay?.bounds.x || 0,
        y: secondaryDisplay?.bounds.y || 0,
        width: secondaryDisplay?.bounds.width || 1024,
        height: secondaryDisplay?.bounds.height || 768,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    if (isDev) {
        mainWindow.loadURL('http://localhost:3000');
        displayWindow.loadURL('http://localhost:3000/#/display');
        mainWindow.webContents.openDevTools();
    } else {
        const indexPath = path.join(__dirname, 'index.html');
        mainWindow.loadFile(indexPath);
        displayWindow.loadFile(indexPath, { hash: '#/display' });
    }

    // Monitor display changes
    screen.on('display-added', (event, display) => {
        moveDisplayToSecondary();
    });

    screen.on('display-removed', (event, display) => {
        // If the secondary display was removed, move to primary
        if (!getSecondaryDisplay() && displayWindow) {
            const primaryDisplay = screen.getPrimaryDisplay();
            displayWindow.setBounds(primaryDisplay.bounds);
            displayWindow.setFullScreen(true);
        }
    });

    // IPC handlers
    ipcMain.on('timer-update', (event, timerData) => {
        displayWindow?.webContents.send('timer-update', timerData);
    });

    ipcMain.on('theme-change', (event, theme) => {
        displayWindow?.webContents.send('theme-change', theme);
    });

    // Handle window management
    mainWindow.on('closed', () => {
        mainWindow = null;
        app.quit();
    });

    displayWindow.on('closed', () => {
        displayWindow = null;
    });
}

app.whenReady().then(createWindows);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindows();
    }
});