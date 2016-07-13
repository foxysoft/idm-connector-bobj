/**
 * Retrieves next BOBJ group member, if any, during initial load.
 * @see fx_bobj_MemberReader.read
 * @returns {com.sap.idm.ic.DSEEntry?} - IDM entry or null if no more members
 * @requires fx_bobj_MemberReader
 */
function fx_bobj_nextMemberEntry()
{
    return fx_bobj_MemberReader.read();
}
