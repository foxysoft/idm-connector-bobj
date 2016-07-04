/**
 * @requires fx_bobj_EntryReader
 * @see fx_bobjEntryReader#read
 */
function fx_bobj_nextGroupEntry()
{
    importClass(Packages
                .com.crystaldecisions.sdk.plugin.desktop.usergroup
                .IUserGroup);

    return fx_bobj_EntryReader.read(IUserGroup.KIND);
}
