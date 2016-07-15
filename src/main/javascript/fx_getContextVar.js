// Copyright 2016 Foxysoft GmbH
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

/**
 * Get context variable using uGetContextVar()
 * @param {string} iv_params - <pre>
 *     iv_params := var_name[!!default_value]
 * </pre>
 * @return {string} - value of context variable or default value
 *         if variable doesn't exist 
 * @requires fx_trace
 */
function fx_getContextVar(iv_params)
{
    var SCRIPT = "fx_getContextVar: ";
    fx_trace(SCRIPT+"Entering iv_params="+iv_params);

    var lt_params = ("" + iv_params).split("!!");
    var lv_var_name = lt_params[0];
    var lv_default_value = lt_params.length > 1 ? lt_params[1] : "";

    var lv_result = uGetContextVar(
        lv_var_name
        ,lv_default_value
    );

    fx_trace(SCRIPT+"Returning "+lv_result);
    return lv_result;
}
