/**
 * <div>Writes message to log if global constant FX_TRACE is 1.</div>
 * <div>The severity of the message is <strong>WARNING</strong>, so
 * it shows up in the log without any additional tweaks.</div>
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
