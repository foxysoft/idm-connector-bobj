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
     * @param {com.crystaldecisions.sdk.properties.IProperties} props
     * @param {string} k - attribute name (key)
     * @param {string} v - attribute value
     * @throws {java.lang.Exception}
     */
    function setAttributeGeneric(props, k, v)
    {
        var SCRIPT = "fx_bobj_User=>setAttributeGeneric: ";
        fx_trace(SCRIPT+"Entering k="+k+", v="+v);

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

        fx_trace(SCRIPT+"Returning");

    }//setAttributeGeneric

    var go_result = {
        modifyAttributes: function(io_entry)
        {
            var SCRIPT = "fx_bobj_User=>modifyAttributes: ";
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

            /** @type {com.crystaldecisions.sdk.occa.infostore.IInfoObject} */
            var toModify = infoObjects.get(0);
            fx_trace(SCRIPT + "Modifying " + toModify);

            fx_trace(SCRIPT + "Retrieving all properties");
            toModify.retrievePropertySet(IInfoObject.PropertySet.ALL);

            /** @type {com.crystaldecisions.sdk.occa.infostore.IInfoObject} */
            var props = toModify.properties();
            fx_trace(SCRIPT + "After retrieve: props=" + props);

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
                else if(k == "SI_DISABLED")
                {
                    setAllAliasesDisabled(props, k, v);
                }
                else
                {
                    setAttributeGeneric(props, k, v);
                }//else

                /** @type {java.lang.Boolean.TYPE} */
                var isDirty = toModify.isDirty();
                fx_trace(SCRIPT + "isDirty=" + isDirty);

            }// for (var i = 0; i < attrNames.size(); ++i) {

            fx_trace(SCRIPT + "Commiting " + infoObjects);
            fx_bobj_Session.getInfoStore().commit(infoObjects);

            fx_trace(SCRIPT + "Returning");
            return "";
        }//modifyAttributes
    };

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
