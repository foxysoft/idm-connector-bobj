/**
 * @class
 */
var fx_bobj_CeProperties = (function() {

    /**
     * Maps CE property IDs to CE property names.
     * Initialized by function init_ce_properties,
     * never cleaned up.
     *
     * @type {java.util.HashMap} - property bag with
     * Keys:   Property ID   (java.lang.Integer)
     * Values: Property Name (java.lang.String)
     */
    var go_ce_properties = null;

    /**
     * Used to convert java.util.Date instances
     * to Strings using ISO8601 format.
     *
     * Initialized by function fxi_bobj_ce_properties_impl,
     * never cleaned up. Used by function get_formatted_value.
     *
     * @type {java.text.SimpleDateFormat}
     */
    var go_date_format = null;

    var go_result = {

        /**
         * Checks whether a CE property is exportable or not,
         * i.e. whether it is property whose name is documented
         * via SDK class CePropertyID and whether it is not
         * a container, i.e. a property bag that contains
         * other properties in turn.
         *
         * @param {com.crystaldecisions.sdk.properties.IProperties} io_props
         * @param {java.lang.Object} io_key
         * @return {boolean} true if io_key is exportable, false otherwise
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
         * Returns the property value for the key io_key.
         * If io_key corresponds to one of the CE properties
         * whose values are known to have type java.util.Date,
         * this method will convert the Date into an ISO8601
         * string representation of that java.util.Date object.
         *
         * Uses global variable go_date_format
         * Uses com.crystaldecisions.sdk.occa.infostore.CePropertyID
         *
         * @param {com.crystaldecisions.sdk.properties.IProperties} io_props
         * @param {java.lang.Object} io_key
         * @return {java.lang.String} property value corresponding to io_key
         *         or null
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
         * Get property name from property ID.
         * @param {java.lang.Object} - iv_property_id
         * @return {java.lang.String} - property name
         */
        getName: function(iv_property_id)
        {
            return go_ce_properties.get(iv_property_id);
        }//get

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
        var SCRIPT = "fx_bobj_CeProperties=>class_init: ";
        fx_trace(SCRIPT+"Entering");

        importClass(Packages
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

    }//class_init

    class_init();

    return go_result;

})();