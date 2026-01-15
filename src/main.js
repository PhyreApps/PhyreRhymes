const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const RhymeCLIHandler = require('./rhyme-cli-handler');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // and load the index.html of the app.
  console.log(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
 // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers for rhyme CLI
ipcMain.handle('rhyme:find', async (event, word, maxResults) => {
    try {
        const result = await RhymeCLIHandler.findRhymes(word, maxResults);
        return result;
    } catch (error) {
        console.error('Error in rhyme:find handler:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('rhyme:stress', async (event, word) => {
    try {
        const result = await RhymeCLIHandler.getStress(word);
        return result;
    } catch (error) {
        console.error('Error in rhyme:stress handler:', error);
        return null;
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
