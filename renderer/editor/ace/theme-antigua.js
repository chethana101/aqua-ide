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

ace.define("ace/theme/antigua",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

exports.isDark = true;
exports.cssClass = "ace-antigua";
exports.cssText = ".ace-antigua .ace_gutter {\n" +
    "  background: #001820;\n" +
    "  color: rgb(124,136,137)\n" +
    "}\n" +
    "\n" +
    ".ace-antigua .ace_print-margin {\n" +
    "  width: 1px;\n" +
    "  background: #e8e8e8\n" +
    "}\n" +
    "\n" +
    ".ace-antigua {\n" +
    "  background-color: #001820;\n" +
    "  color: #f8f8f2\n" +
    "}\n" +
    "\n" +
    ".ace-antigua .ace_cursor {\n" +
    "  color: #d94f52\n" +
    "}\n" +
    "\n" +
    ".ace-antigua .ace_marker-layer .ace_selection {\n" +
    "  background: #005c77\n" +
    "}\n" +
    "\n" +
    ".ace-antigua.ace_multiselect .ace_selection.ace_start {\n" +
    "  box-shadow: 0 0 3px 0px #001820;\n" +
    "  border-radius: 2px\n" +
    "}\n" +
    "\n" +
    ".ace-antigua .ace_marker-layer .ace_step {\n" +
    "  background: rgb(198, 219, 174)\n" +
    "}\n" +
    "\n" +
    ".ace-antigua .ace_marker-layer .ace_bracket {\n" +
    "  margin: -1px 0 0 -1px;\n" +
    "  border: 1px solid #d7d6d0\n" +
    "}\n" +
    "\n" +
    ".ace-antigua .ace_marker-layer .ace_active-line {\n" +
    "  background: #9da3e6\n" +
    "}\n" +
    "\n" +
    ".ace-antigua .ace_gutter-active-line {\n" +
    "  background-color: #9da3e6\n" +
    "}\n" +
    "\n" +
    ".ace-antigua .ace_marker-layer .ace_selected-word {\n" +
    "  border: 1px solid #005c77\n" +
    "}\n" +
    "\n" +
    ".ace-antigua .ace_fold {\n" +
    "  background-color: #8cd9fd;\n" +
    "  border-color: #f8f8f2\n" +
    "}\n" +
    "\n" +
    ".ace-antigua .ace_keyword {\n" +
    "  color: #f5b00e\n" +
    "}\n" +
    "\n" +
    ".ace-antigua .ace_constant.ace_numeric {\n" +
    "  color: #ae81ff\n" +
    "}\n" +
    "\n" +
    ".ace-antigua .ace_support {\n" +
    "  color: #66d9ef\n" +
    "}\n" +
    "\n" +
    ".ace-antigua .ace_support.ace_type {\n" +
    "  font-style: italic;\n" +
    "  color: #66d9ef\n" +
    "}\n" +
    "\n" +
    ".ace-antigua .ace_storage {\n" +
    "  color: #008af0\n" +
    "}\n" +
    "\n" +
    ".ace-antigua .ace_storage.ace_type {\n" +
    "  font-style: italic;\n" +
    "  color: #66d9ef\n" +
    "}\n" +
    "\n" +
    ".ace-antigua .ace_string {\n" +
    "  color: #edfb5b\n" +
    "}\n" +
    "\n" +
    ".ace-antigua .ace_comment {\n" +
    "  color: #94b1b1\n" +
    "}\n" +
    "\n" +
    ".ace-antigua .ace_variable {\n" +
    "  color: #8cd9fd\n" +
    "}\n" +
    "\n" +
    ".ace-antigua .ace_variable.ace_parameter {\n" +
    "  color: #ff5233\n" +
    "}\n" +
    "\n" +
    ".ace-antigua .ace_entity.ace_other.ace_attribute-name {\n" +
    "  color: #a6e22e\n" +
    "}\n" +
    "\n" +
    ".ace-antigua .ace_entity.ace_name.ace_function {\n" +
    "  color: #8cd9fd\n" +
    "}\n" +
    "\n" +
    ".ace-antigua .ace_entity.ace_name.ace_tag {\n" +
    "  color: #fa4383\n";

    var dom = require("../lib/dom");
    dom.importCssString(exports.cssText, exports.cssClass, false);
});                (function() {
    ace.require(["ace/theme/antigua"], function(m) {
        if (typeof module == "object" && typeof exports == "object" && module) {
            module.exports = m;
        }
    });
})();
