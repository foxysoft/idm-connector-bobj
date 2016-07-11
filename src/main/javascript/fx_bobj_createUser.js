/**
 * @param {com.sap.idm.ic.DSEEntry} io_entry - DSE entry
 * @return {string} - empty on success, or error message prefixed
 *         with !ERROR on failure
 * @requires fx_bobj_User
 */
function fx_bobj_createUser(io_entry)
{
    return fx_bobj_User.create(io_entry);
}
