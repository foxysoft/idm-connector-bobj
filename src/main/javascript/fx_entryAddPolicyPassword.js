/**
 * Generates a new password and adds it in cleartext to the DSE entry
 * io_entry using attribute name FX_POLICY_PASSWORD
 * @param {com.sap.idm.ic.DSEEntry} io_entry - DSE entry
 * @return {com.sap.idm.ic.DSEEntry} - io_entry
 * @requires fx_generatePolicyPassword
 */
function fx_entryAddPolicyPassword(io_entry)
{
    io_entry.put("FX_POLICY_PASSWORD", fx_generatePolicyPassword());
    return io_entry;
}
