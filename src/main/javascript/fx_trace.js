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
 * <div>Writes message to log if package/global constant FX_TRACE is 1.</div>
 * <div>The severity of the message is <strong>WARNING</strong>, so
 * it shows up in the log without any additional tweaks.</div>
 * <div>Since version 1.1.0, invoking this function with a JS object
 * containing a property "compat" set to the numeric value 1.0, will
 * return a compatibility API object.</div>
 * <div><br/><strong>The compatibility API is an internal feature which
 * customer code should never use. It will be removed in the 2.x
 * version of the BOBJ connector.</strong></div>
 * <div><br/>The API object has the following properties, each of which is
 * identical to the corresponding package (IDM 8.0) or global (IDM 7.2)
 * function with the same name:</div>
 * <ul>
 * <li>{@link fx_IDSID}</li>
 * <li>{@link fx_getSchemaVersion}</li>
 * <li>{@link fx_getConstant}</li>
 * </ul>
 * <div>The ability to obtain references to these new functions
 * from release 1.1.0 via fx_trace is provided for backward
 * compatibility of existing functions from 1.0.x. New functions
 * introduced in 1.1.x or later should always use the package/global
 * functions directly, and not rely on this feature.</div>
 * @param {string|object} iv_message - trace message or JS object
 * @return {string|object} iv_message or compatibility API object
 */
var fx_trace = (function() {

    /**
     * Indicates whether static class members have been initialized
     * or not. Each public method must first check this and call
     * class_init() if it's false. Set to true by class_init().
     */
    var gv_initialized = false;
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

            // Make sure to return a JS string, never a Java string
            var lv_result = "" + uGetConstant(lv_name);

            trace(SCRIPT+"uGetConstant("+lv_name+"): '"+lv_result+"'");

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

            // Replace $EMPTY with empty string to work around
            // NPE issues with empty package constants after
            // after transport.
            if(lv_result=="$EMPTY")
            {
                lv_result = "";
            }

            trace(SCRIPT+"Returning '"+lv_result+"'");
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

        gv_initialized = true;
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
        if(!gv_initialized)
        {
            class_init();
        }
        return io_argument["compat"] === 1.0
            ? go_compat_api
            : trace(io_argument)
        ;
    }

    // Static initialization at script load time has issues in SAP IDM.
    // Avoid it where possible, and use lazy initialization instead.
    // ===== DON'T TRY THIS =====
    // class_init()
    // ==========================
    return dispatch;
})();
