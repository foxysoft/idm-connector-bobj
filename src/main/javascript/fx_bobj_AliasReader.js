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

/* global fx_trace, fx_JavaUtils, fx_bobj_ReaderUtils, CePropertyID
 *        IUserGroup, IUser, fx_bobj_Session */

/**
 * Read all available BOBJ user and group aliases during initial load.
 * @class
 * @requires fx_JavaUtils
 * @requires fx_bobj_ReaderUtils
 * @requires fx_bobj_Session
 * @requires fx_trace
 * @since 1.0.0
 */
var fx_bobj_AliasReader = (function() {
    /**
     * Indicates whether static class members have been initialized
     * or not. Each public method must first check this and call
     * class_init() if it's false. Set to true by class_init().
     */
    var gv_initialized = false;

    /**
     * Internal state of function read(). Initialized and cleaned up
     * by function read():
     * @type {AliasReaderState}
     */
    var go_state = null;

    /** @constructor */
    function AliasReaderState(io_info_objects)
    {
        var SCRIPT = "fx_bobj_AliasReader=>AliasReaderState: ";
        fx_trace(SCRIPT+"Entering");

        /**
         * A heterogeneous info object collection of IUser instances
         * and IUserGroup instances.
         * @type {java.util.Iterator<
         *     com.crystaldecisions.sdk.occa.infostore.IInfoObject
         * >}
         */
        this.m_info_objects_iterator = io_info_objects.iterator();

        /**
         * The result of the last call to m_info_objects_iterator.next()
         * @type {com.crystaldecisions.sdk.occa.infostore.IInfoObject}
         */
        this.m_next_info_object = null;

        /**
         * A nested property bag stored in m_next_info_object,
         * under key SI_ALIASES. This nested property bag contains
         * all the aliases of this info object.
         * @type {com.crystaldecisions.sdk.properties.IProperties}
         */
        this.m_aliases = null;

        /**
         * Iterator over map entries from m_aliases
         * @type {java.util.Iterator<
         *            java.util.Map.Entry<
         *                java.lang.Integer
         *                ,com.crystaldecisions.sdk.properties.IProperty
         *            >
         *        >}
         */
        this.m_aliases_iterator = null;

        fx_trace(SCRIPT+"Returning");

    }//AliasReaderState

    AliasReaderState.prototype.next = function()
    {
        var SCRIPT = "fx_bobj_AliasReader=>AliasReaderState.next: ";
        fx_trace(SCRIPT + "Entering");

        var lo_result              = null;

        var lo_aliases_entry       = null;
        var lo_aliases_entry_key   = null;
        var lo_aliases_entry_value = null;

        var lo_alias_properties    = null;
        var lt_arg_types           = null;
        var lt_arg_values          = null;

        while (true)
        {
            if (this.m_aliases_iterator != null
                && this.m_aliases_iterator.hasNext())
            {

                lo_aliases_entry = this.m_aliases_iterator.next();
                fx_trace(SCRIPT+"Have next aliases entry? "
                         + (lo_aliases_entry != null));

                // lo_aliases_entry_value = lo_aliases_entry.getValue();
                lo_aliases_entry_value
                    = fx_JavaUtils.callByReflection(
                        lo_aliases_entry
                        , "getValue"
                    );

                fx_trace(SCRIPT+"Have value of next aliases entry? "
                         +(lo_aliases_entry_value != null));

                if (lo_aliases_entry_value.isContainer())
                {
                    fx_trace(SCRIPT + "Have more aliases");

                    lo_result = fx_bobj_ReaderUtils.infoObjectToDseEntry(
                        this.m_next_info_object, null, null);

                    // lo_aliases_entry_key = lo_aliases_entry.getKey();
                    lo_aliases_entry_key
                        = fx_JavaUtils.callByReflection(
                            lo_aliases_entry
                            , "getKey"
                        );

                    fx_trace(SCRIPT+"Have key of next aliases entry? "
                             +(lo_aliases_entry_key != null));

                    // lo_alias_properties = this.m_aliases
                    // .getProperties(lo_aliases_entry_key);

                    // Argument type of getProperties: java.lang.Object
                    lt_arg_types = fx_JavaUtils.newArray(
                        java.lang.Class    //no .class suffix in JS
                        , java.lang.Object //no .class suffix in JS
                    );
                    fx_trace(SCRIPT+"Have argument types array? "
                             + (lt_arg_types != null));

                    // Argument value of getProperties: lo_aliases_entry_key
                    lt_arg_values = fx_JavaUtils.newArray(
                        java.lang.Object //no .class suffix in JS
                        , lo_aliases_entry_key
                    );
                    fx_trace(SCRIPT+"Have argument values array? "
                             + (lt_arg_values != null));

                    lo_alias_properties = fx_JavaUtils.callByReflection(
                        this.m_aliases
                        ,"getProperties"
                        ,lt_arg_types
                        ,lt_arg_values
                    );

                    fx_trace(SCRIPT
                             + "Obtained property bag for key "
                             + lo_aliases_entry_key
                             + "? "
                             + (lo_alias_properties != null));

                    var lo_alias_id = lo_alias_properties
                            .getString(CePropertyID.SI_ID);

                    lo_result.put("FX_ALIASES_SI_ID", lo_alias_id);

                    var lo_alias_name = lo_alias_properties
                            .getString(CePropertyID.SI_NAME);

                    lo_result.put("FX_ALIASES_SI_NAME", lo_alias_name);

                    var lo_alias_disabled = lo_alias_properties
                            .getString(CePropertyID.SI_DISABLED);

                    lo_result.put("FX_ALIASES_SI_DISABLED",
                                  lo_alias_disabled);
                    break; // ============================= EXIT WHILE
                }
            }//if (this.m_aliases_iterator != null ...

            else if (this.m_info_objects_iterator != null
                     && this.m_info_objects_iterator.hasNext())
            {
                fx_trace(SCRIPT + "Have more info objects");

                this.m_next_info_object = this.m_info_objects_iterator
                    .next();

                fx_trace(SCRIPT
                         + "(Re-)initialized INFO OBJECT object");

                var lo_info_object_props = this.m_next_info_object
                        .properties();

                fx_trace(SCRIPT + "Have info object property bag? "
                         + (lo_info_object_props != null));

                this.m_aliases = lo_info_object_props
                    .getProperties(CePropertyID.SI_ALIASES);

                fx_trace(SCRIPT
                         + "(Re-)initialized ALIASES property bag"
                         + " for current info object");

                this.m_aliases_iterator = this.m_aliases.entrySet()
                    .iterator();

                fx_trace(SCRIPT + "(Re-)Initialized ALIASES iterator"
                         + " for current info object");

            }//else if (this.m_info_objects_iterator != null ...

            else
            {
                fx_trace(SCRIPT + "Finished");
                break; // ================================= EXIT WHILE
            }
        }// while(true)

        fx_trace(SCRIPT + "Returning");
        return lo_result;

    };

    var go_result = {
        /**
         * Retrieve next BOBJ user or group alias, if any.
         * @function
         * @public
         * @name fx_bobj_AliasReader.read
         * @see fx_bobj_nextAliasEntry
         * @returns {com.sap.idm.ic.DSEEntry?} - IDM entry
         *          or null if no more aliases
         */
        read: function()
        {
            if(!gv_initialized)
            {
                class_init();
            }
            var SCRIPT = "fx_bobj_AliasReader=>read: ";

            fx_trace(SCRIPT + "Entering");

            var lo_dse_entry = null;

            if (go_state == null) {
                fx_trace(SCRIPT
                         + "Initial invocation,"
                         + " retrieving entries from CMS");

                // Get count of matching objects first for subsequent TOP N clause
                var lv_count_query
                        = "select"
                        + "    COUNT(SI_ID)"
                        + "    from CI_SYSTEMOBJECTS"
                        + "    where SI_KIND in ('"
                        + IUserGroup.KIND
                        + "', '"
                        + IUser.KIND
                        + "')";

                var lo_count_info_objects
                        = fx_bobj_Session.getInfoStore().query(lv_count_query)
                ;
                var lo_count_info_object = lo_count_info_objects.get(0);

                var lo_counts_properties
                        = lo_count_info_object.properties().getProperties("SI_AGGREGATE_COUNT")
                ;
                var lv_id_count = lo_counts_properties.getInt("SI_ID");
                fx_trace(SCRIPT+"lv_id_count="+lv_id_count);

                // Apply TOP N clause to avoid implicit limit of 1000 entries
                // Note that even TOP 0 is legal syntax on BOE/SQL Anywhere
                var lv_query
                        = "select TOP "+lv_id_count
                        + "    SI_ID "
                        + "    ,SI_NAME"
                        + "    ,SI_ALIASES"
                        + "    from CI_SYSTEMOBJECTS"
                        + "    where SI_KIND in ('"
                        + IUserGroup.KIND
                        + "', '"
                        + IUser.KIND
                        + "')";

                fx_trace(SCRIPT + "lv_query=" + lv_query);

                var lo_info_objects
                        = fx_bobj_Session.getInfoStore().query(lv_query)
                ;

                fx_trace(SCRIPT
                         + "Result set has "
                         + lo_info_objects.size()
                         + " entries");

                go_state = new AliasReaderState(lo_info_objects);

            }// if(go_state == null)

            lo_dse_entry = go_state.next();

            if (lo_dse_entry == null) {
                fx_trace(SCRIPT + "All entries processed, cleaning up");
                go_state = null;
            }

            fx_trace(SCRIPT + "Returning " + lo_dse_entry);
            return lo_dse_entry;

        }//read()

    }//go_result
    ;

    function class_init()
    {
        importClass(Packages
                    .com.crystaldecisions.sdk.occa.infostore
                    .CePropertyID);
        importClass(Packages
                    .com.crystaldecisions.sdk.plugin.desktop.user
                    .IUser);
        importClass(Packages
                    .com.crystaldecisions.sdk.plugin.desktop.usergroup
                    .IUserGroup);

        gv_initialized = true;
    }//class_init

    // Static initialization at script load time has issues in SAP IDM.
    // Avoid it where possible, and use lazy initialization instead.
    // ===== DON'T TRY THIS =====
    // class_init()
    // ==========================
    return go_result;

})();
