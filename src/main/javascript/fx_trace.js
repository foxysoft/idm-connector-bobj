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
 * <div>Writes message to log if package constant FX_TRACE is 1.</div>
 * <div>The severity of the message is <strong>WARNING</strong>, so
 * it shows up in the log without any additional tweaks.</div>
 * @param {string} iv_message - trace message
 * @return {string} iv_message
 */
var fx_trace = (function() {

    var gv_is_idm8 = false;
    var trace = traceOff;

    var go_compat_api = {
        fx_IDSID: function() {

            var SCRIPT = "fx_IDSID: ";
            trace(SCRIPT+"Entering");

            var lv_idsid;

            if(gv_is_idm8)
            {
                trace(SCRIPT+"Using $IDSID on version 8.x");
                lv_idsid = "%$IDSID%";

                if(lv_idsid == "" || lv_idsid == "-1")
                {
                    trace(SCRIPT
                          + "$IDSID=" + lv_idsid
                          + ", need DB lookup");

                    var lv_sql
                            = "select min(is_id) from mxi_idstores"
                    ;
                    if("%$ddm.databasetype%" == "1")
                    {
                        // We can't have a dependency to fx_db_nolock here
                        lv_sql += " with (nolock)";
                    }

                    trace(SCRIPT+"lv_sql="+lv_sql);

                    lv_idsid = uSelect(lv_sql);

                }//if(lv_idsid == "" || lv_idsid == "-1")

            }//if(gv_is_idm8)
            else
            {
                trace(SCRIPT+"Using SAP_MASTER_IDS_ID on IDM 7.x");
                lv_idsid = uGetConstant("glb.SAP_MASTER_IDS_ID");
            }

            trace(SCRIPT+"Returning "+lv_idsid);
            return lv_idsid;
        }//fx_IDSID

        ,fx_getSchemaVersion: function()
        {
            var SCRIPT = "fx_getSchemaVersion: ";
            trace(SCRIPT+"Entering");

            var lv_result = -1;
            try
            {
                var lo_exception = null;

                // Don't use string interpolation
                // for ddm.identiycenter,
                // as it could contain double quotes and thus
                // result in JavaScript code injection
                var lv_jdbc_url = uGetConstant("ddm.identitycenter");

                var lo_connection
                        = java.sql.DriverManager.getConnection(
                            lv_jdbc_url
                        );
                trace(SCRIPT
                      + "Opened connection"
                      + " lo_connection="+lo_connection);

                var lo_statement = lo_connection.prepareCall(
                    "{call mc_schemaversion(?)}"
                );
                trace(SCRIPT
                      + "Prepared callable statement"
                      + " lo_statement="+lo_statement);

                lo_statement.registerOutParameter(
                    "Schemaversion"
                    ,java.sql.Types.INTEGER
                );
                trace(SCRIPT
                      + "Registered OUT parameter"
                      + " @Schemaversion as datatype INT");

                lo_statement.execute();
                trace(SCRIPT
                      + "Executed callable statement"
                      + " lo_statement="
                      + lo_statement);

                lv_result = lo_statement.getInt("Schemaversion");

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
                trace(SCRIPT+"Statement closed");
            }
            if(lo_connection != null)
            {
                lo_connection.close();
                trace(SCRIPT+"Connection closed");
            }//if(lo_connection != null)

            trace(SCRIPT+"Returning "+lv_result);
            return lv_result;

        }//fx_getSchemaVersion

        ,fx_getConstant: function(iv_name)
        {

            var SCRIPT = "fx_getConstant: ";
            trace(SCRIPT+"Entering iv_name="+iv_name);

            var lv_name = ""+iv_name;

            if(!gv_is_idm8 && lv_name.indexOf("pck.") == 0)
            {
                lv_name = "glb."+lv_name.substring(4);
                trace(SCRIPT+"Adjusted lv_name="+lv_name+" for IDM 7.x");
            }

            var lv_result = uGetConstant(lv_name);

            if(lv_name.indexOf("pck.") == 0)
            {
                if(lv_result == "-undefined-")
                {
                    trace(SCRIPT
                          + "Fixing corrupt package constant value "
                          + lv_result);
                    lv_result = "";
                }
            }

            trace(SCRIPT+"Returning "+lv_result);
            return lv_result;

        }//fx_getConstant
    };

    function class_init()
    {
        gv_is_idm8 = go_compat_api.fx_getSchemaVersion() >= 1528;

        trace = go_compat_api.fx_getConstant("pck.FX_TRACE") == "1"
            ? traceOn
            : traceOff
        ;
    }

    function traceOff(iv_message)
    {
        return iv_message;
    }

    function traceOn(iv_message)
    {
        uWarning(iv_message);
        return iv_message;
    }

    function dispatch(io_argument)
    {
        return io_argument["compat"] === 1.0
            ? go_compat_api
            : trace(io_argument)
        ;
    }

    class_init();
    return dispatch;
})();
