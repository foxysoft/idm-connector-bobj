/**
 * Disconnects from the BOBJ Central Management Server (CMS).
 * @returns {string} - empty on success or !ERROR-prefixed message
 * @requires fx_bobj_Session
 * @requires fx_JavaUtils
 * @see fx_bobj_Session.logoff
 */
function fx_bobj_logoff()
{
    var SCRIPT = "fx_bobj_logoff: ";
    var lv_result = "";
    try
    {
        fx_bobj_Session.logoff();
    }
    catch(lo_exception)
    {
        lv_result = fx_JavaUtils.handleException(SCRIPT, lo_exception);
    }
    return lv_result;
}
