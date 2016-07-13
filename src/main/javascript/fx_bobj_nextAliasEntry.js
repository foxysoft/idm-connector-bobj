/**
 * Retrieves next BOBJ user or group alias, if any, during initial load.
 * @see fx_bobj_AliasReader.read
 * @returns {com.sap.idm.ic.DSEEntry?} - IDM entry or null if no more aliases
 * @requires fx_bobj_AliasReader
 */
function fx_bobj_nextAliasEntry()
{
    return fx_bobj_AliasReader.read();
}
