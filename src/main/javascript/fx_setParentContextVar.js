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

/* global fx_trace */

/**
 * <div>Set context variable in parent of current audit.</div>
 * <div>Can only be used in provisioning tasks. This function internally
 * calls stored procedure MXP_XSET_CONTEXT_VAR via JDBC.</div>
 * @see fx_setContextVar
 * @param {string} iv_params - <pre>
 *     iv_params := var_name!!var_value
 * </pre>
 * @return {string} - var_value
 * @requires fx_trace
 * @requires fx_db_nolock
 * @since 1.0.0
 */
function fx_setParentContextVar(iv_params)
{
    var SCRIPT = "fx_setParentContextVar: ";
    fx_trace(SCRIPT+"Entering iv_params="+iv_params);

    var lt_params = (""+iv_params).split("!!");
    var lv_var_name = lt_params.shift();
    var lv_var_value = lt_params.join("!!");

    var lv_current_audit_id = uGetAuditID();

    // Note that mxpv_audit doesn't have the refaudit column,
    // so selecting from the base table mxp_audit is required.
    var lv_sql
            = "select"
            + "    refaudit"
            + "    from mxp_audit" + fx_db_nolock()
            + "    where auditid=" + lv_current_audit_id
    ;
    fx_trace(SCRIPT+"lv_sql="+lv_sql);

    var lv_sql_result = uSelect(
        lv_sql
        /*,RowSeparator*/
        /*,ColumnSeparator*/
    );

    if(lv_sql_result.indexOf("!ERROR") == -1)
    {
        fx_trace(SCRIPT+"lv_sql_result="+lv_sql_result);
        if(lv_sql_result != "" && lv_sql_result.toUpperCase() != "NULL")
        {
            try
            {
                var lv_parent_audit_id = lv_sql_result;
                lv_sql_result = null;

                var lo_exception = null;

                // Don't use string interpolation for ddm.identiycenter,
                // as it could contain double quotes and thus result
                // in JavaScript code injection
                var lv_jdbc_url = uGetConstant("ddm.identitycenter");

                var lo_connection
                        = fx_trace({compat: 1.0}).fx_getJdbcConnection(
                            lv_jdbc_url
                        );
                fx_trace(SCRIPT
                         + "Opened connection"
                         + " lo_connection="+lo_connection);

                // Auto commit is typically on on ORA and DB2;
                // turn it off to avoid unwanted side-effects
                var lv_auto_commit = lo_connection.getAutoCommit();

                var lv_database_type = "%$ddm.databasetype%";

                if(lv_database_type == "2" // ORA
                   || lv_database_type == "5" //DB2
                  )
                {
                    fx_trace(SCRIPT+"Disabling autocommit");
                    lo_connection.setAutoCommit(false);
                }

                var lo_statement = lo_connection.prepareCall(
                    "{call mxp_xset_context_var(?,?,?,?,?)}"
                );
                fx_trace(SCRIPT
                         + "Prepared callable statement"
                         + " lo_statement="+lo_statement);

                lo_statement.setInt("Pauditid", lv_parent_audit_id);
                fx_trace(SCRIPT
                         + "Supplied INT parameter @Pauditid="
                         + lv_parent_audit_id);

                lo_statement.setString("Pkey", lv_var_name);
                fx_trace(SCRIPT
                         + "Supplied VARCHAR parameter @Pkey="
                         + lv_var_name);

                lo_statement.setString("Pvalue", lv_var_value);
                fx_trace(SCRIPT
                         + "Supplied NVARCHAR parameter @Pvalue="
                         + lv_var_value);

                lo_statement.setInt("Pinternal", 0);
                fx_trace(SCRIPT+"Supplied INT parameter @Pinternal=0");

                lo_statement.registerOutParameter(
                    "Perr"
                    ,java.sql.Types.INTEGER
                );
                fx_trace(SCRIPT
                         + "Registered OUT parameter"
                         + " @Perr as datatype INT");

                lo_statement.execute();
                fx_trace(SCRIPT
                         + "Executed callable statement"
                         + " lo_statement="
                         + lo_statement);

                lv_sql_result = lo_statement.getInt("Perr");

                if(lv_sql_result != 0)
                {
                    uError(SCRIPT+"call mxp_xset_context_var("
                           + lv_parent_audit_id
                           + ",'"+lv_var_name+"'"
                           + ",'"+lv_var_value+"'"
                           + ",0"
                           +",@Perr OUTPUT): @Perr="
                           + lv_sql_result
                          );
                }
                else
                {
                    fx_trace(SCRIPT+"@Perr="+lv_sql_result);
                }

            }//try
            catch(lo_exception)
            {
                var lo_string_writer
                        = new java.io.StringWriter();

                var lo_print_writer
                        = new java.io.PrintWriter(lo_string_writer);

                lo_exception.printStackTrace(lo_print_writer);

                var lv_stacktrace = lo_string_writer.toString();
                uError(SCRIPT+lv_stacktrace);
            }

            if(lo_statement != null)
            {
                lo_statement.close();
                fx_trace(SCRIPT+"Statement closed");
            }
            if(lo_connection != null)
            {
                // Always commit/rollback explicitly,
                // even where we're in auto-commit mode
                try
                {
                    if(lo_exception == null)
                    {
                        lo_connection.commit();
                        fx_trace(SCRIPT+"Connection committed");
                    }
                    else
                    {
                        lo_connection.rollback();
                        fx_trace(SCRIPT+"Connection rolled back");
                    }
                }//try
                catch(lo_inner_ex)
                {
                    uError(SCRIPT+lo_inner_ex);
                }

                // Restore auto-commit to original state
                lo_connection.setAutoCommit(lv_auto_commit);

                lo_connection.close();
                fx_trace(SCRIPT+"Connection closed");

            }//if(lo_connection != null)
        }// if(lv_sql_result != ""
        //     && lv_sql_result.toUpperCase() != "NULL")
        else
        {
            uWarning(SCRIPT
                     + "Current audit "
                     + lv_current_audit_id
                     + " doesn't exist or doesn't have any parent;"
                     + " lv_parent_audit_id="
                     + lv_parent_audit_id);
        }
    }//if(lv_sql_result.indexOf("!ERROR") == -1)
    else
    {
        uError(SCRIPT+"uSelect("+lv_sql+"): "+lv_sql_result);
    }

    fx_trace(SCRIPT+"Returning "+lv_var_value);
    return lv_var_value;
}
