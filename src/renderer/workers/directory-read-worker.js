// worker.js
let folderFileCount = -1;
self.addEventListener('message', async (event) => {
    folderFileCount = -1;
    const obj = event.data;
    const data = convertObjectToData(obj);
    self.postMessage({
        directoryResources: data,
        folderCount: folderFileCount,
    });
});


/*----------------------------------------
* Convert object gijgo data structure
*----------------------------------------*/
function convertObjectToData(obj) {
    const data = [];

    const items = Object.values(obj).sort((a, b) => {
        if (a.type === b.type) {
            // if both have children, sort by directory first
            if (a.children && b.children) {
                if (a.type === 'directory' && b.type === 'directory') {
                    return -1;
                } else if (a.type === 'file' && b.type === 'file') {
                    return 1;
                } else if (a.type === 'directory' && b.type === 'file') {
                    return -1;
                } else {
                    return 1;
                }
            } else if (a.children) {
                return -1; // a has children, b does not
            } else if (b.children) {
                return 1; // b has children, a does not
            } else {
                return 0; // both do not have children
            }
        } else if (a.type === 'directory' && b.type === 'file') {
            return -1; // sort directory before file
        } else {
            return 1; // sort file after directory
        }
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
        // if (item.name == 'vendor' || item.name == 'node_modules') {
        //     // TODO:: Need to refactor this for, when some one click on those files. the data will load
        //     data.push(newItem);
        //     continue;
        // }
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
        return '<span class="icon-color-folder-icon aqua-folder-styles"></span>';
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
        case 'java':
            return 'java';
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
