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

/** @class */
var fx_bobj_User = (function() {

    /*
     var fx_bobj_Session;
     var IUser;
     var IInfoObject;
     function fx_trace(){}
     function importClass(){}
     var Packages;
     */

    /** @type {java.text.SimpleDateFormat} */
    var go_date_format = null;

    /**
     * @function
     * @private
     * @param {string} v - attribute string value
     * @return {java.lang.Object} - attribute object value
     * @throws {java.lang.Exception}
     */
    function parseAttributeValue(iv_attr_value)
    {
        var SCRIPT = "fx_bobj_User=>parseAttributeValue: ";
        fx_trace(SCRIPT+"Entering iv_attr_value="+iv_attr_value);

        var lv_data;
        var lo_data;
        var lv_upper_value = iv_attr_value.toUpperCase();

        if (lv_upper_value.indexOf("{BOOLEAN}") == 0)
        {
            lv_data = iv_attr_value.substring("{BOOLEAN}".length);
            if(lv_data == "1")
            {
                lv_data = "true";
            }
            else if(lv_data == "0" || lv_data == "")
            {
                lv_data = "false";
            }
            lo_data = new java.lang.Boolean(java.lang.Boolean.parseBoolean(lv_data));
        }
        else if (lv_upper_value.indexOf("{LONG}") == 0)
        {
            lv_data = iv_attr_value.substring("{LONG}".length);
            lo_data = new java.lang.Long(java.lang.Long.parseLong(lv_data));
        }
        else if (lv_upper_value.indexOf("{INT}") == 0)
        {
            lv_data = iv_attr_value.substring("{INT}".length);
            lo_data = new java.lang.Integer(java.lang.Integer.parseInt(lv_data));
        }
        else if (lv_upper_value.indexOf("{DATE}") == 0)
        {
            lv_data = iv_attr_value.substring("{DATE}".length);
            lo_data = go_date_format.parse(lv_data);
        }
        else if (lv_upper_value.indexOf("{STRING}") == 0)
        {
            lv_data = iv_attr_value.substring("{STRING}".length);
            lo_data = lv_data;
        }
        else
        {
            lv_data = iv_attr_value;
            lo_data = lv_data;
        }

        fx_trace(SCRIPT+"Returning "+lo_data);
        return lo_data;

    }// parseAttributeValue


    /**
     * @private
     * @param {com.crystaldecisions.sdk.properties.IProperties} props
     * @param {string} k - attribute name (key)
     * @param {string} v - attribute value
     * @throws {java.lang.Exception}
     */
    function setAllAliasesDisabled(props, k, v)
    {
        var LOC = "fx_bobj_User=>setDisabled: ";
        fx_trace(LOC+"Entering k="+k+", v="+v);

        /**@type {com.crystaldecisions.sdk.properties.IProperties} */
        var aliases = props.getProperties("SI_ALIASES");

        // Note that when the property SI_TOTAL does not exist,
        // this call does not throw any exception, but returns 0 (zero)
        /** @type {java.lang.Integer.TYPE}*/
        var numAliases = aliases.getInt("SI_TOTAL");
        fx_trace(LOC + "numAliases=" + numAliases);

        // The keys in property bag SI_ALIASES are integers in the range
        // 1 up to and including the value of SI_TOTAL
        for (var i = 1; i <= numAliases; ++i)
        {
            /**@type {com.crystaldecisions.sdk.properties.IProperties} */
            var oneAlias = aliases.getProperties(new java.lang.Integer(i));

            /**@type {java.lang.String}*/
            var name = oneAlias.getString("SI_NAME");
            fx_trace(LOC + "SI_ALIASES[" + i + "]-SI_NAME=" + name);

            /**@type {com.crystaldecisions.sdk.properties.IProperty}*/
            var p = oneAlias.getProperty("SI_DISABLED");
            fx_trace(LOC + "SI_ALIASES[" + i + "]-SI_DISABLED=" + p);

            p.setValue(parseAttributeValue(v));
        }//for (var i = 1; i <= numAliases; ++i) {

        fx_trace(LOC+"Returning");

    }//setAllAliasesDisabled

    /**
     * @private
     * @param {com.crystaldecisions.sdk.plugin.desktop.user.IUser} user
     * @param {string} k - attribute name (key)
     * @param {string} v - attribute value
     * @throws {java.lang.Exception}
     */
    function setPassword(user, k, v)
    {
        var SCRIPT = "fx_bobj_User=>setPassword: ";
        fx_trace(SCRIPT + "Entering k=" + k + ", v=" + v);

        // Works in Java, but yields "undefined is not a function" in JS
        // user.setNewPassword(parseAttributeValue(v));

        //BEGIN: workaround for missing setNewPassword() in JS
        /** @type {java.lang.Class[]}*/
        var lt_arg_types = fx_JavaUtils.newArray(
            java.lang.Class //no .class suffix in JS
            , java.lang.String //no .class suffix in JS
        );

        /**@type {java.lang.Object[]}*/
        var lt_arg_values = fx_JavaUtils.newArray(
            java.lang.String //no .class suffix in JS
            ,parseAttributeValue(v)
        );

        fx_JavaUtils.callByReflection(
            user
            ,"setNewPassword"
            ,lt_arg_types
            ,lt_arg_values
        );
        //END: workaround

        fx_trace(SCRIPT + "Returning");
    }//setPassword

    /**
     * @private
     * @param {com.crystaldecisions.sdk.plugin.desktop.user.IUser} user
     * @param {string} k - attribute name (key)
     * @param {string} v - attribute value
     * @throws {java.lang.Exception}
     */
    function setNamedUser(user, k, v)
    {
        var SCRIPT = "fx_bobj_User=>setNamedUser: ";
        fx_trace(SCRIPT+"Entering k="+k+", v="+v);

        /** @type {java.lang.Integer.TYPE} */
        var lv_connection = null;

        /** @type {java.lang.Boolean.TYPE} */
        var lv_si_nameduser = parseAttributeValue(v);

        if(java.lang.Boolean.TRUE.equals(lv_si_nameduser))
        {
            lv_connection = IUser.NAMED;
            fx_trace(SCRIPT
                     + "Creating named user,"
                     + " lv_connection="
                     + lv_connection);
        }
        else if(java.lang.Boolean.FALSE.equals(lv_si_nameduser))
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

        // Works in Java, but yields "undefined is not a function" in JS
        // lo_new_user.setConnection(lv_connection);

        //BEGIN: workaround
        var lt_arg_types = fx_JavaUtils.newArray(
            java.lang.Class
            // java.lang.Integer.TYPE is the Java
            // class of PRIMITIVE type int
            ,java.lang.Integer.TYPE
        );

        // ===============================================
        // Using lt_arg_values of type java.lang.Object[]
        // would result in java.lang.IllegalArgumentException
        // on subsequent call to java.lang.Method.invoke()
        // in fx_JavaUtils.callByReflection, so that cannot
        // be used.
        //
        // The root cause of this is that JS Numeric seems to
        // always be implicitly converted to java.lang.Double
        // when passed to Java methods, even when the actual
        // value is an Integer.
        // ===============================================

        var lt_arg_values = fx_JavaUtils.newArray(
            // java.lang.Integer is the Java
            // class of OBJECT type int
            // ==> this call creates a java.lang.Integer
            // array whose sole element is the actual
            // value of lv_connection
            java.lang.Integer
            ,lv_connection
        );

        fx_JavaUtils.callByReflection(
            user
            ,"setConnection"
            ,lt_arg_types
            ,lt_arg_values
        );
        //END: workaround

        fx_trace(SCRIPT+"Set user's connection");
    }//setNamedUser

    /**
     * @private
     * @param {com.crystaldecisions.sdk.properties.IProperties} props
     * @param {string} k - attribute name (key)
     * @param {string} v - attribute value
     * @param {boolean} isNew - is props a newly created object
     * @throws {java.lang.Exception}
     */
    function setAttributeGeneric(props, k, v, iv_is_new)
    {
        var SCRIPT = "fx_bobj_User=>setAttributeGeneric: ";
        fx_trace(SCRIPT+"Entering k="+k+", v="+v);

        if(iv_is_new)
        {
            fx_trace(SCRIPT+"Using IProperties.setProperty for new user");
            props["setProperty(java.lang.Object,java.lang.Object)"](
                k
                ,parseAttributeValue(v)
            );
        }
        else
        {
            fx_trace(SCRIPT+"Using IProperty.setValue for existing user");
            /** @type {com.crystaldecisions.sdk.occa.infostore.IInfoObject} */
            var p = props.getProperty(k);
            if (p != null)
            {
                if (!p.isContainer())
                {
                    p.setValue(parseAttributeValue(v));

                } // if (!p.isContainer())
                else
                {
                    throw new java.lang.Exception(
                        "Property "
                            + k
                            + " is a container;"
                            + " can only modify non-container properties");
                }
            }// if(p!= null)
            else
            {
                throw new java.lang.Exception(
                    "Property "
                        + k
                        + " does not exist");
            }
        }

        fx_trace(SCRIPT+"Returning");

    }//setAttributeGeneric

    /**
     * @private
     */
    function setAttributes(infoObjects, io_entry, iv_is_new)
    {
        var SCRIPT = "fx_bobj_User=>setAttributes: ";
        fx_trace(SCRIPT+"Entering");

        /** @type {com.crystaldecisions.sdk.occa.infostore.IInfoObject} */
        var toModify = infoObjects.get(0);
        fx_trace(SCRIPT + "Modifying " + toModify);

        if(!iv_is_new)
        {
            fx_trace(SCRIPT + "Retrieving all properties");
            toModify.retrievePropertySet(IInfoObject.PropertySet.ALL);
        }

        /** @type {com.crystaldecisions.sdk.occa.infostore.IInfoObject} */
        var props = toModify.properties();
        fx_trace(SCRIPT + "Have properties? "+(props != null));

        /** @type {java.lang.String[]} */
        var attrNames = io_entry.keySet().toArray();

        for (var i = 0; i < attrNames.length; ++i) {
            /** @type {java.lang.String} */
            var k = attrNames[i];

            /** @type {java.lang.String}*/
            var v = io_entry.get(k);

            // Ignore attribute name "CHANGETYPE" and everything
            // starting with "DUMMY". Note that IDM does NOT ensure
            // that the keys in io_entry are uppercase.
            if(k.toUpperCase() == "CHANGETYPE"
               || k.toUpperCase().indexOf("DUMMY") == 0)
            {
                fx_trace(SCRIPT+"Skipping attribute "+k);
                continue; //========================= WITH NEXT ATTR
            }
            else if(k.toUpperCase() == "SI_DISABLED")
            {
                setAllAliasesDisabled(props, k, v);
            }
            else if(k.toUpperCase() == "SI_PASSWORD")
            {
                // Must pass IInfoObject here, not IProperties
                setPassword(toModify, k, v);
            }
            else if(k.toUpperCase() == "SI_NAMEDUSER")
            {
                // Must pass IInfoObject here, not IProperties
                setNamedUser(toModify, k, v);
            }
            else
            {
                setAttributeGeneric(props, k, v, iv_is_new);
            }//else

            /** @type {java.lang.Boolean.TYPE} */
            var isDirty = toModify.isDirty();
            fx_trace(SCRIPT + "isDirty=" + isDirty);

        }// for (var i = 0; i < attrNames.size(); ++i) {

    }//setAttributes

    var go_result = {

        /**
         * Modify a BusinessObjects user
         * @function
         * @public
         * @name fx_bobj_User.create
         * @param {com.sap.idm.ic.DSEEntry} - IDM entry
         */
        modify: function(io_entry)
        {
            var SCRIPT = "fx_bobj_User=>modify: ";
            fx_trace(SCRIPT + "Entering io_entry="+io_entry);
            var lv_si_name = io_entry.get("SI_NAME");
            if(lv_si_name == null)
            {
                throw new java.lang.Exception(
                    "Missing mandatory parameter SI_NAME"
                );
            }

            /** @type {com.crystaldecisions.sdk.occa.infostore.IInfoObjects} */
            var infoObjects = fx_bobj_Session.lookupSingleInfoObject(
                lv_si_name
                ,IUser.KIND);

            setAttributes(infoObjects, io_entry, false);

            // ===========================================================
            // Save modified user object to persistent storage in CMS
            // ===========================================================
            fx_trace(SCRIPT + "Before commit");
            fx_bobj_Session.getInfoStore().commit(infoObjects);

            fx_trace(SCRIPT + "Returning");
        },//modify

        /**
         * Create a BusinessObjects user
         * @function
         * @public
         * @name fx_bobj_User.modify
         * @param {com.sap.idm.ic.DSEEntry} - IDM entry
         * @throws {java.lang.Exception}
         */
        create: function(io_entry)
        {
            var SCRIPT = "fx_bobj_User=>create: ";
            fx_trace(SCRIPT + "Entering io_entry="+io_entry);

            var lo_si_name = io_entry.get("SI_NAME");
            if(lo_si_name == null)
            {
                throw new java.lang.Exception(
                    "Missing mandatory parameter SI_NAME"
                );
            }

            // ===========================================================
            // Create new user object and populate its attributes
            // ===========================================================
            /** @type {com.crystaldecisions.sdk.occa.infostore.IInfoObjects} */
            var lo_new_user_collection
                    = fx_bobj_Session
                    .getInfoStore()
                    .newInfoObjectCollection()
            ;
            fx_trace(SCRIPT+"Have new user collection? "
                     + (lo_new_user_collection != null));

            // Must explicitly choose signature of overloaded method
            // to avoid ClassCastException: java.lang.String
            lo_new_user_collection["add(java.lang.String)"](IUser.KIND);

            setAttributes(lo_new_user_collection, io_entry, true);

            // ===========================================================
            // Save new user object to persistent storage in CMS
            // ===========================================================
            fx_trace(SCRIPT+"Before commit");
            fx_bobj_Session.getInfoStore().commit(lo_new_user_collection);

            fx_trace(SCRIPT+"Returning");

        },//create

        /**
	 * Removes/deletes a BOBJ user.
         * @function
         * @public
         * @name fx_bobj_User.remove
	 * @param {com.sap.idm.ic.DSEEntry} io_entry - IDM entry
         * @throws {java.lang.Exception}
         */
        remove: function(io_entry)
        {
            var SCRIPT = "fx_bobj_User=>remove: ";
            fx_trace(SCRIPT + "Entering io_entry="+io_entry);

            var lo_si_name = io_entry.get("SI_NAME");
            if(lo_si_name == null)
            {
                throw new java.lang.Exception(
                    "Missing mandatory parameter SI_NAME"
                );
            }

            var lo_to_delete_info_objects
                    = fx_bobj_Session.lookupSingleInfoObject(
                        lo_si_name
                        ,IUser.KIND
                    );

            var lo_to_delete_info_object
                    = lo_to_delete_info_objects.get(0);
            fx_trace(SCRIPT
                     + "Have info object to delete? "
                     + (lo_to_delete_info_object != null));

            // Must use property syntax to invoke delete() method
            // of com.crystaldecisions.sdk.occa.infostore.IInfoObjects
            // as delete is a keyword in JavaScript
            lo_to_delete_info_objects["delete"](lo_to_delete_info_object);

            fx_trace(SCRIPT+"Before commit");
            fx_bobj_Session.getInfoStore().commit(lo_to_delete_info_objects);

            fx_trace(SCRIPT+"Returning");

        }//remove

    }//go_result
    ;

    function class_init()
    {
        // Workaround "Packages is undefined"
        var lo_packages = (function(){return this["Packages"];}).call(null);
        if(lo_packages)
        {
            go_date_format = new java.text.SimpleDateFormat(
                "yyyy-MM-dd'T'hh:mm:ss");

            importClass(lo_packages
                        .com.crystaldecisions.sdk.occa.infostore
                        .IInfoObject);

            importClass(lo_packages
                        .com.crystaldecisions.sdk.plugin.desktop.user
                        .IUser);
        }//if(lo_packages)
    }//class_init

    class_init();
    return go_result;
})();
