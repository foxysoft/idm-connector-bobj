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
 * Data manipulation functions for BOBJ users
 * @class
 */
var fx_bobj_User = (function() {

    /** @type {java.text.SimpleDateFormat} */
    var go_date_format = null;

    /**
     * @function
     * @private
     * @param {string} iv_attr_value - attribute string value
     * @return {java.lang.Object} - attribute value as Java object
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
     * @param {com.crystaldecisions.sdk.properties.IProperties}
     *        io_properties
     * @param {string} iv_key - attribute name (key)
     * @param {string} iv_value - attribute value
     * @throws {java.lang.Exception}
     */
    function setAllAliasesDisabled(io_properties, iv_key, iv_value)
    {
        var SCRIPT = "fx_bobj_User=>setAllAliasesDisabled: ";
        fx_trace(SCRIPT+"Entering iv_key="+iv_key+", iv_value="+iv_value);

        /**@type {com.crystaldecisions.sdk.properties.IProperties} */
        var lo_aliases = io_properties.getProperties("SI_ALIASES");

        // Note that when the property SI_TOTAL does not exist,
        // this call does not throw any exception, but returns 0 (zero)
        /** @type {java.lang.Integer.TYPE}*/
        var lv_num_aliases = lo_aliases.getInt("SI_TOTAL");
        fx_trace(SCRIPT + "lv_num_aliases=" + lv_num_aliases);

        // The keys in property bag SI_ALIASES are integers
        // ranging from 1 up to and including the value of SI_TOTAL
        for (var i = 1; i <= lv_num_aliases; ++i)
        {
            /**@type {com.crystaldecisions.sdk.properties.IProperties} */
            var lo_one_alias = lo_aliases.getProperties(
                new java.lang.Integer(i));

            /**@type {java.lang.String}*/
            var lo_name = lo_one_alias.getString("SI_NAME");
            fx_trace(SCRIPT + "SI_ALIASES[" + i + "]-SI_NAME=" + lo_name);

            /**@type {com.crystaldecisions.sdk.properties.IProperty}*/
            var lo_property = lo_one_alias.getProperty("SI_DISABLED");
            fx_trace(SCRIPT
                     + "SI_ALIASES[" + i + "]-SI_DISABLED="
                     + lo_property);

            lo_property.setValue(parseAttributeValue(iv_value));
        }//for (var i = 1; i <= lv_num_aliases; ++i) {

        fx_trace(SCRIPT+"Returning");

    }//setAllAliasesDisabled

    /**
     * @private
     * @param {com.crystaldecisions.sdk.plugin.desktop.user.IUser} io_user
     * @param {string} iv_key - attribute name (key)
     * @param {string} iv_value - attribute value
     * @throws {java.lang.Exception}
     */
    function setPassword(io_user, iv_key, iv_value)
    {
        var SCRIPT = "fx_bobj_User=>setPassword: ";
        fx_trace(SCRIPT
                 + "Entering iv_key=" + iv_key
                 + ", iv_value=" + iv_value);

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
            ,parseAttributeValue(iv_value)
        );

        fx_JavaUtils.callByReflection(
            io_user
            ,"setNewPassword"
            ,lt_arg_types
            ,lt_arg_values
        );
        //END: workaround

        fx_trace(SCRIPT + "Returning");
    }//setPassword

    /**
     * @private
     * @param {com.crystaldecisions.sdk.plugin.desktop.user.IUser} io_user
     * @param {string} iv_key - attribute name (key)
     * @param {string} iv_value - attribute value
     * @throws {java.lang.Exception}
     */
    function setNamedUser(io_user, iv_key, iv_value)
    {
        var SCRIPT = "fx_bobj_User=>setNamedUser: ";
        fx_trace(SCRIPT+"Entering iv_key="+iv_key+", iv_value="+iv_value);

        /** @type {java.lang.Integer.TYPE} */
        var lv_connection = null;

        /** @type {java.lang.Boolean.TYPE} */
        var lo_si_nameduser = parseAttributeValue(iv_value);

        if(java.lang.Boolean.TRUE.equals(lo_si_nameduser))
        {
            lv_connection = IUser.NAMED;
            fx_trace(SCRIPT
                     + "Creating named user,"
                     + " lv_connection="
                     + lv_connection);
        }
        else
        {
            lv_connection = IUser.CONCURRENT;
            fx_trace(SCRIPT
                     + "Creating concurrent user,"
                     + " lv_connection="
                     + lv_connection);
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
            io_user
            ,"setConnection"
            ,lt_arg_types
            ,lt_arg_values
        );
        //END: workaround

        fx_trace(SCRIPT+"Set user's connection");
    }//setNamedUser

    /**
     * @private
     * @param {com.crystaldecisions.sdk.properties.IProperties}
     *        io_properties
     * @param {string} iv_key - attribute name (key)
     * @param {string} iv_value - attribute value
     * @param {boolean} iv_is_new - is io_properties a new object
     * @throws {java.lang.Exception}
     */
    function setAttributeGeneric(io_properties, iv_key, iv_value, iv_is_new)
    {
        var SCRIPT = "fx_bobj_User=>setAttributeGeneric: ";
        fx_trace(SCRIPT
                 + "Entering iv_key=" + iv_key
                 + ", iv_value=" + iv_value
                 + "iv_is_new=" + iv_is_new);

        if(!iv_is_new)
        {
            fx_trace(SCRIPT+"Using IProperty.setValue for existing user");

            /**
             * @type {com.crystaldecisions.sdk.occa.infostore.IInfoObject}
             */
            var lo_property = io_properties.getProperty(iv_key);
            if (lo_property != null)
            {
                if (!lo_property.isContainer())
                {
                    lo_property.setValue(parseAttributeValue(iv_value));

                } // if (!lo_property.isContainer())
                else
                {
                    throw new java.lang.Exception(
                        "Property "
                            + iv_key
                            + " is a container;"
                            + " can only modify non-container properties");
                }
            }// if(lo_property != null)
            else
            {
                throw new java.lang.Exception(
                    "Property "
                        + iv_key
                        + " does not exist");
            }
        }//if(!iv_is_new)
        else
        {
            fx_trace(SCRIPT+"Using IProperties.setProperty for new user");

            io_properties["setProperty(java.lang.Object,java.lang.Object)"](
                iv_key
                ,parseAttributeValue(iv_value)
            );
        }

        fx_trace(SCRIPT+"Returning");

    }//setAttributeGeneric

    /**
     * @private
     * @param {com.crystaldecisions.sdk.occa.infostore.IInfoObjects}
     *        io_info_objects - InfoObject collection
     * @param {com.sap.idm.ic.DSEEntry} io_entry - IDM entry
     * @param {boolean} iv_is_new
     */
    function setAttributes(io_info_objects, io_entry, iv_is_new)
    {
        var SCRIPT = "fx_bobj_User=>setAttributes: ";
        fx_trace(SCRIPT+"Entering");

        /** @type {com.crystaldecisions.sdk.occa.infostore.IInfoObject} */
        var lo_to_modify = io_info_objects.get(0);
        fx_trace(SCRIPT + "Modifying " + lo_to_modify);

        if(!iv_is_new)
        {
            fx_trace(SCRIPT + "Retrieving all properties");
            lo_to_modify.retrievePropertySet(IInfoObject.PropertySet.ALL);
        }

        /** @type {com.crystaldecisions.sdk.occa.infostore.IInfoObject} */
        var lo_properties = lo_to_modify.properties();
        fx_trace(SCRIPT + "Have properties? "+(lo_properties != null));

        /** @type {java.lang.String[]} */
        var lt_attr_names = io_entry.keySet().toArray();

        for (var i = 0; i < lt_attr_names.length; ++i) {
            /** @type {java.lang.String} */
            var lo_key = lt_attr_names[i];

            /** @type {java.lang.String}*/
            var lo_value = io_entry.get(lo_key);

            // Ignore attribute name "CHANGETYPE" and everything
            // starting with "DUMMY". Note that IDM does NOT ensure
            // that the keys in io_entry are uppercase.
            if(lo_key.toUpperCase() == "CHANGETYPE"
               || lo_key.toUpperCase().indexOf("DUMMY") == 0)
            {
                fx_trace(SCRIPT+"Skipping attribute "+lo_key);
                continue; //========================= WITH NEXT ATTR
            }
            else if(lo_key.toUpperCase() == "SI_DISABLED")
            {
                setAllAliasesDisabled(lo_properties, lo_key, lo_value);
            }
            else if(lo_key.toUpperCase() == "SI_PASSWORD")
            {
                // Must pass IInfoObject here, not IProperties
                setPassword(lo_to_modify, lo_key, lo_value);
            }
            else if(lo_key.toUpperCase() == "SI_NAMEDUSER")
            {
                // Must pass IInfoObject here, not IProperties
                setNamedUser(lo_to_modify, lo_key, lo_value);
            }
            else
            {
                setAttributeGeneric(
                    lo_to_modify
                    ,lo_key
                    ,lo_value
                    ,iv_is_new
                );
            }//else

            /** @type {java.lang.Boolean.TYPE} */
            var lv_is_dirty = lo_to_modify.isDirty();
            fx_trace(SCRIPT + "lv_is_dirty=" + lv_is_dirty);

        }// for (var i = 0; i < lt_attr_names.size(); ++i) {

    }//setAttributes

    var go_result = {

        /**
         * Modify an existing BOBJ user.
         * @function
         * @public
         * @name fx_bobj_User.modify
         * @param {com.sap.idm.ic.DSEEntry} io_entry - IDM entry; see
         * {@link fx_bobj_User.create} for parameter details
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
         * Create a new BOBJ user.
         * @function
         * @public
         * @name fx_bobj_User.create
         * @param {com.sap.idm.ic.DSEEntry} io_entry - IDM entry
         * <pre>IO_ENTRY ::= {
         * SI_NAME:             User login ID (<strong>mandatory</strong>)
         * &lt;PROPERTY_NAME&gt;:     &lt;VALUE_SPEC&gt;
         * ...
         * }
         *
         * &lt;PROPERTY_NAME&gt; ::= Name of CE property with elementary type,
         *                     e.g. SI_DESCRIPTION
         * &lt;VALUE_SPEC&gt;    ::= [&lt;TYPE_SPEC&gt;]&lt;VALUE&gt;
         * &lt;TYPE_SPEC&gt;     ::= {&lt;TYPE&gt;}
         * &lt;TYPE&gt;          ::= STRING|DATE|INT|LONG|BOOLEAN
         * &lt;VALUE&gt;         ::= any string
         * </pre>
         * <p>If &lt;TYPE_SPEC&gt; is omitted, the default is {STRING}.</p>
         * <div>Example:</div>
         * <pre>IO_ENTRY ::= {
         * SI_NAME:             Administrator
         * SI_DESCRIPTION:      {STRING}BusinessObjects Administrator
         * }</pre>
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
            /**
             * @type {com.crystaldecisions.sdk.occa.infostore.IInfoObjects}
             */
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
         * Remove/delete an existing BOBJ user.
         * @function
         * @public
         * @name fx_bobj_User.remove
         * @param {com.sap.idm.ic.DSEEntry} io_entry - IDM entry
         * <pre>IO_ENTRY ::= {
         * SI_NAME:             User login ID (<strong>mandatory</strong>)
         * }
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

            var lo_info_objects
                    = fx_bobj_Session.lookupSingleInfoObject(
                        lo_si_name
                        ,IUser.KIND
                    );

            var lo_to_delete
                    = lo_info_objects.get(0);
            fx_trace(SCRIPT
                     + "Have info object to delete? "
                     + (lo_to_delete != null));

            // Must use property syntax to invoke delete() method
            // of com.crystaldecisions.sdk.occa.infostore.IInfoObjects
            // as delete is a keyword in JavaScript
            lo_info_objects["delete"](lo_to_delete);

            fx_trace(SCRIPT+"Before commit");
            fx_bobj_Session.getInfoStore().commit(lo_info_objects);

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
