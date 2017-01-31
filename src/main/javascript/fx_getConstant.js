// Copyright 2017 Foxysoft GmbH
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/* global fx_trace */

/**
 * <div>Get constant via uGetConstant, working around some
 * of its quirks.</div>
 * <div><strong>SAP IDM 7.2:</strong> if the caller tries to
 * retrieve a <strong>package</strong> constant, i.e. if
 * iv_name starts with "pck.", returns the corresponding
 * <strong>global</strong> constant instead. This is the
 * reverse effect of what uGetConstant does in SAP IDM 8.0,
 * except that fx_getConstant never emits any warnings.</div>
 * <div><strong>All SAP IDM releases:</strong> If the return
 * value of uGetConstant is the string "-undefined-" or
 * the string "$EMPTY", this function will return an empty
 * string instead.</div>
 * @param {string} iv_name - <pre>
 *     iv_name := [[glb|pck|rep|ddm].]constant_name
 * </pre>
 * @return {string} value of constant
 * @requires fx_trace
 * @since 1.1.0
 */
function fx_getConstant(iv_name)
{
    return fx_trace({compat: 1.0}).fx_getConstant(iv_name);
}
