/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

ace.define("ace/theme/new_one_dark",["require","exports","module","ace/lib/dom"], function(require, exports, module) {
exports.isDark = true;
exports.cssClass = "ace-mytheme";
exports.cssText = ".ace-mytheme .ace_gutter {\n" +
    "  background: #272B33;\n" +
    "  color: rgb(103,111,122)\n" +
    "}\n" +
    "\n" +
    ".ace-mytheme .ace_print-margin {\n" +
    "  width: 1px;\n" +
    "  background: #e8e8e8\n" +
    "}\n" +
    "\n" +
    ".ace-mytheme {\n" +
    "  background-color: #272B33;\n" +
    "  color: #A6B2C0\n" +
    "}\n" +
    "\n" +
    ".ace-mytheme .ace_cursor {\n" +
    "  color: #528BFF\n" +
    "}\n" +
    "\n" +
    ".ace-mytheme .ace_marker-layer .ace_selection {\n" +
    "  background: #3D4350\n" +
    "}\n" +
    "\n" +
    ".ace-mytheme.ace_multiselect .ace_selection.ace_start {\n" +
    "  box-shadow: 0 0 3px 0px #272B33;\n" +
    "  border-radius: 2px\n" +
    "}\n" +
    "\n" +
    ".ace-mytheme .ace_marker-layer .ace_step {\n" +
    "  background: rgb(198, 219, 174)\n" +
    "}\n" +
    "\n" +
    ".ace-mytheme .ace_marker-layer .ace_bracket {\n" +
    "  margin: -1px 0 0 -1px;\n" +
    "  border: 1px solid #747369\n" +
    "}\n" +
    "\n" +
    ".ace-mytheme .ace_marker-layer .ace_active-line {\n" +
    "  background: #2B313A\n" +
    "}\n" +
    "\n" +
    ".ace-mytheme .ace_gutter-active-line {\n" +
    "  background-color: #2B313A\n" +
    "}\n" +
    "\n" +
    ".ace-mytheme .ace_marker-layer .ace_selected-word {\n" +
    "  border: 1px solid #3D4350\n" +
    "}\n" +
    "\n" +
    ".ace-mytheme .ace_fold {\n" +
    "  background-color: rgba(89, 186, 255, 1.0);\n" +
    "  border-color: #A6B2C0\n" +
    "}\n" +
    "\n" +
    ".ace-mytheme .ace_keyword {\n" +
    "  color: rgba(216, 119, 244, 1.0)\n" +
    "}\n" +
    "\n" +
    ".ace-mytheme .ace_keyword.ace_operator {\n" +
    "  color: #D877F4\n" +
    "}\n" +
    "\n" +
    ".ace-mytheme .ace_keyword.ace_other.ace_unit {\n" +
    "  color: rgba(231, 153, 84, 1.0)\n" +
    "}\n" +
    "\n" +
    ".ace-mytheme .ace_constant {\n" +
    "  color: rgba(231, 153, 84, 1.0)\n" +
    "}\n" +
    "\n" +
    ".ace-mytheme .ace_constant.ace_numeric {\n" +
    "  color: rgba(231, 153, 84, 1.0)\n" +
    "}\n" +
    "\n" +
    ".ace-mytheme .ace_constant.ace_character.ace_escape {\n" +
    "  color: rgba(77, 196, 211, 1.0)\n" +
    "}\n" +
    "\n" +
    ".ace-mytheme .ace_support.ace_function {\n" +
    "  color: rgba(77, 196, 211, 1.0)\n" +
    "}\n" +
    "\n" +
    ".ace-mytheme .ace_support.ace_class {\n" +
    "  color: rgba(254, 209, 123, 1.0)\n" +
    "}\n" +
    "\n" +
    ".ace-mytheme .ace_storage {\n" +
    "  color: rgba(216, 119, 244, 1.0)\n" +
    "}\n" +
    "\n" +
    ".ace-mytheme .ace_invalid.ace_illegal {\n" +
    "  color: rgba(17, 22, 32, 1.0);\n" +
    "  background-color: rgba(255, 117, 121, 1.0)\n" +
    "}\n" +
    "\n" +
    ".ace-mytheme .ace_invalid.ace_deprecated {\n" +
    "  color: rgba(17, 22, 32, 1.0);\n" +
    "  background-color: rgba(231, 122, 72, 1.0)\n" +
    "}\n" +
    "\n" +
    ".ace-mytheme .ace_string {\n" +
    "  color: rgba(148, 212, 118, 1.0)\n" +
    "}\n" +
    "\n" +
    ".ace-mytheme .ace_string.ace_regexp {\n" +
    "  color: rgba(77, 196, 211, 1.0)\n" +
    "}\n" +
    "\n" +
    ".ace-mytheme .ace_comment {\n" +
    "  color: rgba(79, 91, 107, 1.0)\n" +
    "}\n" +
    "\n" +
    ".ace-mytheme .ace_variable {\n" +
    "  color: rgba(247, 101, 112, 1.0)\n" +
    "}\n" +
    "\n" +
    ".ace-mytheme .ace_meta.ace_selector {\n" +
    "  color: rgba(216, 119, 244, 1.0)\n" +
    "}\n" +
    "\n" +
    ".ace-mytheme .ace_entity.ace_other.ace_attribute-name {\n" +
    "  color: rgba(231, 153, 84, 1.0)\n" +
    "}\n" +
    "\n" +
    ".ace-mytheme .ace_entity.ace_name.ace_function {\n" +
    "  color: rgba(89, 186, 255, 1.0)\n" +
    "}\n" +
    "\n" +
    ".ace-mytheme .ace_entity.ace_name.ace_tag, \n" +
    ".ace-mytheme .ace_meta.ace_tag  {\n" +
    "  color: rgba(247, 101, 112, 1.0)\n" +
    "}\n" +
    "\n" +
    ".ace-mytheme .ace_markup.ace_list {\n" +
    "  color: rgba(247, 101, 112, 1.0)\n" +
    "}";

    var dom = require("../lib/dom");
    dom.importCssString(exports.cssText, exports.cssClass, false);
});                (function() {
    ace.require(["ace/theme/new_one_dark"], function(m) {
        if (typeof module == "object" && typeof exports == "object" && module) {
            module.exports = m;
        }
    });
})();

