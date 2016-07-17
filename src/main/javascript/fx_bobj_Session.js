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
 * Connect/disconnect to BOBJ CMS and access InfoStore service
 * @class 
 */
var fx_bobj_Session = (function () {
    /**
     * Session object from which service referenes can be obtained.
     * Initialized by logon(), cleaned up by logoff().
     * @type {com.crystaldecisions.sdk.framework.IEnterpriseSession}
     */
    var go_session = null;

    /**
     * InfoStore service which can be used to execute queries,
     * create, modify and delete info objects.
     * Initialized by logon(), cleaned up by logoff().
     * @type {com.crystaldecisions.sdk.occa.infostore.IInfoStore}
     */
    var go_info_store = null;

    /**
     * @private
     * @param {string?} iv_value - any string
     * @param {string} iv_repo_const_name - repository constant name
     * @return {string} - if iv_value is defined and not null,
     * returns iv_value, otherwise returns value of the repository
     * constant retrieved using uGetConstant().
     */
    function getValueOrRepoConst(iv_value, iv_repo_const_name)
    {
        return (typeof iv_value != "undefined" && iv_value != null)
            ? iv_value
            : uGetConstant("rep."+iv_repo_const_name)
        ;
    }

    var go_result = {

        /**
         * <div>Logon to BOBJ CMS (Central Management Server).</div>
         * <div>All parameters are optional and will be defaulted
         * from the respective constants of the current repository
         * if supplied as null or undefined.</div>
         * @function
         * @public
         * @name fx_bobj_Session.logon
         *
         * @param {string} [iv_host] - CMS host name or IP address
         * @param {string} [iv_port] - Name server port
         * @param {string} [iv_login] - User name for login
         * @param {string} [iv_password] - Password for login
         * @throws {java.lang.Exception} - in case of errors
         */
        logon: function(iv_host, iv_port, iv_login, iv_password)
        {
            var SCRIPT = "fx_bobj_Session=>logon: ";
            fx_trace(SCRIPT+"Entering");

            var lv_host = getValueOrRepoConst(iv_host, "HOST");
            var lv_port = getValueOrRepoConst(iv_port, "PORT");
            var lv_login = getValueOrRepoConst(iv_login, "LOGIN");
            var lv_password = getValueOrRepoConst(iv_password, "PASSWORD");

            var lv_cms = lv_host+":"+lv_port;
            fx_trace(SCRIPT+"Logging on as "+lv_login+" to "+lv_cms);

            var lo_session_manager
                    = CrystalEnterprise.getSessionMgr()
            ;

            var lv_start_millis = java.lang.System.currentTimeMillis();

            go_session = lo_session_manager.logon(
                lv_login
                , lv_password
                , lv_cms
                , "secEnterprise"
            );

            var lv_end_millis = java.lang.System.currentTimeMillis();
            fx_trace(SCRIPT
                     + "Logon took "
                     + ( (lv_end_millis - lv_start_millis) / 1000 )
                     + " seconds");

            go_info_store = go_session.getService("InfoStore");

            fx_trace(SCRIPT+"Returning");
        },//logon

        /**
         * <div>Log off from BOBJ CMS (Central Management Server).</div>
         * <div>If no active session exists when this method is called,
         * it just returns silently without any error.</div>
         * @function
         * @public
         * @name fx_bobj_Session.logoff
         * @throws {java.lang.Exception} - in case of errors
         */
        logoff: function()
        {
            var SCRIPT = "fx_bobj_session=>logoff: ";
            fx_trace(SCRIPT+"Entering");
            var lo_exception = null;

            if(go_session != null)
            {
                fx_trace(SCRIPT+"Active session exists");
                try
                {
                    go_session.logoff();
                    fx_trace(SCRIPT+"Closed session successfully");
                }
                catch(lo_exception)
                {
                    //empty OK
                }

                // BEGIN finally block
                go_session    = null;
                go_info_store = null;
                // END finally block

                if(lo_exception != null)
                {
                    throw lo_exception;
                }
            }
            else
            {
                fx_trace(SCRIPT+"No active session => nothing to do");
            }

            fx_trace(SCRIPT+"Returning");
        },//logoff

        /**
         * Get the current session's info store, if any.
         * @function
         * @public
         * @name fx_bobj_Session.getInfoStore
         * @throws {java.lang.Exception} - if there's no active session
         */
        getInfoStore: function()
        {
            if(go_info_store == null)
            {
                throw new java.lang.Exception("Not connected");
            }
            return go_info_store;
        },//getInfoStore

        /**
         * Retrieve InfoObject by name and kind from InfoStore service.
         * @function
         * @public
         * @name fx_bobj_Session.lookupSingleInfoObject
         *
         * @param {string} iv_name - SI_NAME of InfoObject
         * @param {string} iv_kind - SI_KIND of InfoObject
         * @param {string} [iv_additional_props] - comma-separated
         * list of additional attribute names to populate in the
         * InfoObject collection that will be returned. May be NULL.
         * @throws {java.lang.Exception} - If there's no active
         * session, or if no InfoObject exists with SI_NAME=iv_name
         * and SI_KIND=iv_kind, or if more than one InfoObject matching
         * these criteria exists.
         */
        lookupSingleInfoObject: function(
            iv_name
            ,iv_kind
            ,iv_additional_props
        )
        {
            var SCRIPT = "fx_bobj_Session=>lookupSingleInfoObject: ";

            if(go_info_store == null)
            {
                throw new java.lang.Exception("Not connected");
            }

            var lv_query
                    = "select"
                    + " SI_ID"
                    + ( iv_additional_props != null
                        ? ("," + iv_additional_props)
                        : ""
                      )
                    + " from CI_SYSTEMOBJECTS"
                    + " where SI_NAME='" + iv_name+ "'"
                    + " and SI_KIND='" + iv_kind + "'"
            ;
            fx_trace(SCRIPT + "lv_query=" + lv_query);

            // IInfoObjects
            var lo_info_objects = go_info_store.query(lv_query);
            fx_trace(SCRIPT + "Result count: " + lo_info_objects.size());

            var lv_message;

            if(lo_info_objects.size() == 1)
            {
                lv_message = null; //OK
            }
            else if (lo_info_objects.size() == 0)
            {
                lv_message
                    = "InfoObject with name " + iv_name
                    + " and kind " + iv_kind
                    + " does not exist"
                ;
            }
            else //if (lo_info_objects.size() > 1)
            {
                lv_message
                    = "Multiple InfoObjects exist with name " + iv_name
                    + " and kind " + iv_kind
                    + " (" + lo_info_objects.size() + ")"
                ;
            }

            if(lv_message != null)
            {
                for (var i=0; i<lo_info_objects.size(); ++i)
                {
                    uError(SCRIPT + lo_info_objects.get(i));
                }
                throw new java.lang.Exception(lv_message);
            }

            return lo_info_objects;

        }//lookupSingleInfoObject

    }//go_result
    ;

    function class_init()
    {
        // Workaround "Packages is undefined"
        var lo_packages = (function(){return this["Packages"];}).call(null);
        if(lo_packages)
        {
            importClass(lo_packages
                        .com.crystaldecisions.sdk.framework
                        .CrystalEnterprise);
        }//if(lo_packages)
    }//class_init

    class_init();
    return go_result;

})();
