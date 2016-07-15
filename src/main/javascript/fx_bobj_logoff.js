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
 * Disconnects from the BOBJ Central Management Server (CMS).
 * @returns {string} - empty on success or !ERROR-prefixed message
 * @requires fx_bobj_Session
 * @requires fx_JavaUtils
 * @see fx_bobj_Session.logoff
 */
function fx_bobj_logoff()
{
    var SCRIPT = "fx_bobj_logoff: ";
    var lv_result = "";
    try
    {
        fx_bobj_Session.logoff();
    }
    catch(lo_exception)
    {
        lv_result = fx_JavaUtils.handleException(SCRIPT, lo_exception);
    }
    return lv_result;
}
