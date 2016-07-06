/**
 * @function
 * @param {com.sap.idm.ic.DSEEntry} io_entry
 * @return {string} empty on success, or error message prefix with !ERROR
 * @requires fx_trace
 * @requires fx_bobj_Session
 */
var fx_bobj_deleteUser = (function() {

    function fx_bobj_deleteUserImpl(io_entry)
    {
        var SCRIPT = "fx_bobj_deleteUser: ";
        fx_trace(SCRIPT+"Entering");

        var lv_result = "";

        var lo_si_name = io_entry.get("SI_NAME");
        if(lo_si_name == null)
        {
            throw new java.lang.Exception(
                "Missing mandatory parameter SI_NAME"
            );
        }

        var lo_si_kind = io_entry.get("SI_KIND");
        if(lo_si_kind == null)
        {
            throw new java.lang.Exception(
                "Missing mandatory parameter SI_KIND"
            );
        }
        var lo_to_delete_info_objects
                = fx_bobj_Session.lookupSingleInfoObject(
                    lo_si_name
                    ,lo_si_kind
                );

        var lo_to_delete_info_object
                = lo_to_delete_info_objects.get(0);
        fx_trace(SCRIPT
                 + "Have info object to delete? "
                 + (lo_to_delete_info_object != null));

        // Must use property syntax to invoke delete() method
        // of com.crystaldecisions.sdk.occa.infostore.IInfoObjects
        // as delete is a keyword in JavaScript
        lo_to_delete_info_objects["delete"](lo_to_delete_info_object);
        fx_trace(SCRIPT
                 + "Info object deleted in memory");

        fx_bobj_Session.getInfoStore().commit(lo_to_delete_info_objects)
        ;
        fx_trace(SCRIPT
                 + "Committed deletion of "
                 + lo_si_kind
                 + " "
                 + lo_si_name);

        fx_trace(SCRIPT+"Returning");
        return lv_result;

    }//fx_bobj_deleteUserImpl

    return fx_bobj_deleteUserImpl;

})();
