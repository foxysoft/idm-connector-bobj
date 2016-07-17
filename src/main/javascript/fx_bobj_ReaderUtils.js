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
 * Common functions for {@link fx_bobj_MemberReader} 
 * and {@link fx_bobj_AliasReader}
 * @class 
 */
var fx_bobj_ReaderUtils = (function() {

    var go_result = {
        /**
         * <div>Convert BOBJ InfoObject to SAP IDM entry in memory.</div>
         * <div>Properties SI_ID and SI_NAME are obtained from the supplied
         * io_info_object. An additional third property name and value
         * can optionally be supplied in io_key and io_value, respectively.
         * If io_key is non-null, the third property will be added to the new
         * IDM entry. Otherwise, no additional property is added.
         * @function
         * @public
         * @name fx_bobj_ReaderUtils.infoObjectToDseEntry
         *
         * @param {com.crystaldecisions.sdk.occa.infostore.IInfoObject}
         *        io_info_object - BOBJ info object to obtain SI_ID
         *        and SI_NAME from
         *
         * @param {string?} io_key - Property name, e.g. SI_GROUP_MEMBERS
         *        or SI_SUBGROUPS. May be null.
         *
         * @param {java.lang.Object?} io_value - Property value, e.g.
         *        numeric ID of group member (typcially a java.lang.Double).
         *        May be null.
         *
         * @return {com.sap.idm.ic.DSEEntry} - New SAP IDM entry
         */
        infoObjectToDseEntry: function(
            io_info_object
            ,io_key
            ,io_value
        )
        {
            var SCRIPT="fx_bobj_ReaderUtils=>infoObjectToDseEntry: ";
            fx_trace(SCRIPT
                     + "Entering (typeof io_info_object)="
                     + (typeof io_info_object)
                     + " ,io_key="
                     + io_key
                     + " ,io_value="
                     + io_value
                    );

            // Convert all incoming Java objects into JavaScript string.
            // Adding Java objects as values, specifically
            // Java.lang.Integer or java.lang.Double, to the newly
            // created DSE entry would later result in ClassCastException
            // when trying to write these values to the database, e.g.
            // in the destination of a fromGeneric pass.
            var lv_key         = io_key   != null ? "" + io_key   : null;
            var lv_value       = io_value != null ? "" + io_value : null;

            var lv_id          = "" + io_info_object.getID();
            var lv_name        = "" + io_info_object.getTitle();

            var lv_key_si_id
                    = ""
                    + fx_bobj_CeProperties.getName(CePropertyID.SI_ID)
            ;

            var lv_key_si_name
                    = ""
                    + fx_bobj_CeProperties.getName(CePropertyID.SI_NAME)
            ;

            var lo_dse_entry = uNewEntry(lv_name);

            lo_dse_entry.put(lv_key_si_id, lv_id);
            lo_dse_entry.put(lv_key_si_name, lv_name);

            // Optional: put user supplied key-value if key is not null
            if (lv_key != null)
            {
                lo_dse_entry.put(lv_key, lv_value);
            }

            fx_trace(SCRIPT+"Returning new DSE entry for "+lv_name);
            return lo_dse_entry;

        }//infoObjectToDseEntry

    } //go_result
    ;

    function class_init()
    {
        // Workaround "Packages is undefined"
        var lo_packages = (function(){return this["Packages"];}).call(null);
        if(lo_packages)
        {
            importClass(lo_packages
                        .com.crystaldecisions.sdk.occa.infostore
                        .CePropertyID);
        }//if(lo_packages)
    }//class_init

    class_init();
    return go_result;

})();
