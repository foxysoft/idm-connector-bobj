/**
 * @requires fx_bobj_EntryReader
 * @see fx_bobjEntryReader#read
 */
function fx_bobj_nextUserEntry()
{
    importClass(Packages
                .com.crystaldecisions.sdk.plugin.desktop.user
                .IUser);

    return fx_bobj_EntryReader.read(IUser.KIND);
}
