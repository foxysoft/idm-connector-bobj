/** @class */
var fx_bobj_ReaderUtils = (function() {

    var go_result = {
        /**
         * Create a new DSE entry with properties SI_ID and SI_NAME obtained
         * from io_info_object, and an additional third property whose name
         * is supplied in io_key and whose value is supplied in io_value.
         * If io_key is null, no additional property is added.
         *
         * @param {com.crystaldecisions.sdk.occa.infostore.IInfoObject}
         *        io_info_object - BOBJ info object to obtain SI_ID
         *        and SI_NAME from
         *
         * @param {string} io_key - Property name, e.g. SI_GROUP_MEMBERS
         *        or SI_SUBGROUPS. May be null.
         *
         * @param {java.lang.Object} io_value - Propery value, e.g.
         *        numeric ID of group member (typcially a java.lang.Double)
         *
         *
         * @return {com.sap.idm.ic.DSEEntry} - Newly created DSE entry
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
