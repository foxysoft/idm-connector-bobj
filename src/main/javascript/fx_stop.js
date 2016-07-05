/**
 * Stops executing the job after it has processed the current entry
 * by calling internal function uStop().
 * @param {string} iv_message - Supposed to be written to the job log,
 *        but seems to be ignored by uStop() in SAP IDM 7.2
 * @return {string} iv_message
 */
function fx_stop(iv_message)
{
    uStop(iv_message);
    return iv_message;
}
