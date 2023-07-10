const {app, ipcRenderer} = require("electron");
const ipc = ipcRenderer;
const path = require("path");
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
        window.close();
    });

/*----------------------------------------
* Resize the editor container
*----------------------------------------*/
window.resizeEditorContainer = function () {
    Array.from(document.querySelectorAll(".editor-container"))
        .forEach(function (editorEl) {
            if (editorEl != undefined) {
                ace.edit(editorEl).resize();
            }
        });
}

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

/*----------------------------------------
* Split.js init
*----------------------------------------*/
let Split = require('split.js');
const fs = require("fs");

var split = Split(['#side-bar-panels', '#title-bar-and-editor'], {
    sizes: [20, 80],
    minSize: 0,
    gutterSize: 2,
    expandToMin: true,
    onDrag: function (e) {
    },
    cursor: 'e-resize',
    elementStyle: function (dimension, size, gutterSize) {
        // Resize the editor
        resizeEditorContainer();
        return {
            'flex-basis': 'calc(' + size + '% - ' + gutterSize + 'px)',
        }
    },
    gutterStyle: function (dimension, gutterSize) {
        return {
            'flex-basis': gutterSize + 'px',
        }
    },
});

/*----------------------------------------
* Selector style action
*----------------------------------------*/
const element = document.getElementById("aqua-theme-selector");
themeChoices = new Choices(element, {
    allowHTML: true,
    removeItemButton: false,
    paste: false,
    searchEnabled: false,
    itemSelectText: "",
});

/*-------------------------------------
* Selector border style actions
*------------------------------------*/
document.querySelectorAll(".select-selected")
    .forEach((ele) => {
        ele.addEventListener("click", () => {
            ele.style.border = "1.5px solid var(--primary-color)";
        });
    });
document.querySelectorAll(".field")
    .forEach((ele, key) => {
        const fieldBox = document.querySelectorAll(".field-input");
        ele.addEventListener("focus", () => {
            ele.style.border = "1.5px solid var(--primary-color)";
        });
        ele.addEventListener("blur", () => {
            ele.style.border = "1.5px solid var(--selector-border-default)";
        });
    });

/*-------------------------------------
* Sidebar panel actions
*------------------------------------*/
const sideBarIdHolder = [];
document.querySelectorAll(".side-bar-item-toggle")
    .forEach((element, key) => {
        // Assign all the id's to the array
        sideBarIdHolder.push(element.dataset.id);
        // Add click listener to icon toggle
        element.addEventListener("click", () => {
            // Check if element exist or not
            if (sideBarIdHolder[key] !== undefined || sideBarIdHolder[key] != null) {
                document.querySelector("#" + sideBarIdHolder[key])
                    .style.display = "block";
                // Hide un-wanted panels
                sideBarIdHolder.forEach((id) => {
                    if (sideBarIdHolder[key] != id) {
                        let elementHideId = document.getElementById(id);
                        if (elementHideId != undefined || elementHideId != null) {
                            document.getElementById(id).style.display = "none";
                        }
                    }
                });
            }
            // Check if item is select or not
            if (element.classList.contains('side-bar-item-select')) {
                document.getElementById("side-bar-panels")
                    .style.flexBasis = "calc(20% - 1px)";
                document.getElementById("title-bar-and-editor")
                    .style.flexBasis = "calc(80% - 1px)";
            } else {
                document.getElementById("side-bar-panels")
                    .style.flexBasis = "calc(0% - 1px)";
                document.getElementById("title-bar-and-editor")
                    .style.flexBasis = "calc(100% - 1px)";
            }
            // Resize the editor
            resizeEditorContainer();
        });
    });

/*-------------------------------------
* Dropdown menus
*------------------------------------*/
// Select all dropdown toggle buttons and menu lists
const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
const dropdownMenus = document.querySelectorAll('.dropdown-menu');

// Hide all dropdown menus by default
dropdownMenus.forEach((menu) => {
    menu.style.display = 'none';
});

// Add a click event listener to each dropdown toggle button
dropdownToggles.forEach((toggle) => {
    toggle.addEventListener('click', function (e) {
        // Prevent default button behavior
        e.preventDefault();

        // Hide all other open dropdown menus
        dropdownMenus.forEach((menu) => {
            if (menu !== toggle.nextElementSibling) {
                menu.style.display = 'none';
            }
        });

        // Toggle the visibility of this dropdown menu
        toggle.nextElementSibling.style.display = toggle.nextElementSibling.style.display === 'block' ? 'none' : 'block';
    });
});

// Add a click event listener to the document to hide all dropdown menus
document.addEventListener('click', function (e) {
    // Check if the click was outside of a dropdown menu
    let isOutsideDropdown = true;
    dropdownToggles.forEach((toggle) => {
        if (toggle.contains(e.target)) {
            isOutsideDropdown = false;
        }
    });
    dropdownMenus.forEach((menu) => {
        if (menu.contains(e.target)) {
            isOutsideDropdown = false;
        }
    });

    // Hide all dropdown menus if the click was outside of them
    if (isOutsideDropdown) {
        dropdownMenus.forEach((menu) => {
            menu.style.display = 'none';
        });
    }
});

/*-------------------------------------
* Open new window
*------------------------------------*/
document.getElementById("title-bar-open-new-window")
    .addEventListener("click", () => {
        ipc.send('open-new-window');
        document.getElementById("dropdown-menu-main-toggle")
            .style.display = "none";
    });

/*-------------------------------------
* Close the current window
*------------------------------------*/
document.getElementById("title-bar-close-window")
    .addEventListener("click", () => {
        window.close();
        document.getElementById("dropdown-menu-main-toggle")
            .style.display = "none";
    });

/*-------------------------------------
* Close all the windows
*------------------------------------*/
document.getElementById("title-bar-close-all-window")
    .addEventListener("click", () => {
        ipc.send('close-all-aqua-ide');
        document.getElementById("dropdown-menu-main-toggle")
            .style.display = "none";
    });

/*----------------------------------------
* Settings update
*----------------------------------------*/
// TODO:: Refactor this function
document.getElementById("apply_settings").addEventListener("click", () => {
    const editorFontSize = document.querySelector("#aqua_editor_font_size");
    const themeValue = document.getElementById("aqua-theme-selector");
    const settingsPath = path.join(__dirname, "settings/config.json");
    const readConfigData = fs.readFileSync(settingsPath);

    if (themeValue == null) {
        console.log("Theme can not be null");
    } else if (editorFontSize.value == null || editorFontSize.value == "") {
        editorFontSize.style.border = "1.5px solid var(--danger)";
    } else {
        // Remove the font size error
        if (editorFontSize.style.border == "1.5px solid var(--danger)") {
            editorFontSize.style.border = "1.5px solid var(--selector-border-default)";
        }
        // Parse the JSON data
        const configJson = JSON.parse(readConfigData);
        configJson.theme = themeValue.value;
        configJson.editorFontSize = editorFontSize.value + "px";
        fs.writeFileSync(settingsPath, JSON.stringify(configJson));

        // Open the confirmation dialog box
        let aquaSettingConfirmDialog = $("#aquaSettingsConfirmDialog").dialog({
            title: "<img class='aqua-dialog-box-icon' src='./assets/images/aqua-ide-logo.png' width='18'> Restart IDE",
            autoOpen: false,
            resizable: false,
            draggable: true,
            opening: function (e) {
                window.viewDialogBox();
            },
            closed: function (e) {
                window.hideDialogBox();
            }
        });
        aquaSettingConfirmDialog.open();
    }
});

// Dialog box view
// TODO:: This function available on directory.js. Refactor this
window.viewDialogBox = function () {
    document.getElementById("aqua-popup-box-background")
        .style.display = "block";
}

// Dialog box hide
window.hideDialogBox = function () {
    document.getElementById("aqua-popup-box-background")
        .style.display = "none";
}

// Restart the IDE
document.getElementById("aqua_settings_confirm_dialog_confirm_button")
    .addEventListener("click", () => {
        ipc.send('restart-ide');
    });
