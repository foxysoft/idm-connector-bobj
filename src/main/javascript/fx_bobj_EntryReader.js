/**
 * @class
 * @requires fx_bobj_trace
 * @requires fx_bobj_Session
 * @requires fx_bobj_CeProperties
 */
var fx_bobj_EntryReader = (function() {
    /**
     * Iterator over info object collection returned from the BO CMS
     * in response to a query for all user objects submitted
     * by function read_entries.
     *
     * @type {java.util.Iterator
     *        <com.crystaldecisions.sdk.occa.infostore.IInfoObject>}
     *
     * Initialized and cleaned up by function read_entries.
     */
    var go_entries_iterator = null;

    var go_result = {

        /**
         * Executes SQL query iv_query and returns all
         * corresponding entries from the CMS as DSE entry.
         *
         * @param {java.lang.String} iv_kind -
         *        Type of object to be retrieved,
         *        e.g. IUser.SI_KIND or IUserGroup.SI_KIND
         *
         * @return {com.sap.idm.ic.DSEEntry} -
         *         InfoObject of kind 'User' or 'UserGroup'
         *         retrieved from BO CMS and transformed
         *         into an IDM DSE entry.
         *         Returns null when all data has been read.
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