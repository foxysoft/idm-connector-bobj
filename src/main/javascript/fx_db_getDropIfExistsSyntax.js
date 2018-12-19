// Copyright 2016 Foxysoft GmbH
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Get database-specific SQL syntax for dropping a table if it exists.
 * @param {string} iv_params - table name
 * @return {string} SQL statement
 * @requires fx_trace
 * @since 1.0.0
 */
function fx_db_getDropIfExistsSyntax(iv_params)
{
    var SCRIPT = "fx_db_getDropIfExistsSyntax: ";
    fx_trace(SCRIPT+"Entering iv_params="+iv_params);

    var lv_result;
    var lv_table_name = (""+iv_params).toUpperCase();
    var lv_database_type = "%$ddm.databasetype%";

    if(lv_database_type == "1") //MSS
    {
        lv_result
            = "IF object_id(N'"
            + lv_table_name
            + "') IS NOT NULL"
            + " DROP TABLE "
            + lv_table_name
            + ";"
        ;
    }
    else if(lv_database_type == "2") //ORA
    {
        lv_result
            = "DECLARE"
            + "    gv_count INTEGER;"
            + "    gv_table_name VARCHAR2(30) := '"+lv_table_name+"';"
            + " "
            + "BEGIN"
            + "    SELECT count(*) INTO gv_count"
            + "        FROM user_tables"
            + "        WHERE table_name = gv_table_name"
            + "    ;"
            + "    IF gv_count > 0 THEN"
            + "        EXECUTE IMMEDIATE 'DROP TABLE ' || gv_table_name;"
            + "    END IF;"
            + " "
            + "END;"
        ;
    }
    else if(lv_database_type == "5") //DB2
    {
        // Don't use the DB2 catalog to check for table existence,
        // as the catalog is platform dependent: at least DB/2 for LUW
        // and z/OS have a different catalog structure.
        // Use an empty handler for SQLSTATE 42704 (An undefined object
        // or constraint name was detected) instead. This should be the
        // most portable approach.
        lv_result
            = "BEGIN"
            + " "
            +" DECLARE CONTINUE HANDLER FOR SQLSTATE '42704'"
            + "    BEGIN"
            + "    END;"
            + " "
            + "EXECUTE IMMEDIATE 'DROP TABLE "+lv_table_name+ "';"
            + " "
            + "END"
        // As semicolon is the default statement terminator INSIDE
        // DB2 SQL PL, there must be no terminating semicolon
        // at the end of overall anonymous block
        ;
    }
    else if(lv_database_type == "9") //SYB
    {
        lv_result
            = "IF EXISTS ("
            + "SELECT 1 FROM SYSOBJECTS"
            + "    WHERE NAME='"+lv_table_name+"'"
            + "    AND TYPE='U'"
            + ") EXECUTE('DROP TABLE "+lv_table_name+"')"
        // Note that Sybase does NOT accept a terminating semicolon here.
        // The error that would occur otherwise is:
        // 
        // Error code 102 SQL state:42000(!)
        // com.sybase.jdbc4.jdbc.SybSQLException: Incorrect syntax near ';'
        ;
    }
    else
    {
        uWarning(SCRIPT+"Using unconditional drop"
                 + " for unsupported database type "
                 + lv_database_type
                 + "; expect errors on first execution");

        lv_result = "DROP TABLE "+lv_table_name;
    }

    fx_trace(SCRIPT+"Returning "+lv_result);
    return lv_result;
}
