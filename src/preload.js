const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('rhymeAPI', {
    findRhymes: (word, maxResults) => ipcRenderer.invoke('rhyme:find', word, maxResults),
    getStress: (word) => ipcRenderer.invoke('rhyme:stress', word),
    compareWords: (word1, word2) => ipcRenderer.invoke('rhyme:compare', word1, word2),
});
