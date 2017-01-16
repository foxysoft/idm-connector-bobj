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
 * <div>Wrapper for uGetConstant to work around its quirks</div>
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
