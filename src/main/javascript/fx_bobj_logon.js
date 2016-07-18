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
 * <div>Connects to the BOBJ Central Management Server (CMS).</div>
 * @param {string?} iv_params - <pre>
 * iv_params := [host[!!port[!!login[!!password]]]]
 * </pre>
 * Parameters will be defaulted from the respective constants
 * of the current repository if not supplied or null.
 * @return {string} - empty on success or !ERROR-prefixed message
 * with !ERROR in case of exception
 * @requires fx_bobj_Session
 * @requires fx_JavaUtils
 * @see fx_bobj_Session.logon
 */
function fx_bobj_logon(iv_params)
{
    var SCRIPT = "fx_bobj_logon: ";
    var lv_result = "";

    if(typeof iv_params != "undefined"
       && iv_params != null
       && iv_params != "")
    {
        var lt_params = (""+iv_params).split("!!");
        var lv_host     = lt_params.length > 0 ? lt_params[0] : null;
        var lv_port     = lt_params.length > 1 ? lt_params[1] : null;
        var lv_login    = lt_params.length > 2 ? lt_params[2] : null;
        var lv_password = lt_params.length > 3 ? lt_params[3] : null;
    }
    try
    {
        fx_bobj_Session.logon(
            lv_host
            ,lv_port
            ,lv_login
            ,lv_password
        );
    }
    catch(lo_exception)
    {
        lv_result = fx_JavaUtils.handleException(SCRIPT, lo_exception);
    }
    return lv_result;
}
