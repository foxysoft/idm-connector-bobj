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
 * Add random generated password to entry as FX_POLICY_PASSWORD
 * @see fx_generatePolicyPassword
 * @param {com.sap.idm.ic.DSEEntry} io_entry - IDM entry
 * @return {com.sap.idm.ic.DSEEntry} - io_entry or skips entry on failure
 * @requires fx_generatePolicyPassword
 */
function fx_entryAddPolicyPassword(io_entry)
{
    var lv_policy_password = fx_generatePolicyPassword();

    if(lv_policy_password.indexOf("!ERROR") == -1)
    {
        io_entry.put("FX_POLICY_PASSWORD", lv_policy_password);
    }
    else
    {
        //Skip entry as failed - this call doesn't return
        uSkip(1,2,lv_message);
    }

    return io_entry;
}
