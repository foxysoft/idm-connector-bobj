/**
 * Add random generated password to entry as FX_POLICY_PASSWORD
 * @see fx_generatePolicyPassword
 * @param {com.sap.idm.ic.DSEEntry} io_entry - IDM entry
 * @return {com.sap.idm.ic.DSEEntry} - io_entry or skips entry on failure
 * @requires fx_generatePolicyPassword
 */
function fx_entryAddPolicyPassword(io_entry)
{
    var lv_policy_password = fx_generatePolicyPassword();

    if(lv_policy_password.indexOf("!ERROR") == -1)
    {
        io_entry.put("FX_POLICY_PASSWORD", lv_policy_password);
    }
    else
    {
        //Skip entry as failed - this call doesn't return
        uSkip(1,2,lv_message);
    }

    return io_entry;
}
