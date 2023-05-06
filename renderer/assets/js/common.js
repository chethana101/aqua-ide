/*----------------------------------------
* Get folder/file icons
*----------------------------------------*/
const iconsData = require('./assets/theme/material-file-icons.json');

function getFileIcon(item, isEditorIcon) {
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

        if (iconChar.length <= 1) {
            // If editor icon
            return checkDefaultIcons(item, isEditorIcon);
        }

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
        if (isEditorIcon) {
            return {
                className: fontId,
                iconCode: "&#x" + iconChar + ";",
                iconColor: iconDefinition.fontColor,
            };
        }
        return '<span class="' + fontId + '" style="color: ' + iconDefinition.fontColor + '">&#x' + iconChar + ';</span>';
    }

    // If editor icon
    return checkDefaultIcons(item, isEditorIcon);
}

// Choose the default icon using type (type - directory, editor)
function checkDefaultIcons(item, isEditorIcon) {
    if (isEditorIcon) {
        if (item.type == "directory") {
            return {
                className: "icon-color-folder-icon",
                iconCode: "",
                iconColor: "",
            };
        }
        return {
            className: "icon-file-icon-default",
            iconCode: "",
            iconColor: "",
        };
    }
    // If directory tree icons
    return item.type == "directory" ?
        '<span class="icon-color-folder-icon"></span>' :
        '<span class="icon-file-icon-default"></span>';
}

function removeObjectFromArray(array, id) {
    const objWithIdIndex = array.findIndex((obj) => obj.id === id);

    if (objWithIdIndex > -1) {
        array.splice(objWithIdIndex, 1);
    }

    return array;
}

// Create footer navigator
function footerNavigateBuilder(data, type) {
    if (type == "directory") {
        let div = document.createElement("div");
        div.className = "footer-navigator-path-name";
        div.innerHTML = data.rootName;
        return div;
    }

    if (type == "file") {

    }
}

export { getFileIcon, removeObjectFromArray, footerNavigateBuilder };
