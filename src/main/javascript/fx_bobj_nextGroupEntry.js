/**
 * Retrieves next BOBJ group, if any, during initial load.
 * @see fx_bobj_EntryReader.read
 * @returns {com.sap.idm.ic.DSEEntry?} - IDM entry or null if no more groups
 * @requires fx_bobj_EntryReader
 */
function fx_bobj_nextGroupEntry()
{
    importClass(Packages
                .com.crystaldecisions.sdk.plugin.desktop.usergroup
                .IUserGroup);

    return fx_bobj_EntryReader.read(IUserGroup.KIND);
}
