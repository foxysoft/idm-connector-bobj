// Copyright 2017 Foxysoft GmbH
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
 * <div>Get SAP IDM schema version.</div>
 * @return {number} - schema version
 * @requires fx_trace
 */
var fx_getSchemaVersion = (function() {
    var SCRIPT = "fx_getSchemaVersion: ";
    var gv_schema_version = -1;

    function fx_getSchemaVersionImpl() {
        fx_trace(SCRIPT+"Entering");

        var lv_result = gv_schema_version;

        if(lv_result != -1)
        {
            fx_trace(SCRIPT+"Result from cache");
        }
        else
        {
            fx_trace(SCRIPT+"Result from database");
            try
            {
                var lo_exception = null;

                // Don't use string interpolation for ddm.identiycenter,
                // as it could contain double quotes and thus result
                // in JavaScript code injection
                var lv_jdbc_url = uGetConstant("ddm.identitycenter");

                var lo_connection
                        = java.sql.DriverManager.getConnection(
                            lv_jdbc_url
                        );
                fx_trace(SCRIPT
                         + "Opened connection"
                         + " lo_connection="+lo_connection);

                var lo_statement = lo_connection.prepareCall(
                    "{call mc_schemaversion(?)}"
                );
                fx_trace(SCRIPT
                         + "Prepared callable statement"
                         + " lo_statement="+lo_statement);

                lo_statement.registerOutParameter(
                    "Schemaversion"
                    ,java.sql.Types.INTEGER
                );
                fx_trace(SCRIPT
                         + "Registered OUT parameter"
                         + " @Schemaversion as datatype INT");

                lo_statement.execute();
                fx_trace(SCRIPT
                         + "Executed callable statement"
                         + " lo_statement="
                         + lo_statement);

                lv_result = lo_statement.getInt("Schemaversion");

                // Cache result for subsequent invocations
                gv_schema_version = lv_result;
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
            }//if(lo_connection != null)
        }//else

        fx_trace(SCRIPT+"Returning "+lv_result);
        return lv_result;

    }//fx_getSchemaVersionImpl

    return fx_getSchemaVersionImpl;

})();
