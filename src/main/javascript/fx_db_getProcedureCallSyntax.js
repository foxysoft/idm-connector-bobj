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
 * Get the database-specific SQL syntax for calling a stored procedure.
 * @param {string} iv_params - <pre>
 * iv_params      := procedure_name[!!procedure_args]
 * procedure_args := single_arg[,single_arg...]
 * single_arg     := char_like_arg|other_arg
 * char_like_arg  := 'value'
 * other_arg      := value
 * </pre>
 * procedure_args is a comma-separated list of arguments to pass
 * to the stored procedure. This list may be empty.
 * Char-like arguments need to be surrounded by single quotes.
 * @return {string} SQL statement
 * @requires fx_trace
 * @since 1.0.0
 */
function fx_db_getProcedureCallSyntax(iv_params)
{
    var SCRIPT = "fx_db_getProcedureCallSyntax: ";
    fx_trace(SCRIPT+"Entering iv_params="+iv_params);

    var lt_params = (""+iv_params).split("!!");
    var lv_procedure_name = lt_params.shift();
    var lv_procedure_args = lt_params.join("!!");

    var lv_result
            = "%$ddm.databasetype%" == "1" //MSSQL
            ? ( "execute " + lv_procedure_name + " " + lv_procedure_args )
            : ( "call " + lv_procedure_name + " (" + lv_procedure_args + ")" )
    ;
    fx_trace(SCRIPT+"Returning "+lv_result);
    return lv_result;
}
