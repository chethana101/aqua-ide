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

/*----------------------------------------
* Set editor tabs
*----------------------------------------*/
const tabGroupadd = document.querySelector("tab-group");

// Set up the default tab which is created when the "New Tab" button is clicked
const tab = tabGroupadd.addTab({
    title: 'Untitled',
    active: true,
    visible: true,
});

document.addEventListener("DOMContentLoaded", async function() {
    await getEditor();
    console.log("OK");
});

/*-------------------------------------
* Get Editor Instance
*------------------------------------*/
async function getEditor() {
    const editor = ace.edit('aqua-editor-1');

    editor.getSession().setMode('ace/mode/html');
    ace.require("ace/ext/language_tools");
    editor.session.setValue('<!DOCTYPE html>\n' +
        '<html lang="en">\n' +
        '<head>\n' +
        '    <meta charset="UTF-8">\n' +
        '    <link type="text/css" rel="stylesheet" href="./assets/css/variables.css">\n' +
        '    <link type="text/css" rel="stylesheet" href="./assets/css/icons.css">\n' +
        '    <link type="text/css" rel="stylesheet" href="./assets/css/index.css">\n' +
        '    <link type="text/css" rel="stylesheet" href="./assets/css/editor.css">\n' +
        '    <title>Aqa IDE</title>\n' +
        '</head>\n' +
        '<body>', -1);
    editor.setOptions(getEditorOptions(editor));

    editor.container.style.lineHeight = 1.8;
    editor.renderer.updateFontSize();
    console.log(editor);
    // var split = ace.split(editor, editor2, "horizontal");
}

/*-------------------------------------
* Get Editor Options / Config
*------------------------------------*/
function getEditorOptions(editor) {
    var useWebWorker = window.location.search.toLowerCase().indexOf('noworker') == -1;

    editor.getSession().setUseWorker(useWebWorker);

    return {
        theme: "ace/theme/aqua_ide", // theme string from ace/theme or custom?
        fontFamily: "JetBrains Mono", // string: set the font-family css value
        // editor options
        selectionStyle: "line", // "line"|"text"
        highlightActiveLine: true, // boolean
        highlightSelectedWord: true, // boolean
        readOnly: false, // boolean: true if read only
        cursorStyle: "ace", // "ace"|"slim"|"smooth"|"wide"
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
        printMarginColumn: 8000, // number: number of columns for vertical print margin
        printMargin: undefined, // boolean | number: showPrintMargin | printMarginColumn
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

        enableTern: {
            /* http://ternjs.net/doc/manual.html#option_defs */
            defs: ['browser', 'ecma5'],
                /* http://ternjs.net/doc/manual.html#plugins */
                plugins: {
                doc_comment: {
                    fullDocs: true
                }
            },
            /**
             * (default is true) If web worker is used for tern server.
             * This is recommended as it offers better performance, but prevents this from working in a local html file due to browser security restrictions
             */
            useWorker: false,
                /* if your editor supports switching between different files (such as tabbed interface) then tern can do this when jump to defnition of function in another file is called, but you must tell tern what to execute in order to jump to the specified file */
                switchToDoc: function (name, start) {
                console.log('switchToDoc called but not defined. name=' + name + '; start=', start);
            },
            /**
             * if passed, this function will be called once ternServer is started.
             * This is needed when useWorker=false because the tern source files are loaded asynchronously before the server is started.
             */
            startedCb: function () {
                //once tern is enabled, it can be accessed via editor.ternServer
                console.log('editor.ternServer:', editor.ternServer);
            },
        },
        // session options
        firstLineNumber: 1, // number: the line number in first line
        overwrite: false, // boolean
        newLineMode: "auto", // "auto" | "unix" | "windows"
        useWorker: true, // boolean: true if use web worker for loading scripts
        useSoftTabs: true, // boolean: true if we want to use spaces than tabs
        tabSize: 4, // number
        wrap: false, // boolean | string | number: true/'free' means wrap instead of horizontal scroll, false/'off' means horizontal scroll instead of wrap, and number means number of column before wrap. -1 means wrap at print margin
        indentedSoftWrap: true, // boolean
        foldStyle: "markbegin", // enum: 'manual'/'markbegin'/'markbeginend'.
        enableEmmet: true,
        enableMultiselect: true,
        enableLinking: true,
        enableSnippets: true,
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        scrollBarStyle: "thin",
    }
}
