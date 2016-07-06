/**
 * Get attribute value for entry using uIS_GetValue()
 * @param {string} iv_params -<pre>
 * iv_params := attr_name!!mskey[!!default_value]
 * </pre>
 * <div>
 * If iv_params contains the separator sequence !! at least
 * two times, default_value is considered as <strong>supplied</strong>,
 * even if it's an empty string.
 * </div>
 * <div>
 * If iv_params contains only one occurence of !!, default_value
 * is considered as <string>not supplied</strong>.
 * </div>
 * @return {string}
 * <div>
 * If MSKEY is <strong>not empty</strong>: if mskey has a value for
 * attr_name, return that. If it has no value and default_value has
 * been supplied, return default_value. Otherwise return NULLATTR and
 * write the error message returned by uIS_GetValue() to the log.
 * </div>
 * <div>
 * If MSKEY is <strong>empty</strong>: return default_value if supplied,
 * otherwise empty string.
 * </div>
 * @requires fx_trace
 */
function fx_getAttributeByMskey(iv_params)
{
    var SCRIPT = "fx_getAttributeByMskey: ";
    fx_trace(SCRIPT + "iv_params="+iv_params);

    var lt_params        = ("" + iv_params).split("!!");
    var lv_attrname      = lt_params.shift();
    var lv_mskey         = lt_params.shift();
    var lv_default_value
            = lt_params.length > 0
            ? lt_params.join("!!")
            : null
    ;
    var lv_result;

    if(lv_mskey != "")
    {
        lv_result = uIS_GetValue(
            lv_mskey
            ,uGetIDStore()
            ,lv_attrname
        );
        if(lv_result.indexOf("!ERROR") != -1)
        {
            if(lv_default_value == null)
            {
                fx_trace(SCRIPT
                         + "No default value supplied, logging error");
                uError(SCRIPT+lv_result);

                lv_result = "NULLATTR";
            }
            else
            {
                fx_trace(SCRIPT
                         + "Default value supplied, ignoring error: "
                         + lv_result);
                // This assumes the error is !ERROR: no such attribute
                lv_result = lv_default_value;
            }
        }//if(lv_result.indexOf("!ERROR") != -1)
    }//if(lv_mskey != "")
    else
    {
        fx_trace(SCRIPT+"No MSKEY supplied");
        if(lv_default_value != null)
        {
            fx_trace(SCRIPT+"Default value supplied, will return that");
            lv_result = lv_default_value;
        }
        else
        {
            fx_trace(SCRIPT+"No default value supplied, will return empty");
            lv_result = "";
        }
    }

    fx_trace(SCRIPT + "Returning " + lv_result);
    return lv_result;
}
