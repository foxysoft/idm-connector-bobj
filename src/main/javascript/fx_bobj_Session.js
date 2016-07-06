/** @class */
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

    var go_result = {

        /**
         * Connect to the BO CMS (Central Management Server)
         * using the supplied host, port, user and password.
         * @param {string} iv_params - <pre>
         * iv_params := cms_host!!nameserver_port!!user!!password
         * </pre>
         * @throws {java.lang.Exception} - if logon fails
         */
        logon: function(iv_params)
        {
            var SCRIPT = "fx_bobj_Session=>logon: ";
            fx_trace(SCRIPT+"Entering iv_params="+iv_params);
            var lt_params = (""+iv_params).split("!!");

            var lv_host     = lt_params.shift();
            var lv_port     = lt_params.shift();
            var lv_user     = lt_params.shift();
            var lv_password = lt_params.join("!!");

            var lo_session_manager
                    = CrystalEnterprise.getSessionMgr()
            ;

            var lv_cms = lv_host+":"+lv_port;
            fx_trace(SCRIPT+"Logging on as "+lv_user+" to "+lv_cms);

            go_session = lo_session_manager.logon(
                lv_user
                , lv_password
                , lv_cms
                , "secEnterprise"
            );

            go_info_store = go_session.getService("InfoStore");

            fx_trace(SCRIPT+"Returning");
        },//logon

        /**
         * Disconnect from the BO CMS if any active session exists.
         * Does nothing otherwise.
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
         * @param {string} iv_name - SI_NAME of InfoObject
         * @param {string} iv_kind - SI_KIND of InfoObject
         * @param {?string} iv_additional_props - comma-separated
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
        importClass(Packages
                    .com.crystaldecisions.sdk.framework
                    .CrystalEnterprise);
    }

    class_init();
    return go_result;

})();
