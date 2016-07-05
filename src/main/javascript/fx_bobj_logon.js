/**
 * @param {string} iv_params - <pre>
 * iv_params := cms_host!!nameserver_port!!user!!password
 * </pre>
 * @return {string} - empty on success, or error message prefixed
 * with !ERROR
 * @requires fx_bobj_Session
 * @requires fx_JavaUtils
 * @see fx_bobj_Session#logon
 */
function fx_bobj_logon(iv_params)
{
    var SCRIPT = "fx_bobj_logon: ";
    var lv_result = "";
    try
    {
        fx_bobj_Session.logon(iv_params);
    }
    catch(lo_exception)
    {
        lv_result = fx_JavaUtils.handleException(SCRIPT, lo_exception);
    }
    return lv_result;
}
