/*----------------------------------------
* Get folder/file icons
*----------------------------------------*/

const path = require("path");
const fs = require("fs");

// Get file and folder icons
function getFileIcon(item, isEditor) {
    if (item.type == "file") {
        let defaultClass = "icon-file-icon-default";
        let iconClass = getFileIconClass(item.extension, item.text);

        if (isEditor) {
            if (iconClass == null) {
                return defaultClass;
            }
            return "icon-material-theme-tabs icon-material-" + iconClass;
        }
        if (iconClass == null) {
            return '<span class="' + defaultClass + '"></span>';
        }
        return '<span class="icon-material-' + iconClass + '"></span>';
    }
    const folderClass = getFolderIconClass(item.text)
    if (folderClass == null && isEditor == true) {
        return "icon-file-icon-default"
    }
    return '<span class="icon-color-folder-icon aqua-folder-styles"></span>';
}

// Get file icon class
function getFileIconClass(fileExtension, name) {
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

// Get folder icon class
function getFolderIconClass(folderName) {
    switch (folderName.toLowerCase()) {
        case 'node_modules':
            return 'folder-node';
        case 'src':
        case 'source':
        case 'assets':
            return 'folder-resource';
        case 'test':
        case 'tests':
        case '__tests__':
            return 'test';
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
        default:
            return null;
    }
}

function removeObjectFromArray(array, id) {
    const objWithIdIndex = array.findIndex((obj) => obj.id === id);

    if (objWithIdIndex > -1) {
        array.splice(objWithIdIndex, 1);
    }

    return array;
}

// Create footer navigator
function footerNavigateBuilder(data, type = false) {
    const parent = document.getElementById("footer-navigator");
    // Clear the navigator path
    document.getElementById("footer-navigator").innerHTML = "";

    let div = document.createElement("div");

    let span = document.createElement("span");
    span.className = "icon-folder-border";
    span.style.margin = "0px 5px";
    div.append(span);

    div.className = "footer-navigator-path-name";
    div.innerText = data.rootName;
    div.insertBefore(span, div.firstChild);

    if (type) {
        for (let i = 0; i < data.allFiles.length; i++) {
            let arrowIcon = document.createElement("span");
            arrowIcon.className = "icon-right-arrow";
            div.appendChild(arrowIcon);

            let fileElement = document.createElement("div");
            fileElement.className = "footer-navigator-path-name";
            fileElement.innerText += data.allFiles[i];
            if (data.allFiles.length - 1 == i) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data.imageHtml, "text/html");
                doc.body.firstChild.style.marginRight = "5px";
                doc.body.firstChild.style.fontSize = "15px";

                fileElement.insertBefore(doc.body.firstChild, fileElement.firstChild);
            }
            div.appendChild(fileElement);
        }
    }
    parent.appendChild(div);
}

// Separate folder from path
function seperateFolders(pathSent) {
    const index = pathSent.indexOf(window.openedFolderName);
    let pathAfterRoot = pathSent.slice(index + window.openedFolderName.length);
    return pathAfterRoot.split(path.sep).filter(Boolean);
}

// Image file preview component
function previewImageComponent(item, isNoPreview = false) {
    const mainDiv = document.createElement("div");
    mainDiv.className = "aqua-image-file-preview";
    mainDiv.id = "aqua-editor-" + item.id;

    const divHolder = document.createElement("div");
    divHolder.className = "aqua-image-file-holder";
    mainDiv.append(divHolder);

    // If no preview true
    if (isNoPreview) {
        const noPreview = document.createElement("div");
        noPreview.className = "aqua-no-preview-text";
        noPreview.innerHTML = "This file has no preview";
        divHolder.append(noPreview);

        return mainDiv;
    }

    const image = document.createElement("img");
    image.className = "aqua-image-file";
    image.src = item.filePath;
    image.alt = item.text;
    divHolder.append(image);

    return mainDiv;
}

function isImage(extension) {
    const imageExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".bmp",
        ".webp",
        ".ico",
        ".tiff",
        ".tif",
        ".heif",
        ".heic",
        ".bmp",
    ];

    return imageExtensions.includes(extension.toLowerCase());
}

function isNoPreview(extension) {
    const imageExtensions = [
        ".pdf",
        ".pdfmarks",
        ".zip",
        ".doc",
        ".docx",
        ".xls",
        ".xlsx",
        ".ppt",
        ".pptx",
        ".pptm",
        ".accdb",
        ".pub",
        ".mpp",
        ".pst",
        ".vsd",
        ".vsdx",
        ".mp4",
        ".mov",
        ".avi",
        ".mkv",
        ".flv",
        ".wmv",
        ".webm",
        ".m4v",
        ".mpg",
        ".mpeg",
        ".3gp",
        ".m2v",
        ".mpv",
        ".m2ts",
        ".ts",
        ".ogv",
        ".f4v",
        ".rm",
        ".rmvb",
        ".vob",
        ".ai",
        ".psd",
        ".ttf",
    ];

    return imageExtensions.includes(extension.toLowerCase());
}

// Create new folder
function createNewFolder(path) {
    try {
        if (fs.existsSync(path)) {
            return 'Directory already exists';
        } else {
            fs.mkdirSync(path);
            return null;
        }
    } catch (err) {
        console.error(err);
        return err;
    }
}

// Create new file
function createNewFile(path) {
    try {
        if (fs.existsSync(path)) {
            return 'File already exists';
        } else {
            fs.writeFileSync(path, '')
            return null;
        }
    } catch (err) {
        console.error(err);
        return err;
    }
}

// Rename file or folder
function renameFileFolder(oldPath, newPath) {
    try {
        if (fs.existsSync(oldPath)) {
            fs.renameSync(oldPath, newPath);
            return null;
        } else {
            return 'The source you are looking for no longer available';
        }
    } catch (err) {
        console.error(err);
        return err;
    }
}

// Check file or folder
function checkFileOrFolder(path) {
    try {
        const stats = fs.statSync(path);
        if (stats.isFile()) {
            return "file";
        } else if (stats.isDirectory()) {
            return "directory";
        }
    } catch (err) {
        console.log(`${path} does not exist`);
    }
}

// Write the updated content back to the file
function updateFileContent(path, content) {
    try {
        // Write the updated content back to the file
        fs.writeFileSync(path, content, 'utf8');

        return "success";
    } catch (err) {
        console.error(err);
    }
}

/*-------------------------------------
* Update IDE footer data with opened file
*------------------------------------*/
function updateEditorFooterFileInfo(editor, fileConfig) {
    const fileFullNames = {
        js: "JavaScript",
        ts: "TypeScript",
        xml: "XML",
        html: "HTML",
        py: "Python",
        java: "Java",
        php: "PHP",
        json: "Json",
        txt: "text",
    };
    // Update IDE footer file type
    let editorFileExt = fileConfig.extension.replace(/\./g, '');
    editorFileExt = editorFileExt == "" ? "text" : editorFileExt;

    document.getElementById("aqua-file-footer-file-extension").innerText
        = fileFullNames[editorFileExt] == undefined ? editorFileExt : fileFullNames[editorFileExt];

    // Get editor read only status
    let readOnlyController = document.getElementById("aqua-file-footer-read-type");
    if (editor.getReadOnly()) {
        readOnlyController.className = "icon-read-only";
    } else {
        readOnlyController.className = "icon-read-only-false";
    }
}

/*-------------------------------------
* Get language name
*------------------------------------*/
function getFileType(fileExtension, fileName) {
    fileExtension = fileExtension.replace(/\./g, '');
    const fileTypes = {
        js: "javascript",
        py: "python",
        rb: "ruby",
        java: "java",
        cpp: "c++",
        cs: "c#",
        php: "php_laravel_blade",
        swift: "swift",
        go: "go",
        kotlin: "kotlin",
        ts: "javascript",
        jsx: "react JSX",
        tsx: "react TSX",
        vue: "vue",
        html: "html",
        css: "css",
        scss: "scss",
        json: "json",
        xml: "xml",
        svg: "xml",
    };

    return fileTypes[fileExtension] || "text";
}

export {
    getFileIcon,
    removeObjectFromArray,
    footerNavigateBuilder,
    seperateFolders,
    previewImageComponent,
    isImage,
    isNoPreview,
    createNewFolder,
    createNewFile,
    renameFileFolder,
    checkFileOrFolder,
    updateEditorFooterFileInfo,
    getFileType,
    updateFileContent,
};
