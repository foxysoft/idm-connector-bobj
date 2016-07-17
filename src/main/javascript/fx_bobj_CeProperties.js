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
 * Utility functions for working with BOBJ (Crystal Enterprise) properties
 * @class
 */
var fx_bobj_CeProperties = (function() {

    /**
     * Maps CE property IDs to CE property names. The keys in this
     * map are property IDs, the values property names.
     * Initialized by class_init(), never cleaned up.
     *
     * @type {java.util.HashMap<java.lang.Integer,java.lang.String>} - 
     */
    var go_ce_properties = null;

    /**
     * Used to convert java.util.Date instances to ISO8601 date strings.
     * Initialized by class_init(), never cleaned up.
     *
     * @type {java.text.SimpleDateFormat}
     */
    var go_date_format = null;

    var go_result = {

        /**
         * <div>Check if property can be read into IDM during initial load.</div>
         * <div>This check returns true if the property is documented
         * as a public constant in SDK class 
         * com.crystaldecisions.sdk.occa.infostore.CePropertyID and
         * if it is not a property bag.</div>
         * @function
         * @public
         * @name fx_bobj_CeProperties.isExportable
         * @param {com.crystaldecisions.sdk.properties.IProperties} io_props
         *        - property bag
         * @param {java.lang.Object} io_key - property key
         * @return {boolean} true if property is exportable, false otherwise
         */
        isExportable: function(io_props, io_key)
        {
            var SCRIPT = "fxi_bobj_CeProperties.is_exportable: ";
            var lv_is_exportable = false;

            if (io_props != null && io_props.containsKey(io_key))
            {
                var lv_is_public = go_ce_properties.containsKey(io_key);
                var lo_property = io_props.getProperty(io_key);
                var lv_is_container = lo_property.isContainer();

                lv_is_exportable = lv_is_public && !lv_is_container;
            }
            return lv_is_exportable;
        },// isExportable

        /**
         * <div>Get formatted string value of a property.</div>
         * <div>If io_key corresponds to one of the CE properties
         * whose values are known to have type java.util.Date,
         * this method will convert the Date into an ISO8601
         * string representation of that java.util.Date object.</div>
         * @function
         * @public
         * @name fx_bobj_CeProperties.getFormattedValue
         * @param {com.crystaldecisions.sdk.properties.IProperties} io_props
         *        - property bag
         * @param {java.lang.Object} io_key - property key
         * @return {java.lang.String?} string value of property or null
         */
        getFormattedValue: function(io_props, io_key)
        {
            var lo_value = null;

            if (io_key.equals(CePropertyID.SI_CREATION_TIME)
                || io_key.equals(CePropertyID.SI_UPDATE_TS)
                || io_key.equals(CePropertyID.SI_LASTLOGONTIME))
            {
                lo_value = go_date_format.format(io_props.getDate(io_key));
            }
            else
            {
                // Important to use getString() instead of get(),
                // since only getString() will return a properly
                // UTF-8 encoded Java String. The result of get()
                // will have unicode escape sequences for all
                // international characters, indicating that the
                // original values from the CMS database use
                // UTF-16 encoding (EURO sign comes as \u20AC).
                lo_value = io_props.getString(io_key);
            }
            return lo_value;

        },// getFormattedValue


        /**
         * Convert numeric property ID to char-like property name.
         * @function
         * @public
         * @name fx_bobj_CeProperties.getName
         * @param {java.lang.Integer} iv_property_id - property ID
         * @return {java.lang.String} - property name
         */
        getName: function(iv_property_id)
        {
            return go_ce_properties.get(iv_property_id);
        }//getName

    }//go_result
    ;

    /**
     * Creates and populates the map go_ce_properties
     * by examining SDK class CePropertyID and reading
     * all of its public static field names and values
     * via reflection.
     */
    function class_init()
    {
        // Workaround "Packages is undefined"
        var lo_packages = (function(){return this["Packages"];}).call(null);
        if(lo_packages)
        {
            var SCRIPT = "fx_bobj_CeProperties=>class_init: ";
            fx_trace(SCRIPT+"Entering");

            importClass(lo_packages
                        .com.crystaldecisions.sdk.occa.infostore
                        .CePropertyID);

            go_date_format
                = new java.text.SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss");

            go_ce_properties = new java.util.HashMap();

            var lo_class = java.lang.Class.forName(
                "com.crystaldecisions.sdk.occa.infostore.CePropertyID"
            );

            var  lt_fields = lo_class.getDeclaredFields();
            for (var i = 0; i < lt_fields.length; ++i) {
                var lo_field = lt_fields[i];
                var lv_field_name = lo_field.getName();
                var lv_field_value = lo_field.get(null);

                var lv_modifiers = lo_field.getModifiers();

                if (java.lang.reflect.Modifier.isStatic(lv_modifiers)
                    && java.lang.reflect.Modifier.isPublic(lv_modifiers)
                    && java.lang.reflect.Modifier.isFinal(lv_modifiers))
                {
                    go_ce_properties.put(lv_field_value, lv_field_name);
                }
            }//for (var i = 0; i < lt_fields.length; ++i) {
            fx_trace(SCRIPT
                     +"go_ce_properties.size()="
                     +go_ce_properties.size());

            fx_trace(SCRIPT+"Returning");

        }//if(lo_packages)
    }//class_init

    class_init();
    return go_result;

})();
