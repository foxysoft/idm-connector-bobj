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

/* global fx_trace, fx_bobj_Session, fx_bobj_CeProperties */

/**
 * Read all available BOBJ entries of a given type during initial load.
 * @class
 * @requires fx_trace
 * @requires fx_bobj_Session
 * @requires fx_bobj_CeProperties
 */
var fx_bobj_EntryReader = (function() {
    /**
     * Iterator over info object collection returned from the BO CMS
     * in response to a query for all user objects submitted
     * by function read().
     *
     * @type {java.util.Iterator
     *        <com.crystaldecisions.sdk.occa.infostore.IInfoObject>}
     *
     * Initialized and cleaned up by function read().
     */
    var go_entries_iterator = null;

    var go_result = {

        /**
         * Retrieve next BOBJ entry, if any.
         * @function
         * @public
         * @name fx_bobj_EntryReader.read
         * @see fx_bobj_nextUserEntry
         * @see fx_bobj_nextGroupEntry
         * @param {string} iv_kind -
         *        Type of BOBJ entry to be retrieved,
         *        e.g. IUser.SI_KIND or IUserGroup.SI_KIND
         * @returns {com.sap.idm.ic.DSEEntry?} - IDM entry or null
         *          if no more entries of type iv_kind
         */
        read: function(iv_kind)
        {
            var SCRIPT = "fx_bobj_EntryReader=>read: ";
            fx_trace(SCRIPT+"Entering iv_kind="+iv_kind);

            var lo_dse_entry = null;
            if(go_entries_iterator == null)
            {
                fx_trace(SCRIPT
                         + "Initial invocation,"
                         + " retrieving entries from CMS");

                var lv_query
                        = "SELECT *"
                        + "    FROM CI_SYSTEMOBJECTS"
                        + "    WHERE SI_KIND = '" + iv_kind + "'"
                        + "    ORDER BY SI_NAME"
                ;
                fx_trace(SCRIPT+"lv_query="+lv_query);


                var lo_info_objects
                        = fx_bobj_Session.getInfoStore().query(lv_query)
                ;
                fx_trace(SCRIPT
                         + "Result set has "
                         + lo_info_objects.size()
                         + " entries");
                go_entries_iterator = lo_info_objects.iterator();

            }//if(go_entries_iterator == null)

            if(go_entries_iterator.hasNext())
            {
                fx_trace(SCRIPT+"Result set still has unprocessed entries");

                var lo_info_object = go_entries_iterator.next();
                var lv_si_name = lo_info_object.getTitle();

                lo_dse_entry = uNewEntry(lv_si_name);
                fx_trace(SCRIPT+"Processing "+lv_si_name);

                var lo_props = lo_info_object.properties();
                var lt_prop_ids = lo_props.keySet().toArray();
                for (var j = 0; j < lt_prop_ids.length; ++j)
                {
                    var lo_prop_id = lt_prop_ids[j];

                    var lv_is_exportable
                            = fx_bobj_CeProperties
                            .isExportable(lo_props, lo_prop_id)
                    ;

                    if (lv_is_exportable)
                    {
                        var lo_prop_name
                                = fx_bobj_CeProperties
                                .getName(lo_prop_id);

                        lo_dse_entry.put(
                            lo_prop_name
                            , fx_bobj_CeProperties
                                .getFormattedValue(lo_props, lo_prop_id)
                        );

                    }//if (lv_is_exportable)

                }// for (var j = 0; j < lt_prop_ids.length; ++j)

            }//if(go_entries_iterator.hasNext())
            else
            {
                fx_trace(SCRIPT+"All entries processed, cleaning up");
                go_entries_iterator = null;
            }

            fx_trace(SCRIPT+"Returning "+lo_dse_entry);
            return lo_dse_entry;

        }//read

    } //go_result
    ;

    return go_result;

})();
