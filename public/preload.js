const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    // Timer management
    sendTimerUpdate: (data) => {
        ipcRenderer.send('timer-update', data);
    },
    onTimerUpdate: (callback) => {
        ipcRenderer.on('timer-update', (_, data) => callback(data));
    },

    // Theme management
    sendThemeChange: (theme) => {
        ipcRenderer.send('theme-change', theme);
    },
    onThemeChange: (callback) => {
        ipcRenderer.on('theme-change', (_, theme) => callback(theme));
    },

    // Window identification
    isDisplayWindow: () => window.location.hash.includes('display'),

    // Cleanup
    removeListeners: () => {
        ipcRenderer.removeAllListeners('timer-update');
        ipcRenderer.removeAllListeners('theme-change');
    }
});

// Disable eval
//window.eval = global.eval = function () {
   // throw new Error('Sorry, this app does not support window.eval().');
