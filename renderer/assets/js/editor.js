/*----------------------------------------
* Necessary libraries
*----------------------------------------*/
require("./editor/ace/emmet.js");
require("./editor/ace/ext-emmet.js");
require("./editor/ace/ext-language_tools.js");
require("./editor/ace/keybinding-emacs.js");
require("./editor/ace/ext-beautify.js");
require("./editor/ace/ext-modelist.js");
require("./editor/ace/mode-snippets.js");
require("./editor/ace/ext-tern.js");
require('electron-tabs');
import {
    getFileIcon,
    removeObjectFromArray,
    footerNavigateBuilder,
    seperateFolders,
    isImage,
    previewImageComponent,
    isNoPreview,
    updateEditorFooterFileInfo,
    getFileType,
    updateFileContent,
} from '../../assets/js/common.js';

const fs = require("fs");
const path = require("path");

/*----------------------------------------
* Necessary Variables
*----------------------------------------*/
window.editorsConfig = [];
const $contextMenu = $('#contextmenu-editor-popup');

/*----------------------------------------
* Set editor tabs
*----------------------------------------*/
window.editorTabs = function (fileConfig) {
    const tabGroup = document.querySelector("tab-group");

    const editorIcon = getFileIcon(fileConfig, true);
    // Set up the default tab which is created when the "New Tab" button is clicked
    const tab = tabGroup.addTab({
        title: fileConfig.text,
        active: true,
        visible: true,
    });
    tab.spans.title.title = fileConfig.filePath;
    tab.spans.icon.className = editorIcon;

    // Check if the file is image or not
    if (isImage(fileConfig.extension)) {
        const previewImageComponentHtml = previewImageComponent(fileConfig);
        const editorHolder =
            document.getElementById("aqua-editors-holder");
        editorHolder.insertBefore(previewImageComponentHtml, editorHolder.firstChild);
    } else if (isNoPreview(fileConfig.extension)) {
        const previewImageComponentHtml = previewImageComponent(fileConfig, true);
        const editorHolder =
            document.getElementById("aqua-editors-holder");
        editorHolder.insertBefore(previewImageComponentHtml, editorHolder.firstChild);
    } else {
        // Get editor element and set to this editor holder
        let editor = getEditor(fileConfig);

        // Check if file has change or not
        fileConfig.editorOldData = editor.getValue();
        editor.on('change', function (e) {
            const newEditorValue = editor.getValue();
            if (newEditorValue !== fileConfig.editorOldData) {
                tab.setBadge({text: "*", classname: "icon-add-new-icon"});
            } else {
                tab.setBadge({text: "", classname: "icon-add-new-icon"});
            }
        });

        // Editor content save
        editor.commands.addCommand({
            name: 'Save editor data',
            bindKey: {win: 'Ctrl-S', mac: 'Command-S'},
            exec: function (editor) {
                storeEditorData();
            },
        });

        // Editor zoom/font size increase
        // Add event listener for mouse wheel with Ctrl key
        editor.container.addEventListener("wheel", function (event) {
            // Check if the Ctrl key is pressed
            if (event.ctrlKey) {
                // Normalize the delta value across different browsers
                var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));

                // Check if the wheel was scrolled up or down
                if (delta < 0) {
                    // Ctrl + Mouse wheel down
                    let fontSize = parseInt(editor.getOption("fontSize"));
                    if (fontSize > 1) {
                        editor.setOption("fontSize", fontSize - 1);
                    }
                    // Perform desired action
                } else if (delta > 0) {
                    // Ctrl + Mouse wheel up
                    let fontSize = parseInt(editor.getOption("fontSize"));
                    editor.setOption("fontSize", fontSize + 1);
                    // Perform desired action
                }

                // Prevent the default scrolling behavior
                event.preventDefault();
            }
        });

        // Update IDE footer data with opened file
        editor.container.addEventListener("click", function (e) {
            let editorRowColumn = editor.selection.getCursor();
            document.getElementById("aqua-file-row-column")
                .innerText = "Ln " + (editorRowColumn.row + 1) + " Col " + (editorRowColumn.column + 1);
        }, false);

        // Change editor file read type and file extension
        document.getElementById("footer-toggle-item-file-type")
            .style.display = "flex";
        updateEditorFooterFileInfo(editor, fileConfig);
    }

    tab.id = fileConfig.id;
    window.editorsConfig.push(fileConfig);

    // Display editor holder
    document.getElementById("aqua-editor-content")
        .style.display = "block";

    // Set footer navigation
    let pathAfterRoot = seperateFolders(fileConfig.filePath);
    footerNavigateBuilder(
        {
            rootName: window.openedFolderName,
            allFiles: pathAfterRoot,
            imageHtml: fileConfig.imageHtml,
        }, true);

    // When tab active
    tab.on("active", (tab) => {
        const editorHolder =
            document.getElementById("aqua-editors-holder");
        const editor = document.getElementById("aqua-editor-" + tab.id);

        editorHolder.insertBefore(editor, editorHolder.firstChild);

        let pathAfterRoot = seperateFolders(fileConfig.filePath);
        footerNavigateBuilder(
            {
                rootName: window.openedFolderName,
                allFiles: pathAfterRoot,
                imageHtml: fileConfig.imageHtml,
            }, true);

        // Change editor file read type and file extension
        if (!editor.classList.contains("aqua-image-file-preview")) {
            let currentEditor = ace.edit("aqua-editor-" + tab.id);
            updateEditorFooterFileInfo(currentEditor, fileConfig);
        } else {
            let readOnlyController =
                document.getElementById("aqua-file-footer-read-type");
            readOnlyController.className = "icon-read-only-false";
        }
    });

    // When tab closed
    tab.on("close", (tab) => {
        document.getElementById("aqua-editor-" + tab.id).remove();

        editorsConfigIds = removeObjectFromArray(editorsConfigIds, tab.id);
        window.editorsConfig = removeObjectFromArray(window.editorsConfig, tab.id);

        // Hide editor holder if editor count is 0
        if (window.editorsConfig.length === 0) {
            document.getElementById("aqua-editor-content")
                .style.display = "none";
        }
    });
}
// File ready only setter
document.getElementById("aqua-file-footer-read-type-click")
    .addEventListener("click", function (e) {
        let tabGroup = document.querySelector("tab-group");
        let activeTab = tabGroup.getActiveTab();

        if (activeTab) {
            let isEditor = document.getElementById("aqua-editor-" + activeTab.id);
            if (!isEditor.classList.contains("aqua-image-file-preview")) {
                let editor = ace.edit("aqua-editor-" + activeTab.id);
                let readOnlyController = document.getElementById("aqua-file-footer-read-type");
                if (editor.getReadOnly() == false) {
                    editor.setReadOnly(true);
                    readOnlyController.className = "icon-read-only";
                } else {
                    editor.setReadOnly(false)
                    readOnlyController.className = "icon-read-only-false";
                }
            }
        }
    });

// Copy editor selected data
document.getElementById("aqua-editor-contextmenu-copy")
    .addEventListener("click", async function (e) {
        let tabGroup = document.querySelector("tab-group");
        let activeTab = tabGroup.getActiveTab();
        let editor = ace.edit("aqua-editor-" + activeTab.id);

        // Write editor selected data
        if (editor.getSelectedText()) {
            await navigator.clipboard.writeText(editor.getSelectedText());
            document.getElementById("contextmenu-editor-popup").style.display = "none";
        }
    });

// Paste editor selected data
document.getElementById("aqua-editor-contextmenu-paste")
    .addEventListener("click", async function (e) {
        let tabGroup = document.querySelector("tab-group");
        let activeTab = tabGroup.getActiveTab();
        let editor = ace.edit("aqua-editor-" + activeTab.id);

        // Paste editor selected data
        editor.session.insert(editor.selection.getCursor(), await navigator.clipboard.readText());
        document.getElementById("contextmenu-editor-popup").style.display = "none";
    });

// Save editor data action click
document.getElementById("aqua-editor-contextmenu-save")
    .addEventListener("click", async function (e) {
        storeEditorData();
    });

/*-------------------------------------
* Store editor data inside the file
*------------------------------------*/
function storeEditorData() {
    // Get active tab
    let tabGroup = document.querySelector("tab-group");
    let activeTab = tabGroup.getActiveTab();
    // Get active editor context
    let editor = ace.edit("aqua-editor-" + activeTab.id);
    // Get editor data
    // let activeEditorData = $tree.getDataById(activeTab.id);

    // Update file with new content
    const activeEditorData = window.editorsConfig.find(obj => obj.id === activeTab.id);
    let fileWriteStatus = updateFileContent(activeEditorData.filePath, editor.getValue());

    if (fileWriteStatus == "success") {
        activeTab.setBadge({text: "", classname: "icon-add-new-icon"});
        $contextMenu.hide();
        // Get editor config
        let activeEditorConfig = window.editorsConfig.find((obj) => obj.id === activeTab.id);
        activeEditorConfig.editorOldData = editor.getValue();
    }
}

/*-------------------------------------
* Get Editor Instance
*------------------------------------*/
function getEditor(fileConfig) {
    try {
        // Create editor element
        const editorElement = document.createElement("div");
        editorElement.id = "aqua-editor-" + fileConfig.id;
        editorElement.classList = "editor-container aqua-editor";
        // Add editor element to the editor holder
        const editorHolder =
            document.getElementById("aqua-editors-holder");
        editorHolder.insertBefore(editorElement, editorHolder.firstChild);

        let editor = ace.edit(editorElement.id);
        editor.setTheme("ace/theme/new_one_dark");
        // editor.setTheme("ace/theme/chrome");

        ace.require("ace/ext/language_tools");
        editor.setOptions(getEditorOptions(editor));
        editor.container.style.lineHeight = 1.8;
        editor.renderer.updateFontSize();

        // Read the file and add content
        const data = fs.readFileSync(fileConfig.filePath);
        editor.setValue(data.toString(), -1);

        // TODO:: Need to handle when clear the current content and try to type. getiing error
        var useWebWorker = window.location.search.toLowerCase().indexOf('noworker') == -1;

        editor.getSession().setMode({
            path: 'ace/mode/' + getFileType(fileConfig.extension, fileConfig.text),
            inline: true
        });

        ace.config.loadModule('ace/ext/tern', function () {
            editor.setOptions({
                /**
                 * Either `true` or `false` or to enable with custom options pass object that
                 * has options for tern server: http://ternjs.net/doc/manual.html#server_api
                 * If `true`, then default options will be used
                 */
                enableTern: {
                    /* http://ternjs.net/doc/manual.html#option_defs */
                    defs: ['browser', 'ecma5'], /* http://ternjs.net/doc/manual.html#plugins */
                    plugins: {
                        doc_comment: {
                            fullDocs: true
                        }
                    }, /**
                     * (default is true) If web worker is used for tern server.
                     * This is recommended as it offers better performance, but prevents this from working in a local html file due to browser security restrictions
                     */
                    useWorker: useWebWorker, /* if your editor supports switching between different files (such as tabbed interface) then tern can do this when jump to defnition of function in another file is called, but you must tell tern what to execute in order to jump to the specified file */
                    switchToDoc: function (name, start) {
                        // console.log('switchToDoc called but not defined. name=' + name + '; start=', start);
                    }, /**
                     * if passed, this function will be called once ternServer is started.
                     * This is needed when useWorker=false because the tern source files are loaded asynchronously before the server is started.
                     */
                    startedCb: function () {
                        //once tern is enabled, it can be accessed via editor.ternServer
                        // console.log('editor.ternServer:', editor.ternServer);
                    },
                },
                /**
                 * when using tern, it takes over Ace's built in snippets support.
                 * this setting affects all modes when using tern, not just javascript.
                 */
                enableSnippets: true,
                enableBasicAutocompletion: true,
                // enableLiveAutocompletion: true,
                scrollBarStyle: "thin",
                autoBeautify: true, // this enables the plugin to work with hotkeys (ctrl+b to beautify)
                htmlBeautify: true,
            });
        });
        // Format editor
        ace.config.loadModule('ace/ext/beautify', function (beautify) {
            editor.setOptions({
                // beautify when closing bracket typed in javascript or css mode
                autoBeautify: true,
                // this enables the plugin to work with hotkeys (ctrl+b to beautify)
                htmlBeautify: true,
            });

            // modify beautify options as needed:
            window.beautifyOptions = beautify.options;
            window.beautify = beautify;
        });

        // Editor context menu
        editor.container.addEventListener("contextmenu", function (e) {
            $('#right-click-popup').hide();
            $contextMenu.css({
                display: 'block',
                position: 'absolute',
                left: e.pageX,
                top: e.pageY,
            });
        }, false);
        // Editor context menu close
        $(document).on('click', function (e) {
            // Get the target element that was clicked
            const $target = $(e.target);

            // Hide the context menu if the target element is neither a Tree node nor a context menu item
            if (!$target.is('.node') && !$target.closest('.dropdown-menu').length) {
                window.directoryIsRightClick = true;
                $contextMenu.hide();
            }
        });

        return editor;
    } catch (e) {
        console.log(e);
    }
}

/*-------------------------------------
* Format selected editor
*------------------------------------*/
document.getElementById("aqua-format-editor")
    .addEventListener("click", () => {
        let tabGroup = document.querySelector("tab-group");
        let activeTab = tabGroup.getActiveTab();
        let editorSelect = ace.edit("aqua-editor-" + activeTab.id);
        let fileExt = path.parse(activeTab.title).ext;

        if (fileExt == ".html" || fileExt == ".php") {
            let val = editorSelect.getValue();
            val = html_beautify(val);
            editorSelect.setValue(val, -1);
        } else {
            beautify.beautify(editorSelect.session);
        }

        $contextMenu.hide();
    });

/*-------------------------------------
* Get Editor Options / Config
*------------------------------------*/
function getEditorOptions(editor) {
    var useWebWorker = window.location.search.toLowerCase().indexOf('noworker') == -1;

    editor.getSession().setUseWorker(useWebWorker);

    return { // theme string from ace/theme or custom?
        fontFamily: "JetBrains Mono", // string: set the font-family css value
        // editor options
        selectionStyle: "line", // "line"|"text"
        highlightActiveLine: true, // boolean
        highlightSelectedWord: true, // boolean
        readOnly: false, // boolean: true if read only
        cursorStyle: "smooth", // "ace"|"slim"|"smooth"|"wide"
        mergeUndoDeltas: true, // false|true|"always"
        behavioursEnabled: true, // boolean: true if enable custom behaviours
        wrapBehavioursEnabled: true, // boolean
        autoScrollEditorIntoView: undefined, // boolean: this is needed if editor is inside scrollable page
        keyboardHandler: null, // function: handle custom keyboard events

        // renderer options
        animatedScroll: false, // boolean: true if scroll should be animated
        displayIndentGuides: true, // boolean: true if the indent should be shown. See 'showInvisibles'
        showInvisibles: false, // boolean -> displayIndentGuides: true if show the invisible tabs/spaces in indents
        showPrintMargin: true, // boolean: true if show the vertical print margin
        printMarginColumn: 120, // number: number of columns for vertical print margin
        printMargin: true, // boolean | number: showPrintMargin | printMarginColumn
        showGutter: true, // boolean: true if show line gutter
        fadeFoldWidgets: false, // boolean: true if the fold lines should be faded
        showFoldWidgets: true, // boolean: true if the fold lines should be shown ?
        showLineNumbers: true,
        highlightGutterLine: true, // boolean: true if the gutter line should be highlighted
        hScrollBarAlwaysVisible: false, // boolean: true if the horizontal scroll bar should be shown regardless
        vScrollBarAlwaysVisible: false, // boolean: true if the vertical scroll bar should be shown regardless
        fontSize: 13, // number | string: set the font size to this many pixels
        maxLines: undefined, // number: set the maximum lines possible. This will make the editor height changes
        minLines: undefined, // number: set the minimum lines possible. This will make the editor height changes
        maxPixelHeight: 0, // number -> maxLines: set the maximum height in pixel, when 'maxLines' is defined.
        scrollPastEnd: 0, // number -> !maxLines: if positive, user can scroll pass the last line and go n * editorHeight more distance
        fixedWidthGutter: true, // boolean: true if the gutter should be fixed width

        // mouseHandler options
        scrollSpeed: 2, // number: the scroll speed index
        dragDelay: 0, // number: the drag delay before drag starts. it's 150ms for mac by default
        dragEnabled: true, // boolean: enable dragging
        // focusTimout: 0, // number: the focus delay before focus starts.
        tooltipFollowsMouse: true, // boolean: true if the gutter tooltip should follow mouse
        // session options
        firstLineNumber: 1, // number: the line number in first line
        overwrite: false, // boolean
        newLineMode: "auto", // "auto" | "unix" | "windows"
        useWorker: true, // boolean: true if use web worker for loading scripts
        useSoftTabs: true, // boolean: true if we want to use spaces than tabs
        tabSize: 2, // number
        wrap: false, // boolean | string | number: true/'free' means wrap instead of horizontal scroll, false/'off' means horizontal scroll instead of wrap, and number means number of column before wrap. -1 means wrap at print margin
        indentedSoftWrap: true, // boolean
        foldStyle: "markbegin", // enum: 'manual'/'markbegin'/'markbeginend'.
        enableEmmet: true, enableMultiselect: true, enableLinking: true,
    }
}
