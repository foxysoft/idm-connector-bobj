/**
 * Writes a warning message for debugging purposes to the job log
 * if global constant FX_TRACE is set to 1.
 * 
 * @param {string} iv_message - trace message
 * @return {string} iv_message
 */
function fx_trace(iv_message)
{
    if("1" == "%$glb.FX_TRACE%")
    {
        uWarning(iv_message);
    }
    return iv_message;
}
