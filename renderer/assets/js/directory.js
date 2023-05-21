/*----------------------------------------
* Include libraries
*----------------------------------------*/
const dirTree = require("directory-tree");
const path = require("path");
const fs = require("fs");
const {ipcRenderer} = require('electron');
const chokidar = require('chokidar');
import {
    removeObjectFromArray,
    footerNavigateBuilder,
    seperateFolders,
    createNewFolder,
    getFileIcon,
    createNewFile,
    renameFileFolder,
    checkFileOrFolder,
    updateEditorFooterFileInfo,
    getFileType,
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
const workerRename = new Worker('./workers/rename-worker.js');
const workerDelete = new Worker('./workers/delete-file-folder-worker.js');

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

const treeData = dirTree(openedFolderPath, {
    attributes: ["size", "type", "extension", "mode", "mtime"],
});
worker.postMessage([treeData]);

/*----------------------------------------
* Set directory
*----------------------------------------*/
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
        unselect: function (e) {
            window.directorySelectGlobal = [];
        },
        render: function (e) {
            console.log(e);
        },
        dataBound: function (e) {
            $tree.expand($tree.getNodeById(0));
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
            // If right-clicked element is file
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

    $tree.on('expand', function (e, $node, id) {
        // let response = processedTreeData;
        // var i, $expander, $list, data = $tree.data();
        // if (typeof (response) === 'string' && JSON) {
        //     response = JSON.parse(response);
        // }
        // if (response && response.length) {
        //     $list = $node.children('ul');
        //     if ($list.length === 0) {
        //         $list = $('<ul />').addClass(data.style.list);
        //         $node.append($list);
        //     }
        //     for (i = 0; i < response.length; i++) {
        //         $tree.addNode(response[i], $list);
        //     }
        //     $expander = $node.find('>[data-role="wrapper"]>[data-role="expander"]'),
        //         $expander.attr('data-mode', 'open');
        //     $expander.empty().append(data.icons.collapse);
        //     gj.tree.events.dataBound($tree);
        // }
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
        opened: function () {
            document.getElementById("aqua_create_new_file_field").focus();
        },
        closed: function (e) {
            document.getElementById("aqua_create_new_file_field").value = "";
            document.getElementById("aquaCreateNewFileDialogError")
                .querySelector(".field-label").style.display = "none";
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
        opened: function () {
            document.getElementById("aqua_create_folder_file").focus();
        },
        closed: function (e) {
            document.getElementById("aqua_create_folder_file").value = "";
            document.getElementById("aquaCreateNewFolderDialogError")
                .querySelector(".field-label").style.display = "none";
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
            document.getElementById("aqua_rename_value").value = window.directorySelectGlobal[0].text;
            window.viewDialogBox();
        },
        opened: function () {
            document.getElementById("aqua_rename_value").focus();
        },
        closed: function (e) {
            document.getElementById("aqua_rename_value").value = "";
            document.getElementById("aquaRenameFileFolderDialogError")
                .querySelector(".field-label").style.display = "none";
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
        document.getElementById("aqua_confirm_dialog_confirm_button")
            .setAttribute("data-action-type-button", contextMenuDeleteBtn.dataset.actionType);
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
* File/folder action handler
*----------------------------------------*/
function createFolderFileTreeNode(selectedItemData, fieldValue, pathNew, config) {
    // Read the JSON data from the file
    const readedFileData = fs.readFileSync(__dirname + '\\settings\\fileData.json');
    // Parse the JSON data
    const exportedJsonData = JSON.parse(readedFileData);

    const newItem = {
        id: ++window.totalFolderCount,
        filePath: pathNew,
        text: fieldValue.value,
        type: config.type,
        extension: config.extension,
        imageHtml: getFileIcon({
            type: config.type,
            extension: config.extension,
            text: fieldValue.value,
        }, false),
    };

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
        // Write the updated JSON data back to the file
        if (event.data.directoryResources.length != 0) {
            fs.writeFileSync(
                __dirname + '\\settings\\fileData.json',
                JSON.stringify(event.data.directoryResources)
            );
            $tree.reload();
        }
    });
}

/*----------------------------------------
* Create new folder
*----------------------------------------*/
document.getElementById("aqua-create-new-folder-header")
    .addEventListener("click", () => {
        if (window.directorySelectGlobal.length) {
            const focusElement = $tree.getDataById(window.directorySelectGlobal[0].id);
            if (focusElement.type == "directory") {
                createNewFolderDialog.open();
            }
        }
    });

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
            let folderCreateData = createNewFolder(path);
            if (folderCreateData == null) {
                // Remove error message
                document.getElementById("aquaCreateNewFolderDialogError")
                    .querySelector(".field-label").style.display = "none";
                // Add file/folder on directory tree view
                createFolderFileTreeNode(selectedItemData, folderName, path, {
                    type: "directory",
                    extension: "",
                });
                // Clear the field
                folderName.value = "";
                // Close the folder create dialog
                createNewFolderDialog.close();
            } else {
                let errorElement = document.getElementById("aquaCreateNewFolderDialogError")
                    .querySelector(".field-label");
                errorElement.style.display = "block";
                errorElement.innerText = folderCreateData;
            }
        }
    });

/*----------------------------------------
* Create new file
*----------------------------------------*/
document.getElementById("aqua-create-new-file-header")
    .addEventListener("click", () => {
        if (window.directorySelectGlobal.length) {
            const focusElement = $tree.getDataById(window.directorySelectGlobal[0].id);
            if (focusElement.type == "directory") {
                createNewFileDialog.open();
            }
        }
    });

// Create new file when click on create button
document.getElementById("aqua_create_file_button")
    .addEventListener("click", () => {
        const fileName = document.getElementById("aqua_create_new_file_field");
        if (fileName.value != "") {
            let filePath = null;
            let selectedItemData = window.directorySelectGlobal;

            if (selectedItemData.length === 0) {
                filePath = openedFolderPath + "\\" + fileName.value;
            } else {
                filePath = selectedItemData[0].filePath + "\\" + fileName.value;
            }
            // Create a file
            let fileCreateData = createNewFile(filePath);
            if (fileCreateData == null) {
                // Remove error message
                document.getElementById("aquaCreateNewFileDialogError")
                    .querySelector(".field-label").style.display = "none";
                // Separate file name and extension
                const parsedPath = path.parse(filePath);
                // Add file/folder on directory tree view
                createFolderFileTreeNode(selectedItemData, fileName, filePath, {
                    type: "file",
                    extension: parsedPath.ext,
                });
                // Clear the field
                fileName.value = "";
                // Close the file create dialog
                createNewFileDialog.close();
            } else {
                let errorElement = document.getElementById("aquaCreateNewFileDialogError")
                    .querySelector(".field-label");
                errorElement.style.display = "block";
                errorElement.innerText = fileCreateData;
            }
        }
    });

/*----------------------------------------
* Rename file or folder
*----------------------------------------*/
document.getElementById("aqua_rename_folder_file_button")
    .addEventListener("click", () => {
        const fileName = document.getElementById("aqua_rename_value");
        if (fileName.value != "") {
            let selectedItemData = window.directorySelectGlobal;
            let oldFilePath = selectedItemData[0].filePath;

            // Prepare new file/folder name
            const parentDirPath = path.dirname(oldFilePath);
            let newPath = null;
            if (parentDirPath) {
                newPath = parentDirPath + "\\" + fileName.value;
            }

            let fileOrFolderType = checkFileOrFolder(oldFilePath);
            // Rename the file
            let renamedData = renameFileFolder(oldFilePath, newPath);
            if (renamedData == null) {
                // Remove error message
                document.getElementById("aquaRenameFileFolderDialogError")
                    .querySelector(".field-label").style.display = "none";
                // Separate file name and extension
                const parsedPath = path.parse(newPath);
                // Add file/folder on directory tree view
                updateRenamedSourceTreeNode(selectedItemData, fileName, newPath, {
                    type: fileOrFolderType,
                    extension: parsedPath.ext,
                });
                // TODO:: Update tab data after rename the file
                // Clear the field
                fileName.value = "";
                // Close the rename dialog
                aquaRenameDialog.close();
            } else {
                let errorElement = document.getElementById("aquaRenameFileFolderDialogError")
                    .querySelector(".field-label");
                errorElement.style.display = "block";
                errorElement.innerText = renamedData;
            }
        }
    });

// Renamed folder/file data update in directory
function updateRenamedSourceTreeNode(selectedItemData, fieldValue, pathNew, config) {
    // Read the JSON data from the file
    const readedFileData = fs.readFileSync(__dirname + '\\settings\\fileData.json');
    // Parse the JSON data
    const exportedJsonData = JSON.parse(readedFileData);

    const newItem = {
        filePath: pathNew,
        text: fieldValue.value,
        extension: config.extension,
        imageHtml: getFileIcon({
            type: config.type,
            extension: config.extension,
            text: fieldValue.value,
        }, false),
    };

    const dataForWorker = {
        parent: selectedItemData,
        jsonData: exportedJsonData,
        newData: newItem,
    };
    workerRename.postMessage(dataForWorker);
    workerRename.addEventListener('message', (event) => {
        // Write the updated JSON data back to the file
        if (event.data.directoryResources.length != 0) {
            fs.writeFileSync(
                __dirname + '\\settings\\fileData.json',
                JSON.stringify(event.data.directoryResources)
            );
            $tree.reload();
        }
    });

    // If file is opened update the title and icon
    let tabGroup = document.querySelector("tab-group");
    let tab = tabGroup.getTab(parseInt(selectedItemData[0].id));
    if (tab != null) {
        tab.setTitle(newItem.text);
        // Set icon
        let tabIcon = getFileIcon({
            type: config.type,
            extension: config.extension,
            text: fieldValue.value,
        }, true);
        tab.spans.icon.className = tabIcon;

        // Get active tab
        let activeTab = tabGroup.getActiveTab();
        if (activeTab.id == tab.id) {
            let pathAfterRoot = seperateFolders(newItem.filePath);
            footerNavigateBuilder(
                {
                    rootName: window.openedFolderName,
                    allFiles: pathAfterRoot,
                    imageHtml: newItem.imageHtml,
                }, true);
            // Update footer data related to the tab
            let currentEditor = ace.edit("aqua-editor-" + tab.id);
            updateEditorFooterFileInfo(currentEditor, newItem);
        }
        // When tab active
        tab.on("active", (tab) => {
            const editorHolder =
                document.getElementById("aqua-editors-holder");
            const editor = document.getElementById("aqua-editor-" + tab.id);

            editorHolder.insertBefore(editor, editorHolder.firstChild);

            let pathAfterRoot = seperateFolders(newItem.filePath);
            footerNavigateBuilder(
                {
                    rootName: window.openedFolderName,
                    allFiles: pathAfterRoot,
                    imageHtml: newItem.imageHtml,
                }, true);

            // Change editor file read type and file extension
            if (!editor.classList.contains("aqua-image-file-preview")) {
                let currentEditor = ace.edit("aqua-editor-" + tab.id);
                updateEditorFooterFileInfo(currentEditor, newItem);
            } else {
                let readOnlyController =
                    document.getElementById("aqua-file-footer-read-type");
                readOnlyController.className = "icon-read-only-false";
            }
        });
        // If editor exist
        // Update editor data
        const editorConfig = ace.edit("aqua-editor-" + tab.id);
        if (editorConfig) {
            editorConfig.getSession().setMode({
                path: 'ace/mode/' + getFileType(newItem.extension, newItem.text), inline: true
            });
        }
    }
}

/*----------------------------------------
* Confirmation dialog box confirm button handler
*----------------------------------------*/
document.getElementById("aqua_confirm_dialog_confirm_button")
    .addEventListener("click", (e) => {
        const actionType = e.target.dataset.actionTypeButton;

        if (actionType == "delete") {
            deleteFileFolder();
        }
    });

/*----------------------------------------
* Delete folders or files
*----------------------------------------*/
async function deleteFileFolder() {
    // Parse the JSON data
    const readedFileData = fs.readFileSync(__dirname + '\\settings\\fileData.json');
    const exportedJsonData = JSON.parse(readedFileData);

    let selectedItemData = window.directorySelectGlobal;
    let deletePath = selectedItemData[0].filePath;

    if (deletePath) {
        let returnValue = await ipcRenderer.sendSync("move-to-trash", {path: deletePath});
        if (returnValue.status == "success") {
            workerDelete.postMessage({
                object: selectedItemData,
                jsonData: exportedJsonData,
            });
            workerDelete.addEventListener('message', (event) => {
                // Write the updated JSON data back to the file
                fs.writeFileSync(
                    __dirname + '\\settings\\fileData.json',
                    JSON.stringify(event.data.directoryResources)
                );
                $tree.reload();
                aquaConfirmDialog.close();
            });

            // When file delete also remove the tab is exists
            let tabGroup = document.querySelector("tab-group");
            let tab = tabGroup.getTab(parseInt(selectedItemData[0].id));
            if (tab != null) {
                tab.close();
            }
        } else {
            console.log(returnValue);
        }
    }
}


const watcher = chokidar.watch(openedFolderPath, {
    persistent: true, // Keep watching until explicitly stopped
    ignoreInitial: true // Ignore initial file system scan results
});

// Add event listeners for different types of changes
watcher
    .on('add', (filePath) => {
        console.log(`File added: ${filePath}`);
        // Perform actions when a new file is added
    })
    .on('change', (filePath) => {
        console.log(`File changed: ${filePath}`);
        // Perform actions when a file is modified
    })
    .on('unlink', (filePath) => {
        console.log(`File removed: ${filePath}`);
        // Perform actions when a file is deleted
    });
