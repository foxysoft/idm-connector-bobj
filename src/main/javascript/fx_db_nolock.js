/**
 * Get database-specific SQL query hint for transaction isolation level.
 * @return {string} - On MSS, returns <pre>with (nolock)</pre>, surrounded by
 * space. On other databases, returns empty string.
 */
function fx_db_nolock()
{
    return "%$ddm.databasetype%" == "1" ? " with (nolock) " : "";
}
