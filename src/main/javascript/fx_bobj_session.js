var fx_bobj_session = (function () {
    /**
     * Session object from which service referenes can be obtained.
     *
     * Java type: com.crystaldecisions.sdk.framework.IEnterpriseSession
     *
     * Initialized by function LOGON, cleaned up by function LOGOFF.
     */
    var go_session = null;

    /**
     * InfoStore service which can be used to execute queries,
     * create, modify and delete info objects.
     *
     * Java type: com.crystaldecisions.sdk.occa.infostore.IInfoStore
     *
     * Initialized by function LOGON, cleaned up by function LOGOFF.
     */
    var go_info_store = null;

    /**
     * Connect to the BO CMS (Central Management Server)
     * using the supplied host, port, user and password.
     *
     * @param iv_params
     *        type JS string or java.lang.String
     *        LOGON!!<host>!!<port>!!<user>!!<password>
     */
    function logon(iv_params)
    {
        var SCRIPT = "fx_bobj_session=>logon: ";
        fx_trace(SCRIPT+"Entering iv_params="+iv_params);
        var lt_par = (""+iv_params).split("!!");

        var lv_command  = lt_par.shift();
        var lv_host     = lt_par.shift();
        var lv_port     = lt_par.shift();
        var lv_user     = lt_par.shift();
        var lv_password = lt_par.join("!!");

        importClass(Packages
                    .com.crystaldecisions.sdk.framework
                    .CrystalEnterprise);

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
    }//logon

    /**
     * Disconnect from the BO CMS if any active session exists.
     * Does nothing otherwise.
     */
    function logoff()
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
    }//logoff

    function get_info_store()
    {
        if(go_info_store == null)
        {
            throw new java.lang.Exception("Not connected");
        }
        return go_info_store;
    }

    /**
     * Entry point function. Dispatches to any public
     * API function specified by name in PAR.
     */
    function fx_bobj_session_impl(Par)
    {
        var SCRIPT = "fx_bobj_session: ";
        fx_trace(SCRIPT+"Entering Par="+Par);
        var lv_result = undefined;
        var lv_method = null;

        try
        {
            lv_method = (""+Par).toUpperCase();

            if(lv_method.indexOf("LOGON") == 0)
            {
                lv_result = logon(Par);
            }
            else if (lv_method.indexOf("LOGOFF") == 0)
            {
                lv_result = logoff(Par);
            }
            else
            {
                lv_result =
                    {
                        logon: logon
                        ,logoff: logoff
                        ,get_info_store: get_info_store
                    };
            }
        }//try
        catch(lo_exception)
        {
            // Note that in case of exceptions, the return
            // type of this method will be JS string, although
            // some use cases require that it's a DSE entry.
            lv_result = fxi_handle_exception(SCRIPT, lo_exception);

            //If requested method is unknown, LOGON or LOGOFF
            if(lv_method == null
               || lv_method.indexOf("LOGON") == 0
               ||lv_method.indexOf("LOGOFF") == 0)
            {
                // ==========================================
                // Never call uSkip or raise a Java exception
                // from INITIALIZE or TERMINATE.
                // ==========================================
                // It will result in an infinite loop, at least
                // in SAP IDM 7.2 SP7. The DSE runtime will try
                // to invoke this script over and over again.
                // Solution: do nothing in this case. The error
                // message has been emitted via uError already,
                // and will be shown in the job log. The only
                // downside of this approach is that subsequent
                // API methods, such as MODIFY, will still be
                // invoked, although the LOGON failed. For
                // this reason, all methods must guard against
                // being called in non-connected state.
            }
            else
            {
                // Use uSkip for any API method
                // other than LOGON or LOGOFF.
                // Do NOT re-throw the exception that occurred.
                uSkip(
                    1          //entry
                    ,2         //failed
                    ,lv_result //exception message+stack trace
                );
            }
        }//catch(lo_exception)

        fx_trace(SCRIPT+"Returning "+lv_result);
        return lv_result;
    }

    return fx_bobj_session_impl;

})();
