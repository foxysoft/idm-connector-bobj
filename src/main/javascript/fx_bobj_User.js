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

                // Ignore attribute name "changetype"
                // and everything starting with "DUMMY"
                if(k.toUpperCase() == "CHANGETYPE"
                   || k.toUpperCase().indexOf("DUMMY") == 0)
                {
                    fx_trace(SCRIPT+"Skipping attribute "+k);
                    continue; //========================= WITH NEXT ATTR
                }

                /** @type {java.lang.String}*/
                var v = io_entry.get(k);

                /** @type {com.crystaldecisions.sdk.occa.infostore.IInfoObject} */
                var p = props.getProperty(k);
                if (p != null)
                {
                    if (!p.isContainer())
                    {
                        /** @type {java.lang.String} */
                        var data;

                        /** @type {java.lang.Object} */
                        var oData;
                        if (v.toUpperCase().indexOf("{BOOLEAN}") == 0)
                        {
                            // Note use of length property in JS code
                            // vs. length() method in corresponding Java code
                            data = v.substring("{boolean}".length);
                            oData = new java.lang.Boolean(
                                java.lang.Boolean.parseBoolean(data)
                            );
                        } else if (v.toUpperCase().indexOf("{LONG}") == 0)
                        {
                            data = v.substring("{long}".length);
                            oData = new java.lang.Long(
                                java.lang.Long.parseLong(data)
                            );
                        } else if (v.toUpperCase().indexOf("{INT}") == 0)
                        {
                            data = v.substring("{int}".length);
                            oData = new java.lang.Integer(
                                java.lang.Integer.parseInt(data)
                            );
                        } else if (v.toUpperCase().indexOf("{DATE}") == 0)
                        {
                            data = v.substring("{date}".length);
                            oData = go_date_format.parse(data);
                        } else if (v.toUpperCase().indexOf("{STRING}") == 0)
                        {
                            data = v.substring("{string}".length);
                            oData = data;
                        } else {
                            data = v;
                            oData = data;
                        }
                        fx_trace(SCRIPT + "Setting " + k + "=" + oData);
                        p.setValue(oData);

                        /** @type {java.lang.Boolean.TYPE} */
                        var isDirty = toModify.isDirty();
                        fx_trace(SCRIPT + "isDirty=" + isDirty);
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

            }// for (int i = 0; i < attrNames.size(); ++i) {
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
