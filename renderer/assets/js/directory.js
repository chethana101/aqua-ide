/*----------------------------------------
* Include libraries
*----------------------------------------*/
const dirTree = require("directory-tree");
const path = require("path");
const fs = require("fs");
const {ipcRenderer} = require('electron');
import {
    removeObjectFromArray,
    footerNavigateBuilder,
    seperateFolders,
    createNewFolder,
    getFileIcon,
} from '../../assets/js/common.js';

// Directory tree variables
// Selected directory/file data
window.directorySelectGlobal = [];
window.directoryIsRightClick = true;
window.editorsConfigIds = [];
window.openedFolderName = null;
window.totalFolderCount = 0;

// Popup variables
let createNewFileDialog;
let createNewFolderDialog;
let aquaRenameDialog;
let aquaConfirmDialog;

ipcRenderer.on('window-loaded', async function () {
    console.log('Window loaded');
});

/*----------------------------------------
* Create new web workers
*----------------------------------------*/
const worker = new Worker('./workers/directory-read-worker.js');
const workerDirectoryDataProcess = new Worker('./workers/directory-data-process-worker.js');

/*----------------------------------------
* Get directory data
*----------------------------------------*/
const titleBarOpenFolder = document.getElementById("title-bar-open-folder");
titleBarOpenFolder.addEventListener("click", async () => {
    let folderData = await ipcRenderer.sendSync("open-output-dialog", {data: true});
});

// TODO:: Remove after testing. Combine with `open folder` feature
const openedFolderPath = "C:\\Users\\TigEr_MP\\Desktop\\Text Document";
window.openedFolderName = path.basename(openedFolderPath);

// Set footer navigator
footerNavigateBuilder(
    {rootName: window.openedFolderName},
);

const treeDatra = dirTree(openedFolderPath, {
    attributes: ["size", "type", "extension", "mode", "mtime"],
});
worker.postMessage(treeDatra.children);

/*----------------------------------------
* Set directory
*----------------------------------------*/
let $tree;
let processedTreeData;
worker.addEventListener('message', (event) => {
    processedTreeData = event.data.directoryResources;
    window.totalFolderCount = event.data.folderCount;

    fs.writeFileSync(__dirname + '\\settings\\fileData.json', JSON.stringify(processedTreeData));

    $tree = $('#directory').tree({
        primaryKey: 'id',
        dataSource: __dirname + '\\settings\\fileData.json',
        lazyLoading: true,
        imageCssClassField: 'faCssClass',
        autoLoad: false,
        icons: {
            expand: '<span class="icon-right-arrow"></span>',
            collapse: '<span class="icon-down-arrow"></span>'
        },
        // Add a select event listener to the Gijgo Tree
        select: async function (e, node, id) {
            // Unassigned old data
            window.directorySelectGlobal = [];
            // Assigned new data
            window.directorySelectGlobal.push($tree.getDataById(id));

            // If left click only
            if (window.directoryIsRightClick) {
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
                    } else {
                        let tabGroup = document.querySelector("tab-group");
                        let tab = tabGroup.getTab(parseInt(id));
                        tab.activate();
                    }
                }
                let pathAfterRoot = seperateFolders(
                    window.directorySelectGlobal[0].filePath,
                );
                footerNavigateBuilder(
                    {
                        rootName: window.openedFolderName,
                        allFiles: pathAfterRoot,
                        imageHtml: window.directorySelectGlobal[0].imageHtml,
                    }, true);
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
            // If rigth clicked element is file
            const focusElement = $tree.getDataById($tree.getSelections()[0]);
            if (focusElement.type == "file") {
                document.getElementById("contextmenu-create-new-file-action").style.display = "none";
                document.getElementById("contextmenu-create-new-folder-action").style.display = "none";
            } else {
                document.getElementById("contextmenu-create-new-file-action").style.display = "flex";
                document.getElementById("contextmenu-create-new-folder-action").style.display = "flex";
            }
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

document.getElementById("container-footer")
    .addEventListener("click", () => {
        $tree.reload();
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

/*----------------------------------------
* Create new folder
*----------------------------------------*/
document.getElementById("aqua_create_folder_file_button")
    .addEventListener("click", () => {
        const folderName = document.getElementById("aqua_create_folder_file");
        if (folderName.value != "") {
            let path = null;
            let selectedItemData = window.directorySelectGlobal;

            if (selectedItemData.length === 0) {
                path = openedFolderPath + "\\" + folderName.value;
            } else {
                path = selectedItemData[0].filePath + "\\" + folderName.value;
            }
            // Create folder
            createNewFolder(path);
            // Add file/folder on directory tree view
            createFolderTreeNode(selectedItemData, folderName, path);
            // Clear the field
            folderName.value = "";
            // Close the folder create dialog
            createNewFolderDialog.close();
        }
    });

document.getElementById("aqua-create-new-folder-header")
    .addEventListener("click", () => {
        const focusElement = $tree.getDataById($tree.getSelections()[0]);
        if (focusElement.type == "directory") {
            createNewFolderDialog.open();
        }
    });

// Read the JSON data from the file
const readedFileData = fs.readFileSync(__dirname + '\\settings\\fileData.json');
function createFolderTreeNode(selectedItemData, folderName, pathNew) {
    // Add object to the json file
    // Parse the JSON data
    const exportedJsonData = JSON.parse(readedFileData);

    const newItem = {
        id: ++window.totalFolderCount,
        filePath: pathNew,
        text: folderName.value,
        type: "directory",
        extension: "",
        imageHtml: getFileIcon({
            file: "directory",
            extension: "",
            text: folderName.value,
        }, false),
    };

    // if (objectToUpdate) {
    //     if (newItem.type === "directory") {
    //         if (objectToUpdate?.children) {
    //             objectToUpdate.children.unshift(newItem);
    //         } else {
    //             objectToUpdate.children = [newItem];
    //         }
    //     } else {
    //         objectToUpdate.children.push(newItem);
    //     }
    // }

    if (typeof selectedItemData === "string") {
        selectedItemData = 0;
    }

    const dataForWorker = {
        parent: selectedItemData,
        jsonData: exportedJsonData,
        newObject: newItem,
    };
    workerDirectoryDataProcess.postMessage(dataForWorker);
    workerDirectoryDataProcess.addEventListener('message', (event) => {
        console.log(event.data.directoryResources.length);
        // Write the updated JSON data back to the file
        if (event.data.directoryResources.length != 0) {
            fs.writeFileSync(
                __dirname + '\\settings\\fileData.json',
                JSON.stringify(event.data.directoryResources)
            );
            $tree.reload();
        }
    });

    // // Get the list element
    // var list = $tree.getNodeById(selectedItemData[0].id)[0].querySelector('.gj-list');
    // console.log(list);
    //
    // // // Get all the list items
    // // var listItems = list.querySelectorAll('li');
    // //
    // // // Convert the list items to an array for sorting
    // // var listArray = Array.prototype.slice.call(listItems);
    // //
    // // // Sort the array based on the icon type (folders first)
    // // listArray.sort(function (a, b) {
    // //     var aIcon = a.querySelector('.icon-gray-folder-icon') ? 'folder' : 'file';
    // //     var bIcon = b.querySelector('.icon-gray-folder-icon') ? 'folder' : 'file';
    // //     if (aIcon === bIcon) {
    // //         return 0;
    // //     } else if (aIcon === 'folder') {
    // //         return -1;
    // //     } else {
    // //         return 1;
    // //     }
    // // });
    // //
    // // // Reinsert the sorted list items into the list
    // // listArray.forEach(function (li) {
    // //     list.appendChild(li);
    // // });
}

