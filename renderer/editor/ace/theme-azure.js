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

ace.define("ace/theme/azure",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

exports.isDark = true;
exports.cssClass = "ace-mytheme";
exports.cssText = `
.ace-mytheme .ace_gutter {
  background: #181e21;
  color: rgb(140,142,147)
}

.ace-mytheme .ace_print-margin {
  width: 1px;
  background: #e8e8e8
}

.ace-mytheme {
  background-color: #181e21;
  color: #ffffff
}

.ace-mytheme .ace_cursor {
  color: #f8f8f0
}

.ace-mytheme .ace_marker-layer .ace_selection {
  background: #47949a2c
}

.ace-mytheme.ace_multiselect .ace_selection.ace_start {
  box-shadow: 0 0 3px 0px #181D26;
  border-radius: 2px
}

.ace-mytheme .ace_marker-layer .ace_step {
  background: rgb(198, 219, 174)
}

.ace-mytheme .ace_marker-layer .ace_bracket {
  margin: -1px 0 0 -1px;
  border: 1px solid #3b3a32
}

.ace-mytheme .ace_marker-layer .ace_active-line {
  background: #33333c
}

.ace-mytheme .ace_gutter-active-line {
  background-color: #33333c
}

.ace-mytheme .ace_marker-layer .ace_selected-word {
  border: 1px solid #47959a
}

.ace-mytheme .ace_fold {
  background-color: #508aaa;
  border-color: #ffffff
}

.ace-mytheme .ace_keyword {
  color: #508aaa
}

.ace-mytheme .ace_keyword.ace_other.ace_unit {
  color: #6AB0A3
}

.ace-mytheme .ace_constant.ace_language {
  color: #52708b
}

.ace-mytheme .ace_constant.ace_numeric {
  color: #64aeb3
}

.ace-mytheme .ace_constant.ace_character {
  color: #52708b
}

.ace-mytheme .ace_constant.ace_other {
  color: #52708b
}

.ace-mytheme .ace_support.ace_function {
  color: #6AB0A3
}

.ace-mytheme .ace_support.ace_constant {
  color: #52708b
}

.ace-mytheme .ace_support.ace_constant.ace_property-value {
  color: #64aeb3
}

.ace-mytheme .ace_support.ace_class {
  font-style: italic;
  color: #52708b
}

.ace-mytheme .ace_support.ace_type {
  font-style: italic;
  color: #52708b
}

.ace-mytheme .ace_storage {
  color: #52708b
}

.ace-mytheme .ace_storage.ace_type {
  color: #6AB0A3
}

.ace-mytheme .ace_invalid {
  color: #f8f8f0;
  background-color: #00a8c6
}

.ace-mytheme .ace_invalid.ace_deprecated {
  color: #f8f8f0;
  background-color: #00a8c6
}

.ace-mytheme .ace_string {
  color: #64aeb3
}

.ace-mytheme .ace_comment {
  color: #414d62
}

.ace-mytheme .ace_variable {
  color: #508aaa
}

.ace-mytheme .ace_variable.ace_parameter {
  font-style: italic;
  color: #ffffff
}

.ace-mytheme .ace_entity.ace_other.ace_attribute-name {
  color: #52708b
}

.ace-mytheme .ace_entity.ace_name.ace_function {
  color: #508aaa
}

.ace-mytheme .ace_entity.ace_name.ace_tag {
  color: #6AB0A3
}`;

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});
