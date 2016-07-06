/**
 * @param {string} iv_params - <pre>
 *     iv_params := var_name[!!default_value]
 * </pre>
 * @return {string} - value of context variable named var_name,
 *         or default_value if no such context variable exists
 * @requires fx_trace
 */
function fx_getContextVar(iv_params)
{
    var SCRIPT = "fx_getContextVar: ";
    fx_trace(SCRIPT+"Entering iv_params="+iv_params);

    var lt_params = ("" + iv_params).split("!!");
    var lv_var_name = lt_params[0];
    var lv_default_value = lt_params.length > 1 ? lt_params[1] : "";

    var lv_result = uGetContextVar(
        lv_var_name
        ,lv_default_value
    );

    fx_trace(SCRIPT+"Returning "+lv_result);
    return lv_result;
}
