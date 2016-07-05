/**
 * @return {string} - the SQL query hint "with (nolock)", surrounded by
 * space, if running on MSSQL, otherwise an empty string.
 */
function fx_db_nolock()
{
    return "%$ddm.databasetype%" == "1" ? " with (nolock) " : "";
}
