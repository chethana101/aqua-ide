/*----------------------------------------
* Include libraries
*----------------------------------------*/
const dirTree = require("directory-tree");
const path = require("path");
import { removeObjectFromArray, footerNavigateBuilder } from '../../assets/js/common.js';

// Directory tree variables
// Selected directory/file data
window.directorySelectGlobal = [];
window.directoryIsRightClick = true;
window.editorsConfigIds = [];
window.openedFolderName = null;

// Popup variables
let createNewFileDialog;
let createNewFolderDialog;
let aquaRenameDialog;
let aquaConfirmDialog;

const {ipcRenderer} = require('electron');
ipcRenderer.on('window-loaded', async function () {
    console.log('Window loaded');
});

/*----------------------------------------
* Create new web workers
*----------------------------------------*/
const worker = new Worker('./worker.js');

/*----------------------------------------
* Get directory data
*----------------------------------------*/
const titleBarOpenFolder = document.getElementById("title-bar-open-folder");
titleBarOpenFolder.addEventListener("click", async () => {
    let folderData = await ipcRenderer.sendSync("open-output-dialog", {data: true});
    console.log(folderData);
});

// TODO:: Remove after testing. Combine with `open folder` feature
const openedFolderPath = "C:\\xampp8_1\\htdocs\\dashboard";
window.openedFolderName = path.basename(openedFolderPath);
// Set footer navigator
document.getElementById("footer-navigator")
    .append(
        footerNavigateBuilder({rootName: window.openedFolderName}, "directory")
    );

const treeDatra = dirTree(openedFolderPath, {
    attributes: ["size", "type", "extension", "mode", "mtime"],
});
worker.postMessage(treeDatra.children);

/*----------------------------------------
* Set directory
*----------------------------------------*/
let $tree;
worker.addEventListener('message', (event) => {
    const data = event.data;

    $tree = $('#directory').tree({
        primaryKey: 'id',
        dataSource: data,
        lazyLoading: false,
        imageCssClassField: 'faCssClass',
        autoLoad: false,
        icons: {
            expand: '<span class="icon-right-arrow"></span>',
            collapse: '<span class="icon-down-arrow"></span>'
        },
        // Add a select event listener to the Gijgo Tree
        select: function (e, node, id) {
            if (window.directoryIsRightClick) {
                // Unassigned old data
                window.directorySelectGlobal = [];
                // Assigned new data
                window.directorySelectGlobal.push($tree.getDataById(id));
                if (window.directorySelectGlobal[0].type == "file") {
                    // Check opening file exist on editor
                    const openEditors = window.editorsConfig.find(item => item.id == id);
                    if (openEditors == undefined) {
                        window.editorsConfigIds = removeObjectFromArray(window.editorsConfigIds, id);
                    }
                    // Opening file exist on local variable
                    const result = window.editorsConfigIds.find(item => item.id == id);
                    if (result == undefined) {
                        window.editorTabs(window.directorySelectGlobal[0]);
                        window.editorsConfigIds.push({id: id});
                    }
                }
            }
        },
    });

    // Load the directory tree to application
    $(document).ready(() => {
        $tree.reload();
        document.getElementById("pre-loader").style.display = "none";
        document.querySelector(".main-container").style.display = "block";
    });

    /*----------------------------------------
    * Directory right click action
    *----------------------------------------*/
    const $contextMenu = $('#right-click-popup');

    // Add a contextmenu event listener to the Gijgo Tree element
    $tree.on('contextmenu', function (e) {
        // Hide editor context menu if open
        $('#contextmenu-editor-popup').hide();
        // Prevent the default right-click menu from showing up
        e.preventDefault();

        // Get the target element that was right-clicked
        const $target = $(e.target);

        // Show the context menu only if a tree node was clicked
        if ($target.closest("li").data("role") == "node") {
            window.directoryIsRightClick = false;
            // Unselect all the selected items
            $tree.unselectAll();
            // Get selected items data
            const selectedItemdata = $tree.select($target.closest("li"));
            // Position the context menu where the user clicked
            $contextMenu.css({
                display: 'block',
                position: 'absolute',
                left: e.pageX,
                top: e.pageY,
            });

            // Add a click event listener to the context menu items
            $contextMenu.find('a').on('click', function (e) {
                // Hide the context menu when an item is clicked
                $contextMenu.hide();
                window.directoryIsRightClick = true;
            });
        } else {
            // Hide the context menu if anything else was clicked
            $contextMenu.hide();
            window.directoryIsRightClick = true;
        }
    });

    // Add a click event listener to the document object to hide the context menu
    $(document).on('click', function (e) {
        // Get the target element that was clicked
        const $target = $(e.target);

        // Hide the context menu if the target element is neither a Tree node nor a context menu item
        if (!$target.is('.node') && !$target.closest('.dropdown-menu').length) {
            window.directoryIsRightClick = true;
            $contextMenu.hide();
        }
    });

    // Dialog box view
    window.viewDialogBox = function () {
        document.getElementById("aqua-popup-box-background")
            .style.display = "block";
        $contextMenu.hide();
    }
    // Collapse directory tree
    document.getElementById("collapse-directory-tree")
        .addEventListener("click", () => {
            // $tree.collapseAll();
            document.querySelectorAll('[data-mode="open"]')
                .forEach((node) => {
                    $tree.collapse($(node.closest("li")));
                });
        });
});

/*----------------------------------------
* Popup boxed handling
*----------------------------------------*/
document.addEventListener("DOMContentLoaded", async () => {
    // Create New File
    createNewFileDialog = $("#aquaCreateNewFileDialog").dialog({
        title: prepareDialogTitle("Create New File"),
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
    // Create New Folder
    createNewFolderDialog = $("#aquaCreateNewFolderDialog").dialog({
        title: prepareDialogTitle("Create New Folder"),
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
    // Rename folders/files
    aquaRenameDialog = $("#aquaRenameDialog").dialog({
        title: prepareDialogTitle("Rename"),
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
    // Confirmation box
    aquaConfirmDialog = $("#aquaConfirmDialog").dialog({
        title: prepareDialogTitle("Confirm"),
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

    // Context menu delete action
    const contextMenuDeleteBtn =
        document.getElementById("contextmenu-delete-action");
    contextMenuDeleteBtn.addEventListener("click", () => {
        aquaConfirmDialog.open(this);
        document.getElementById("aquaConfirmDialogText").innerText =
            "Are you sure you want to " + contextMenuDeleteBtn.dataset.actionType + "?";
    });

    // Context menu create new FILE action
    document.getElementById("contextmenu-create-new-file-action")
        .addEventListener("click", () => {
            createNewFileDialog.open(this);
        });

    // Context menu create new FOLDER action
    document.getElementById("contextmenu-create-new-folder-action")
        .addEventListener("click", () => {
            createNewFolderDialog.open(this);
        });

    // Context menu rename action
    document.getElementById("contextmenu-rename-action")
        .addEventListener("click", () => {
            aquaRenameDialog.open(this);
        });
});

// Prepare dialog box title
function prepareDialogTitle(value) {
    return "<img class='aqua-dialog-box-icon' src='./assets/images/aqua-ide-logo.png' width='18'>" + value;
}

// Dialog box hide
window.hideDialogBox = function () {
    document.getElementById("aqua-popup-box-background")
        .style.display = "none";
}



