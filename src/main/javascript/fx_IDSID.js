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

/* global fx_getSchemaVersion, fx_db_nolock, fx_trace */

/**
 * <div>Returns the main (SAP Master) Identity Store's ID.</div>
 * <div>If $IDSID is non-empty and not -1, returns that. Otherwise,
 * obtains the Identity Store ID of the package that this script
 * belongs to using a database lookup. If the script has been imported
 * into multiple Identity Stores, the ID with the minimum value will
 * be returned.</div>
 * @return {string} IDSID
 * @requires fx_getSchemaVersion
 * @requires fx_db_nolock
 * @requires fx_trace
 */
var fx_IDSID = (function() {

    var SCRIPT = "fx_IDSID: ";
    var gv_idsid = -1;

    function fx_IDSIDImpl()
    {
        fx_trace(SCRIPT+"Entering");

        var lv_idsid = gv_idsid;

        if(lv_idsid != -1)
        {
            fx_trace(SCRIPT+"Result from cache");
        }
        else
        {
            if(fx_getSchemaVersion() >= 1528)
            {
                fx_trace(SCRIPT+"Using IDSID on version 8.x");
                lv_idsid = "%$IDSID%";

                if(lv_idsid == "" || lv_idsid == "-1") {
                    fx_trace(SCRIPT+"$IDSID="+lv_idsid+", need DB lookup");

                    // Note that it's possible to have scripts with the same
                    // name in multiple Identity Stores.
                    var lv_sql
                            = "select min(mcidstore)"
                            + "    from mc_package_scripts s"
			    + " " + fx_db_nolock()
                            + "    inner join mc_package p"
			    + " " + fx_db_nolock()
                            + "    on s.mcpackageid=p.mcpackageid"
                            + "    where mcscriptname='fx_IDSID'"
                            + "    group by mcscriptname"
                    ;
                    fx_trace(SCRIPT+"lv_sql="+lv_sql);

                    lv_idsid = uSelect(lv_sql);
                }
                // Cache result for subsequent invocations
                gv_idsid = lv_idsid;
            }
            else
            {
                fx_trace(SCRIPT+"Using SAP_MASTER_IDS_ID on version 7.x");
                lv_idsid = uGetConstant("glb.SAP_MASTER_IDS_ID");
            }
        }//else

        fx_trace(SCRIPT+"Returning "+lv_idsid);
        return lv_idsid;
    }//fx_IDSIDImpl

    return fx_IDSIDImpl;

})();
