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
 * Removes/deletes a BOBJ user.
 * @see fx_bobj_User.remove
 * @param {com.sap.idm.ic.DSEEntry} io_entry - IDM entry
 * @return {string} - empty on success or skips entry on failure
 * @requires fx_bobj_User
 * @requires fx_JavaUtils
 * @since 1.0.0
 */
function fx_bobj_removeUser(io_entry)
{
    var SCRIPT = "fx_bobj_removeUser: ";
    var lv_result = "";
    var lo_exception;
    try
    {
        fx_bobj_User.remove(io_entry);
    }
    catch(lo_exception)
    {
        lv_result = fx_JavaUtils.handleException(SCRIPT, lo_exception);

        //Skip entry as failed
        uSkip(1,2,lv_result);
    }
    return lv_result;
}
