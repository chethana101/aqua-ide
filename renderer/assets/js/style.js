const {ipcRenderer} = require("electron");
const ipc = ipcRenderer;

/*----------------------------------------
* Title bar toggle actions
*----------------------------------------*/
document.getElementById("aqua-ide-minimize")
    .addEventListener("click", () => {
        ipc.send('minimize-aqua-ide');
    });
document.getElementById("aqua-ide-maximize")
    .addEventListener("click", () => {
        ipc.send('maximize-aqua-ide');
    });
document.getElementById("aqua-ide-close")
    .addEventListener("click", () => {
        ipc.send('close-aqua-ide');
    });

/*----------------------------------------
* Resize the editor container
*----------------------------------------*/
window.resizeEditorContainer = function () {
    Array.from(document.querySelectorAll(".editor-container"))
        .forEach(function (editorEl) {
            if(editorEl != undefined){
                ace.edit(editorEl).resize();
            }
        });
}

/*----------------------------------------
* Side bar menu item click event
*----------------------------------------*/
const sideBarItem = document.querySelectorAll(".side-bar-item");
sideBarItem.forEach((element, key) => {
    element.addEventListener("click", (e) => {
        // Remove current element selected event
        sideBarItem.forEach((element, keySub) => {
            if (key != keySub) {
                element.classList.remove("side-bar-item-select");
            }
        });
        // Add selected color to the element
        e.target.closest(".side-bar-item").classList.toggle("side-bar-item-select");
    });
});

/*----------------------------------------
* Split.js init
*----------------------------------------*/
let Split = require('split.js');

var split = Split(['#side-bar-panels', '#title-bar-and-editor'], {
    sizes: [20, 80],
    minSize: 0,
    gutterSize: 2,
    expandToMin: true,
    onDrag: function (e) {
    },
    cursor: 'e-resize',
    elementStyle: function (dimension, size, gutterSize) {
        // Resize the editor
        resizeEditorContainer();
        return {
            'flex-basis': 'calc(' + size + '% - ' + gutterSize + 'px)',
        }
    },
    gutterStyle: function (dimension, gutterSize) {
        return {
            'flex-basis': gutterSize + 'px',
        }
    },
});

/*----------------------------------------
* Selector style action
*----------------------------------------*/
var x, i, j, l, ll, selElmnt, a, b, c;
/*look for any elements with the class "custom-select":*/
x = document.getElementsByClassName("field-selector");
l = x.length;
for (i = 0; i < l; i++) {
    selElmnt = x[i].getElementsByTagName("select")[0];
    ll = selElmnt.length;
    /*for each element, create a new DIV that will act as the selected item:*/
    a = document.createElement("DIV");
    a.setAttribute("class", "select-selected");
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);
    /*for each element, create a new DIV that will contain the option list:*/
    b = document.createElement("DIV");
    b.setAttribute("class", "select-items select-hide");
    for (j = 0; j < ll; j++) {
        /*for each option in the original select element,
        create a new DIV that will act as an option item:*/
        c = document.createElement("DIV");
        c.innerHTML = selElmnt.options[j].innerHTML;
        c.addEventListener("click", function (e) {
            /*when an item is clicked, update the original select box,
            and the selected item:*/
            var y, i, k, s, h, sl, yl;
            s = this.parentNode.parentNode.getElementsByTagName("select")[0];
            sl = s.length;
            h = this.parentNode.previousSibling;
            for (i = 0; i < sl; i++) {
                if (s.options[i].innerHTML == this.innerHTML) {
                    s.selectedIndex = i;
                    h.innerHTML = this.innerHTML;
                    y = this.parentNode.getElementsByClassName("same-as-selected");
                    yl = y.length;
                    for (k = 0; k < yl; k++) {
                        y[k].removeAttribute("class");
                    }
                    this.setAttribute("class", "same-as-selected");
                    break;
                }
            }
            h.click();
        });
        b.appendChild(c);
    }
    x[i].appendChild(b);
    a.addEventListener("click", function (e) {
        /*when the select box is clicked, close any other select boxes,
        and open/close the current select box:*/
        e.stopPropagation();
        closeAllSelect(this);
        this.nextSibling.classList.toggle("select-hide");
        this.classList.toggle("select-arrow-active");
    });
}

function closeAllSelect(elmnt) {
    /*a function that will close all select boxes in the document,
    except the current select box:*/
    var x, y, i, xl, yl, arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    xl = x.length;
    yl = y.length;
    for (i = 0; i < yl; i++) {
        if (elmnt == y[i]) {
            arrNo.push(i)
        } else {
            y[i].classList.remove("select-arrow-active");
            y[i].style.border = "1.5px solid var(--selector-background-default)";
        }
    }
    for (i = 0; i < xl; i++) {
        if (arrNo.indexOf(i)) {
            x[i].classList.add("select-hide");
        }
    }
}

/* If the user clicks anywhere outside the select box,
then close all select boxes:*/
document.addEventListener("click", closeAllSelect);

/*-------------------------------------
* Selector border style actions
*------------------------------------*/
document.querySelectorAll(".select-selected")
    .forEach((ele) => {
        ele.addEventListener("click", () => {
            ele.style.border = "1.5px solid var(--primary-color)";
        });
    });
document.querySelectorAll(".field")
    .forEach((ele, key) => {
        const fieldBox = document.querySelectorAll(".field-input");
        ele.addEventListener("focus", () => {
            ele.style.border = "1.5px solid var(--primary-color)";
        });
        ele.addEventListener("blur", () => {
            ele.style.border = "1.5px solid var(--selector-border-default)";
        });
    });

/*-------------------------------------
* Sidebar panel actions
*------------------------------------*/
const sideBarIdHolder = [];
document.querySelectorAll(".side-bar-item-toggle")
    .forEach((element, key) => {
        // Assign all the id's to the array
        sideBarIdHolder.push(element.dataset.id);
        // Add click listener to icon toggle
        element.addEventListener("click", () => {
            // Check if element exist or not
            if (sideBarIdHolder[key] !== undefined || sideBarIdHolder[key] != null) {
                document.querySelector("#" + sideBarIdHolder[key])
                    .style.display = "block";
                // Hide un-wanted panels
                sideBarIdHolder.forEach((id) => {
                    if (sideBarIdHolder[key] != id) {
                        let elementHideId = document.getElementById(id);
                        if (elementHideId != undefined || elementHideId != null) {
                            document.getElementById(id).style.display = "none";
                        }
                    }
                });
            }
            // Check if item is select or not
            if (element.classList.contains('side-bar-item-select')) {
                document.getElementById("side-bar-panels")
                    .style.flexBasis = "calc(20% - 1px)";
                document.getElementById("title-bar-and-editor")
                    .style.flexBasis = "calc(80% - 1px)";
            } else {
                document.getElementById("side-bar-panels")
                    .style.flexBasis = "calc(0% - 1px)";
                document.getElementById("title-bar-and-editor")
                    .style.flexBasis = "calc(100% - 1px)";
            }
            // Resize the editor
            resizeEditorContainer();
        });
    });

/*-------------------------------------
* Dropdown menus
*------------------------------------*/
// Select all dropdown toggle buttons and menu lists
const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
const dropdownMenus = document.querySelectorAll('.dropdown-menu');

// Hide all dropdown menus by default
dropdownMenus.forEach((menu) => {
    menu.style.display = 'none';
});

// Add a click event listener to each dropdown toggle button
dropdownToggles.forEach((toggle) => {
    toggle.addEventListener('click', function(e) {
        // Prevent default button behavior
        e.preventDefault();

        // Hide all other open dropdown menus
        dropdownMenus.forEach((menu) => {
            if (menu !== toggle.nextElementSibling) {
                menu.style.display = 'none';
            }
        });

        // Toggle the visibility of this dropdown menu
        toggle.nextElementSibling.style.display = toggle.nextElementSibling.style.display === 'block' ? 'none' : 'block';
    });
});

// Add a click event listener to the document to hide all dropdown menus
document.addEventListener('click', function(e) {
    // Check if the click was outside of a dropdown menu
    let isOutsideDropdown = true;
    dropdownToggles.forEach((toggle) => {
        if (toggle.contains(e.target)) {
            isOutsideDropdown = false;
        }
    });
    dropdownMenus.forEach((menu) => {
        if (menu.contains(e.target)) {
            isOutsideDropdown = false;
        }
    });

    // Hide all dropdown menus if the click was outside of them
    if (isOutsideDropdown) {
        dropdownMenus.forEach((menu) => {
            menu.style.display = 'none';
        });
    }
});

/*-------------------------------------
* Open new window
*------------------------------------*/
document.getElementById("title-bar-open-new-window")
    .addEventListener("click", () => {
        ipc.send('open-new-window');
        document.getElementById("dropdown-menu-main-toggle")
            .style.display = "none";
    });

/*-------------------------------------
* Close the current window
*------------------------------------*/
document.getElementById("title-bar-close-window")
    .addEventListener("click", () => {
        window.close();
        document.getElementById("dropdown-menu-main-toggle")
            .style.display = "none";
    });

/*-------------------------------------
* Close all the windows
*------------------------------------*/
document.getElementById("title-bar-close-all-window")
    .addEventListener("click", () => {
        ipc.send('close-all-aqua-ide');
        document.getElementById("dropdown-menu-main-toggle")
            .style.display = "none";
    });
