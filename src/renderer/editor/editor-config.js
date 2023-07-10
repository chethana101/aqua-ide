// const electron = require('electron') ;
// const {ipcMain} = electron;

// ipcMain.on('testMessage', (event, i) => { alert(`Message from main window to tab ${i}`); });

const editor = ace.edit('editor-container');
editor.setTheme('ace/theme/monokai');
editor.getSession().setMode('ace/mode/javascript');
