/**
 * @param io_entry - DSE entry
 * @return {string} - empty on success, or error message prefixed
 *         with !ERROR on failure
 */
function fx_bobj_createUser(io_entry)
{
    /*
     function fx_trace(){}
     var IUser;
     function importClass(){}
     var Packages;
     var fx_bobj_Session;
     var fx_JavaUtils;
     */

    var SCRIPT = "fx_bobj_createUser: ";
    fx_trace(SCRIPT+"Entering");

    var lv_result = "";

    importClass(Packages
                .com.crystaldecisions.sdk.plugin.desktop.user
                .IUser);

    // ===========================================================
    // Check input arguments & supply defaults where required
    // ===========================================================
    var lv_si_name = io_entry.get("SI_NAME");

    if(lv_si_name == null)
    {
        throw new java.lang.Exception(
            "Missing mandatory parameter SI_NAME"
        );
    }
    else
    {
        fx_trace(SCRIPT+"lv_si_name="+lv_si_nameduser);
    }

    var lv_initial_password = io_entry.get("FX_INITIAL_PASSWORD");
    fx_trace(SCRIPT+"lv_initial_password="+lv_initial_password);

    var lv_si_userfullname = io_entry.get("SI_USERFULLNAME");
    fx_trace(SCRIPT+"lv_si_userfullname="+lv_si_userfullname);

    var lv_si_email_address = io_entry.get("SI_EMAIL_ADDRESS");
    fx_trace(SCRIPT+"lv_si_email_address="+lv_si_email_address);

    var lv_si_description = io_entry.get("SI_DESCRIPTION");
    fx_trace(SCRIPT+"lv_si_description="+lv_si_description);

    var lv_si_nameduser = io_entry.get("SI_NAMEDUSER");
    fx_trace(SCRIPT+"lv_si_nameduser="+lv_si_nameduser);

    var lv_connection = null;

    if(lv_si_nameduser != null)
    {
        if("true"==lv_si_nameduser)
        {
            lv_connection = IUser.NAMED;
            fx_trace(SCRIPT
                     + "Creating named user,"
                     + " lv_connection="
                     + lv_connection);
        }
        else if("false"==lv_si_nameduser)
        {
            lv_connection = IUser.CONCURRENT;
            fx_trace(SCRIPT
                     + "Creating concurrent user,"
                     + " lv_connection="
                     + lv_connection);
        }
        else
        {
            throw new java.lang.Exception(
                "Illegal value "
                    + lv_si_nameduser
                    + " for SI_NAMEDUSER"
                    + " (legal values: true, false)");
        }

    }//if(lv_si_nameduser != null)
    else
    {
        lv_connection = IUser.CONCURRENT;
        fx_trace(SCRIPT
                 + "Defaulted SI_NAMEDUSER=false"
                 + " (connection="
                 + lv_connection
                 + ")");
    }

    // ===========================================================
    // Create new user object and populate its attributes
    // ===========================================================
    var lo_new_user_collection
            = fx_bobj_Session
            .getInfoStore()
            .newInfoObjectCollection()
    ;
    fx_trace(SCRIPT+"Have new user collection? "
             + (lo_new_user_collection != null));

    // ========== W O R K A R O U N D ==========
    // The below call results in a
    //
    // ClassCastException: java.lang.String
    //
    // This indicates that the actual parameter
    // received by the at method when called
    // via the JS proxy is not a java.lang.String.
    // Maybe it's implicitly converted to a JS string
    // by Rhino?
    //
    // When invoking the same method via reflection,
    // this issue does not occur.
    // =========================================
    // var lo_new_user
    //         = lo_new_user_collection.add(IUser.KIND);

    var lt_arg_types = fx_JavaUtils.newArray(
        java.lang.Class
        ,java.lang.String
    );

    var lt_arg_values = fx_JavaUtils.newArray(
        java.lang.Object
        ,IUser.KIND
    );

    var lo_new_user = fx_JavaUtils.callByReflection(
        lo_new_user_collection
        ,"add"
        ,lt_arg_types
        ,lt_arg_values
    );

    fx_trace(SCRIPT+"Created new user object? "
             + (lo_new_user != null));

    // lo_new_user.setTitle(lv_si_name);
    lt_arg_values[0] = lv_si_name;

    fx_JavaUtils.callByReflection(
        lo_new_user
        ,"setTitle"
        ,lt_arg_types
        ,lt_arg_values
    );

    if(lv_initial_password != null)
    {
        // lo_new_user.setNewPassword(lv_initial_password);

        lt_arg_values[0] = lv_initial_password;

        fx_JavaUtils.callByReflection(
            lo_new_user
            ,"setNewPassword"
            ,lt_arg_types
            ,lt_arg_values
        );
        fx_trace(SCRIPT+"Set user's initial password");
    }
    else
    {
        fx_trace(SCRIPT+"Creating user without password");
    }

    if(lv_si_userfullname != null)
    {
        // lo_new_user.setFullName(lv_si_userfullname);
        lt_arg_values[0] = lv_si_userfullname;

        fx_JavaUtils.callByReflection(
            lo_new_user
            ,"setFullName"
            ,lt_arg_types
            ,lt_arg_values
        );
        fx_trace(SCRIPT+"Set user's full name");
    }
    else
    {
        fx_trace(SCRIPT+"Creating user without full name");
    }

    if(lv_si_email_address != null)
    {
        // lo_new_user.setEmailAddress(lv_si_email_address);
        lt_arg_values[0] = lv_si_email_address;

        fx_JavaUtils.callByReflection(
            lo_new_user
            ,"setEmailAddress"
            ,lt_arg_types
            ,lt_arg_values
        );
        fx_trace(SCRIPT+"Set user's email address");
    }
    else
    {
        fx_trace(SCRIPT+"Creating user without email address");
    }

    if(lv_si_description != null)
    {
        // lo_new_user.setDescription(lv_si_description);
        lt_arg_values[0] = lv_si_description;

        fx_JavaUtils.callByReflection(
            lo_new_user
            ,"setDescription"
            ,lt_arg_types
            ,lt_arg_values
        );
        fx_trace(SCRIPT+"Set user's description");
    }
    else
    {
        fx_trace(SCRIPT+"Creating user without description");
    }

    // lo_new_user.setConnection(lv_connection);
    lt_arg_types = fx_JavaUtils.newArray(
        java.lang.Class
        // java.lang.Integer.TYPE is the Java
        // class of PRIMITIVE type int
        // ==> this call creates a java.lang.Class
        // array whose sole element is the primitive
        // type of int
        ,java.lang.Integer.TYPE
    );

    // The commented line below would result in
    // java.lang.IllegalArgumentException on subsequent
    // call to java.lang.Method.invoke() in helper
    // function fx_JavaUtils.callByReflection, so it cannot
    // be used.
    //
    // The root cause of this is that JS Numeric seems to
    // always be implicitly converted to java.lang.Double
    // when passed to Java methods, even when the actual
    // value is an Integer.
    //
    // The workaround is to create a java.lang.Integer[]
    // argument values array explicitly for this call,
    // instead of re-using the generic java.lang.Object[]
    // from all previous calls.
    //
    // ========== D O E S   N O T   W O R K ==========
    // lt_arg_values[0] = lv_connection;
    // ===============================================

    lt_arg_values = fx_JavaUtils.newArray(
        // java.lang.Integer is the Java
        // class of OBJECT type int
        // ==> this call creates a java.lang.Integer
        // array whose sole element is the actual
        // value of lv_connection
        java.lang.Integer
        ,lv_connection
    );

    fx_JavaUtils.callByReflection(
        lo_new_user
        ,"setConnection"
        ,lt_arg_types
        ,lt_arg_values
    );

    fx_trace(SCRIPT+"Set user's connection");

    // ===========================================================
    // Save new user object to persistent storage in CMS
    // ===========================================================
    fx_bobj_Session.getInfoStore().commit(lo_new_user_collection);
    fx_trace(SCRIPT
             + "Committed new user collection");

    fx_trace(SCRIPT+"Returning "+lv_result);
    return lv_result;

}//CREATE_USER
