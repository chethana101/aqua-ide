// TODO:: Trigger when dom content load
/*----------------------------------------
* Include libraries
*----------------------------------------*/
const dirTree = require("directory-tree");
const fs = require("fs");
const path = require("path");
const iconsData = require('./assets/theme/material-file-icons.json');

// Directory tree variables
let folderFileCount = -1;

// Popup variables
let createNewFileDialog;
/*----------------------------------------
* Get directory data
*----------------------------------------*/
const treeDatra = dirTree("C:\\Users\\TigEr_MP\\aqua-ide", {
    attributes: ["size", "type", "extension", "mode", "mtime"],
});
/*----------------------------------------
* Set directory
*----------------------------------------*/

let data = convertObjectToData(treeDatra.children);
let $tree = $('#directory').tree({
    primaryKey: 'id',
    dataSource: data,
    imageCssClassField: 'faCssClass',
    icons: {
        expand: '<span class="icon-right-arrow"></span>',
        collapse: '<span class="icon-down-arrow"></span>'
    },
    autoLoad: false,
    renderer: function(node, displayValue) {
        const filePath = node.filePath || '';
        return `${displayValue} (${filePath})`;
    },
    // Add a select event listener to the Gijgo Tree
    select: function(e, node, id) {
        // console.log($tree.getDataById(id));
    },
});

// Load the directory tree to application
document.addEventListener("DOMContentLoaded", () => {
    $tree.reload();
});

// Collapse directory tree
document.getElementById("collapse-directory-tree")
    .addEventListener("click", async () => {
        await $tree.collapseAll();
    });

/*----------------------------------------
* Directory right click action
*----------------------------------------*/
const $contextMenu = $('#right-click-popup');

// Add a contextmenu event listener to the Gijgo Tree element
$tree.on('contextmenu', function (e) {
    // Prevent the default right-click menu from showing up
    e.preventDefault();

    // Get the target element that was right-clicked
    const $target = $(e.target);

    // Show the context menu only if a tree node was clicked
    if ($target.closest("li").data("role") == "node") {
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
        });
    } else {
        // Hide the context menu if anything else was clicked
        $contextMenu.hide();
    }
});

// Add a click event listener to the document object to hide the context menu
$(document).on('click', function (e) {
    // Get the target element that was clicked
    const $target = $(e.target);

    // Hide the context menu if the target element is neither a Tree node nor a context menu item
    if (!$target.is('.node') && !$target.closest('.dropdown-menu').length) {
        $contextMenu.hide();
    }
});

/*----------------------------------------
* Convert object gijga data structure
*----------------------------------------*/
function convertObjectToData(obj) {
    var data = [];
    var items = Object.values(obj);

    // Sort items by type (directories first)
    items.sort((a, b) => {
        if (a.type === 'directory' && b.type !== 'directory') {
            return -1;
        } else if (a.type !== 'directory' && b.type === 'directory') {
            return 1;
        } else {
            return 0;
        }
    });

    for (var i = 0; i < items.length; i++) {
        folderFileCount++;
        var item = items[i];
        var newItem = {
            id: folderFileCount,
            filePath: 'C:\\folder1\\file1.txt',
            text: item.name,
            imageHtml: getFileIcon(item),
        };
        if (item.children) {
            newItem.children = convertObjectToData(item.children);
        }
        data.push(newItem);
    }
    return data;
}

/*----------------------------------------
* Get folder/file icons
*----------------------------------------*/
function getFileIcon(item) {
    let iconId = null;
    let extension = null;
    let defaultName = null;

    // Check if data is file or icon
    if (item.type == "file") {
        extension = item.extension.replace(/\./g, '');
        iconId = iconsData.languageIds;
        defaultName = "_file";
    }
    if (item.type == "directory") {
        iconId = iconsData.folderNames;
        extension = item.name;
        defaultName = "_folder";
    }
    // Check if icon class name exist
    if (iconId[extension]) {
        const iconDefinition = iconsData.iconDefinitions[iconId[extension]];
        const iconChar = iconDefinition.fontCharacter.replace(/\\/g, '');
        let fontId = 'octicons';

        // Check the font id
        switch (iconDefinition.fontId) {
            case 'fi':
                fontId = 'file-icon';
                break;
            case 'devicons':
                fontId = 'devopicons';
                break;
            case 'fa':
                fontId = 'fontawesome';
                break;
            case 'mf':
                fontId = 'mfixx';
                break;
            case 'octicons':
                fontId = 'octicons';
                break;
        }
        return '<span class="'+fontId+'" style="color: '+iconDefinition.fontColor+'">&#x'+iconChar+';</span>';
    }

    return item.type == "directory" ?
        '<span class="icon-color-folder-icon"></span>' :
        '<span class="octicons">&#xf011;</span>';
}

/*----------------------------------------
* Popup boxed handling
*----------------------------------------*/
document.addEventListener("DOMContentLoaded", async () => {
    createNewFileDialog = $("#createNewFileDialog").dialog({
        title: "Create New File",
        resizable: false,
        draggable: true,
    });
});
