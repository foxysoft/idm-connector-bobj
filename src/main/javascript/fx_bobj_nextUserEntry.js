/**
 * Retrieves next BOBJ user, if any, during initial load.
 * @see fx_bobjEntryReader.read
 * @returns {com.sap.idm.ic.DSEEntry?} - IDM entry or null 
 *          if no more users
 * @requires fx_bobj_EntryReader
 */
function fx_bobj_nextUserEntry()
{
    importClass(Packages
                .com.crystaldecisions.sdk.plugin.desktop.user
                .IUser);

    return fx_bobj_EntryReader.read(IUser.KIND);
}
