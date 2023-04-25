// TODO:: Trigger when dom content load
/*----------------------------------------
* Include libraries
*----------------------------------------*/
const dirTree = require("directory-tree");
const fs = require("fs");
const path = require("path");
const iconsData = require('./assets/theme/material-file-icons.json');
console.log(iconsData);
/*----------------------------------------
* Get directory data
*----------------------------------------*/
const treeDatra = dirTree("C:\\Users\\TigEr_MP\\aqua-ide", {
    attributes: ["size", "type", "extension", "mode", "mtime"],
});

/*----------------------------------------
* Set directory
*----------------------------------------*/
let data = await convertObjectToData(treeDatra.children);
let tree = $('#directory').tree({
    primaryKey: 'id',
    dataSource: data,
    imageCssClassField: 'faCssClass',
    icons: {
        expand: '<span class="icon-right-arrow"></span>',
        collapse: '<span class="icon-right-arrow"></span>'
    },
    autoLoad: false,
});

document.addEventListener("DOMContentLoaded", function() {
    tree.reload();
});

/*----------------------------------------
* Convert object gijga data structure
*----------------------------------------*/
async function convertObjectToData(obj) {
    var data = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            var item = obj[key];
            var newItem = {
                id: key,
                text: item.name,
                // iconUrl: './assets/images/aqua-ide-logo.png',
                // faCssClass: 'icon-color-folder-icon',
                // faCssClass: getFileIcon(item.extension),
                imageHtml: getFileIcon(item.extension),
            };
            if (item.children) {
                newItem.children = convertObjectToData(item.children);
            }
            data.push(newItem);
        }
    }
    return data;
}

/*----------------------------------------
* Get folder/file icons
*----------------------------------------*/
function getFileIcon(extension) {
    if (extension == undefined || extension == "") {
        return '<span class="icon-color-folder-icon"></span>';
    }
    extension = extension.replace(/\./g, '');
    const iconId = iconsData.languageIds;
    if (iconId[extension]) {
        const iconDefinition = iconsData.iconDefinitions[iconId[extension]];
        const iconChar = iconDefinition.fontCharacter.replace(/\\/g, '');
        let fontId = 'icon-color-folder-icon';

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

    return '<span class="icon-color-folder-icon"></span>';
}
