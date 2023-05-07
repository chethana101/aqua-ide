// worker.js

let folderFileCount = -1;
self.addEventListener('message', async (event) => {
    const obj = event.data;
    const data = convertObjectToData(obj);
    self.postMessage(data);
});


/*----------------------------------------
* Convert object gijga data structure
*----------------------------------------*/
function convertObjectToData(obj) {
    const data = [];

    const items = Object.values(obj).sort((a, b) => {
        return a.type === 'directory' ? -1 : b.type === 'directory' ? 1 : 0;
    });

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const newItem = {
            id: ++folderFileCount,
            filePath: item.path,
            text: item.name,
            type: item.type,
            extension: item.extension,
            imageHtml: getFileIcon(item),
        };
        if (item.children) {
            newItem.children = convertObjectToData(item.children);
        }
        data.push(newItem);
    }
    return data;
}

// Get file and folder icons
function getFileIcon(item) {
    // File icons
    if (item.type == "file") {
        const iconClass = getFileIconClass(item.extension, item.name);
        if (iconClass == null) {
            return '<span class="icon-file-icon-default"></span>';
        }
        return '<span class="icon-material-' + iconClass + '"></span>';
    }
    // Folder icons
    const folderClass = getFolderIconClass(item.name)
    if (folderClass == null) {
        return '<span class="icon-color-folder-icon"></span>';
    }
    return '<span class="icon-material-' + folderClass + '">' +
        '<span class="path1"></span>' +
        '<span class="path2"></span>' +
        '</span>';
}

function getFileIconClass(fileExtension, name) {
    // If default icons
    // TODO:: When user choose default icon, return null
    let extension = fileExtension.replace(/\./g, '');

    if (name.includes('blade')) {
        return 'laravel';
    }

    switch (extension.toLowerCase()) {
        case 'html':
            return 'html';
        case 'php':
        case 'artisan':
            return 'php';
        case 'icon':
        case 'ico':
        case 'favicon':
            return 'favicon';
        case 'css':
            return 'css';
        case 'js':
            return 'javascript';
        case 'ts':
            return 'typescript';
        case 'json':
        case 'lock':
            return 'json';
        case 'xml':
            return 'xml';
        case 'md':
            return 'markdown';
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
            return 'image';
        case 'svg':
            return 'svg';
        case 'vue':
            return 'vue';
        case 'yarn':
            return 'yarn';
        case 'react':
        case 'react_ts':
            return 'react';
        case 'git':
        case 'gitignore':
            return 'git';
        case 'pdf':
            return 'pdf';
        case 'zip':
        case 'rar':
        case '7z':
            return 'zip';
        default:
            return null;
    }
}

function getFolderIconClass(folderName) {
    // If default icons
    // TODO:: When user choose default icon, return null
    switch (folderName.toLowerCase()) {
        case 'admin':
        case 'admins':
        case 'auth':
        case 'authenticate':
            return 'folder-admin';
        case 'node_modules':
            return 'folder-node';
        case 'src':
        case 'source':
        case 'resource':
        case 'resources':
        case 'assets':
            return 'folder-resource';
        case 'include':
        case 'includes':
            return 'folder-include';
        case 'test':
        case 'tests':
        case '__tests__':
            return 'folder-test';
        case 'public':
        case 'www':
            return 'folder-public';
        case 'views':
            return 'folder-views';
        case 'templates':
            return 'folder-template';
        case 'config':
            return 'folder-config';
        case 'docs':
        case 'documentation':
            return 'folder-docs';
        case 'lib':
        case 'library':
            return 'folder-lib';
        case 'font':
        case 'fonts':
            return 'folder-font';
        case 'function':
        case 'functions':
            return 'folder-functions';
        case 'css':
        case 'style':
        case 'styles':
        case 'stylesheet':
        case 'stylesheets':
            return 'folder-css';
        case 'config':
        case 'configs':
            return 'folder-config';
        case 'js':
        case 'javascript':
        case 'javascripts':
            return 'folder-javascript';
        case 'app':
        case 'apps':
        case 'application':
        case 'applications':
            return 'folder-app';
        case 'controller':
        case 'controllers':
            return 'folder-controller';
        case 'database':
            return 'folder-database';
        case 'git':
            return 'folder-git';
        default:
            return null;
    }
}
