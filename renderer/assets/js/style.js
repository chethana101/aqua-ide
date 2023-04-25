const {ipcRenderer} = require("electron");
const ipc = ipcRenderer;

/*----------------------------------------
* Title bar toggle actions
*----------------------------------------*/
document.getElementById("aqua-ide-minimize")
    .addEventListener("click", () => {
        ipc.send('minimize-aqua-ide');
    });
document.getElementById("aqua-ide-maximize")
    .addEventListener("click", () => {
        ipc.send('maximize-aqua-ide');
    });
document.getElementById("aqua-ide-close")
    .addEventListener("click", () => {
        ipc.send('close-aqua-ide');
    });

/*----------------------------------------
* Side bar menu item click event
*----------------------------------------*/
const sideBarItem = document.querySelectorAll(".side-bar-item");
sideBarItem.forEach((element, key) => {
    element.addEventListener("click", (e) => {
        // Remove current element selected event
        sideBarItem.forEach((element, keySub) => {
            if (key != keySub) {
                element.classList.remove("side-bar-item-select");
            }
        });
        // Add selected color to the element
        e.target.closest(".side-bar-item").classList.toggle("side-bar-item-select");
    });
});

// -------------------------------------
// Split
// -------------------------------------
let Split = require('split.js');

Split(['#side-bar-panels', '#title-bar-and-editor'], {
    sizes: [20, 80],
    minSize: 0,
    gutterSize: 2,
    expandToMin: true,
    onDrag: function (e) {
    },
    cursor: 'e-resize',
    elementStyle: function (dimension, size, gutterSize) {
        // TODO:: This might be effected to the performance
        Array.from(document.querySelectorAll(".editor-container"))
            .forEach(function(editorEl) {
                ace.edit(editorEl).resize();
        });
        return {
            'flex-basis': 'calc(' + size + '% - ' + gutterSize + 'px)',
        }
    },
    gutterStyle: function (dimension, gutterSize) {
        return {
            'flex-basis': gutterSize + 'px',
        }
    },
})
