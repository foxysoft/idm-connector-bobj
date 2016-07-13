/**
 * Removes/deletes a BOBJ user.
 * @see fx_bobj_User.remove
 * @param {com.sap.idm.ic.DSEEntry} io_entry - IDM entry
 * @return {string} - empty on success or skips entry on failure
 * @requires fx_bobj_User
 * @requires fx_JavaUtils
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
