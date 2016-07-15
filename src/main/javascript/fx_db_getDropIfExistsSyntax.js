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
