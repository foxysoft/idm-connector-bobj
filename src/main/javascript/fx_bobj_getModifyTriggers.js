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

/* global fx_trace, fx_getConstant */

/**
 * <div>Returns all attribute names with BOBJ modify triggers.</div>
 * <div>Returns the content of <strong>package constant
 * FX_BOBJ_MODIFY_TRIGGERS</strong> as a comma-separated list, with
 * each element surrounded by single quotes. If FX_BOBJ_MODIFY_TRIGGERS
 * is empty, returns these attribute names by default:</div>
 * <table>
 * <tr><td>MXREF_MX_GROUP</td></tr>
 * <tr><td>MXMEMBER_MX_GROUP</td></tr>
 * <tr><td>DISPLAYNAME</td></tr>
 * <tr><td>DESCRIPTION</td></tr>
 * <tr><td>MX_MAIL_PRIMARY</td></tr>
 * <tr><td>MX_DISABLED</td></tr>
 * <tr><td>MX_ENCRYPTED_PASSWORD</td></tr>
 * </table>
 * @requires fx_trace
 * @requires fx_getConstant
 */
function fx_bobj_getModifyTriggers()
{
    var SCRIPT = "fx_bobj_getModifyTriggers: ";
    fx_trace(SCRIPT+"Entering");

    var lv_triggers = fx_getConstant("pck.FX_BOBJ_MODIFY_TRIGGERS");

    if(lv_triggers == "")
    {
        fx_trace(SCRIPT
                 + "Package constant FX_BOBJ_MODIFY_TRIGGERS is empty,"
                 + " using default triggers");
        lv_triggers
            = "MXREF_MX_GROUP"
            + " MXMEMBER_MX_GROUP"
            + " DISPLAYNAME"
            + " DESCRIPTION"
            + " MX_MAIL_PRIMARY"
            + " MX_DISABLED"
            + " MX_ENCRYPTED_PASSWORD"
        ;
    }
    else
    {
        fx_trace(SCRIPT
                 +"Package constant FX_BOBJ_MODIFY_TRIGGERS is "
                 + lv_triggers);
    }

    var lt_matches;
    var lv_result = "";

    // Workaround: don't use literal regular expression syntax with
    // global flag and exec in Rhino. This will result in an infinite loop:
    //
    // while( (lt_matches = /\w+/g.exec(lv_triggers)) != null )
    //
    // Use the RegExp constructor with a string-based pattern instead.
    var lo_regexp = new RegExp("\\w+","g");
    while ( (lt_matches = lo_regexp.exec(lv_triggers)) != null )
    {
        if(lv_result.length>0)
        {
            lv_result += ",";
        }
        fx_trace(SCRIPT+"lt_matches[0]="+lt_matches[0]);
        lv_result += "'" + lt_matches[0] + "'";
    }

    fx_trace(SCRIPT+"Returning "+lv_result);
    return lv_result;
}
