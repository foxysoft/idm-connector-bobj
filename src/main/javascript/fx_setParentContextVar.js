/**
 * Set a context variable for the parent audit of the current audit
 * and returns the value of that context variable.
 * Can only be used in provisioning tasks.
 *
 * This function internally calls stored procedure MXP_XSET_CONTEXT_VAR
 * via JDBC. For the details of calling a stored procedure with
 * output parameters via JDBC on MS SQL Server, see the documentation
 * at https://msdn.microsoft.com/en-us/library/ms378108.aspx
 *
 * @param {string} iv_params - <pre>
 *     iv_params := var_name!!var_value
 * </pre>
 * @return {string} - var_value
 * @requires fx_trace
 * @requires fx_db_nolock
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

                var lo_connection
                        = java.sql.DriverManager.getConnection(
                            "%$ddm.identitycenter%"
                        );
                fx_trace(SCRIPT
                         + "Opened connection"
                         + " lo_connection="+lo_connection);

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
                lo_connection.close();
                fx_trace(SCRIPT+"Connection closed");
            }
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
