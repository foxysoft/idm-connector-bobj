/**
 * Modify a BOBJ group by adding/removing user members
 * @see {@link fx_bobj_Group.modifyMembers}
 * @param {com.sap.idm.ic.DSEEntry} - IDM entry
 * @return {string} - empty on success or skips entry on failure
 * @requires fx_bobj_Group
 * @requires fx_JavaUtils
 */
function fx_bobj_modifyGroupMembers(io_entry)
{
    var SCRIPT = "fx_bobj_modifyGroupMembers: ";
    var lv_result = "";
    var lo_exception;
    try
    {
        fx_bobj_Group.modifyMembers(io_entry);
    }
    catch(lo_exception)
    {
        lv_result = fx_JavaUtils.handleException(SCRIPT, lo_exception);

        //Skip entry as failed
        uSkip(1,2,lv_result);
    }
    return lv_result;
}
