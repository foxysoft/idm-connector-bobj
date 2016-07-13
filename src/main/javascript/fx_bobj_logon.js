/**
 * Function wrapper for {@link fx_bobj_Session.logon} which
 * handles any exceptions thrown by the class method.
 * @param {string?} iv_params - <pre>
 * iv_params := [host[!!port[!!login[!!password]]]]
 * </pre>
 * Parameters will be defaulted from the respective constants
 * of the current repository if not supplied or null.
 * @return {string} - empty on success, or error message prefixed
 * with !ERROR in case of exception
 * @requires fx_bobj_Session
 * @requires fx_JavaUtils
 * @see fx_bobj_Session#logon
 */
function fx_bobj_logon(iv_params)
{
    var SCRIPT = "fx_bobj_logon: ";
    var lv_result = "";

    if(iv_params != null && typeof iv_params != "undefined")
    {
        var lt_params = (""+iv_params).split("!!");
        var lv_host     = lt_params.length > 0 ? lt_params[0] : null;
        var lv_port     = lt_params.length > 1 ? lt_params[1] : null;
        var lv_login    = lt_params.length > 2 ? lt_params[2] : null;
        var lv_password = lt_params.length > 3 ? lt_params[3] : null;
    }
    try
    {
        fx_bobj_Session.logon(
            lv_host
            ,lv_port
            ,lv_login
            ,lv_password
        );
    }
    catch(lo_exception)
    {
        lv_result = fx_JavaUtils.handleException(SCRIPT, lo_exception);
    }
    return lv_result;
}
