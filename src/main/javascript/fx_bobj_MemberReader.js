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

/* global fx_trace, fx_bobj_CeProperties, CePropertyID, fx_bobj_ReaderUtils
 *        fx_JavaUtils, IUserGroup, fx_bobj_Session */

/**
 * Read all available BOBJ group members during initial load.
 * @class
 * @requires fx_trace
 * @requires fx_bobj_Session
 * @requires fx_bobj_CeProperties
 * @requires fx_JavaUtils
 * @requires fx_bobj_ReaderUtils
 * @since 1.0.0
 */
var fx_bobj_MemberReader = (function() {
    /**
     * Indicates whether static class members have been initialized
     * or not. Each public method must first check this and call
     * class_init() if it's false. Set to true by class_init().
     */
    var gv_initialized = false;

    /**
     * Internal state of read(). Initialized and cleaned up by read().
     * @type {MemberReaderState}
     */
    var go_state = null;

    /**
     * @constructor
     */
    function MemberReaderState(io_info_objects)
    {
        var SCRIPT = "fx_bobj_MemberReader=>MemberReaderState: ";
        fx_trace(SCRIPT+"Entering");

        this.m_groups_iterator = io_info_objects.iterator();
        this.m_next_group = null;
        this.m_users_iterator = null;
        this.m_subgroups_iterator = null;

        fx_trace(SCRIPT+"Returning");
    }

    MemberReaderState.prototype.next = function()
    {
        var SCRIPT = "fx_bobj_MemberReader=>MemberReaderState.next: ";
        fx_trace(SCRIPT+"Entering");

        var lo_result = null;
        var lo_member_id = null;
        var lo_key = null;
        var lo_set = null;

        while(true)
        {
            if(this.m_users_iterator != null
               && this.m_users_iterator.hasNext())
            {
                fx_trace(SCRIPT+"Have more user members");
                lo_member_id = this.m_users_iterator.next();

                lo_key = fx_bobj_CeProperties.getName(
                    CePropertyID.SI_GROUP_MEMBERS
                );

                lo_result = fx_bobj_ReaderUtils.infoObjectToDseEntry(
                    this.m_next_group
                    ,lo_key
                    ,lo_member_id
                );
                break; //====================== EXIT WHILE
            }
            else if(this.m_subgroups_iterator != null
                    && this.m_subgroups_iterator.hasNext())
            {
                fx_trace(SCRIPT+"Have more subgroup members");
                lo_member_id = this.m_subgroups_iterator.next();

                lo_key = fx_bobj_CeProperties.getName(
                    CePropertyID.SI_SUBGROUPS
                );

                lo_result = fx_bobj_ReaderUtils.infoObjectToDseEntry(
                    this.m_next_group
                    ,lo_key
                    ,lo_member_id
                );
                break; //====================== EXIT WHILE
            }
            else if(this.m_groups_iterator != null
                    && this.m_groups_iterator.hasNext())
            {
                fx_trace(SCRIPT+"Have more groups");

                this.m_next_group
                    = this.m_groups_iterator.next();
                fx_trace(SCRIPT+"(Re-)initialized GROUP object");

                lo_set = fx_JavaUtils.callByReflection(
                    this.m_next_group
                    ,"getUsers"
                );
                this.m_users_iterator = lo_set.iterator();
                fx_trace(SCRIPT+"(Re-)Initialized USER members iterator");

                lo_set = fx_JavaUtils.callByReflection(
                    this.m_next_group
                    ,"getSubGroups"
                );
                this.m_subgroups_iterator = lo_set.iterator();
                fx_trace(SCRIPT
                         +"(Re-)Initialized SUBGROUP members iterator");
            }
            else
            {
                fx_trace(SCRIPT+"Finished");
                break; //====================== EXIT WHILE
            }
        }//while(true)

        fx_trace(SCRIPT+"Returning");
        return lo_result;
    };

    var go_result = {
        /**
         * Retrieves next BOBJ group member, if any, during initial load.
         * @function
         * @public
         * @name fx_bobj_MemberReader.read
         * @returns {com.sap.idm.ic.DSEEntry?} - IDM entry or null
         *          if no more members
         */
        read: function()
        {
            if(!gv_initialized)
            {
                class_init();
            }
            var SCRIPT = "fx_bobj_MemberReader=>read: ";
            fx_trace(SCRIPT+"Entering");

            var lo_dse_entry = null;

            if(go_state == null)
            {
                fx_trace(SCRIPT
                         + "Initial invocation,"
                         + " retrieving entries from CMS");

                // Get count of matching objects first for subsequent TOP N clause
                var lv_count_query
                        = "select"
                        + "    COUNT(SI_ID)"
                        + "    FROM CI_SYSTEMOBJECTS"
                        + "    where SI_KIND='" + IUserGroup.KIND + "'"
                ;

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
                        = "select TOP " + lv_id_count
                        + "    SI_ID"
                        + "    ,SI_NAME"
                        + "    ,SI_GROUP_MEMBERS"
                        + "    ,SI_SUBGROUPS"
                        + "    from CI_SYSTEMOBJECTS"
                        + "    where SI_KIND='" + IUserGroup.KIND + "'"
                ;
                fx_trace(SCRIPT+"lv_query="+lv_query);

                var lo_info_objects
                        = fx_bobj_Session.getInfoStore().query(lv_query)
                ;

                fx_trace(SCRIPT
                         + "Result set has "
                         + lo_info_objects.size()
                         + " entries");

                go_state = new MemberReaderState(lo_info_objects);

            }//if(go_state == null)

            lo_dse_entry = go_state.next();

            if(lo_dse_entry == null)
            {
                fx_trace(SCRIPT+"All entries processed, cleaning up");
                go_state = null;
            }

            fx_trace(SCRIPT+"Returning "+lo_dse_entry);
            return lo_dse_entry;

        }//read

    }//go_result
    ;

    function class_init()
    {
        importClass(Packages
                    .com.crystaldecisions.sdk.plugin.desktop.usergroup
                    .IUserGroup);
        importClass(Packages
                    .com.crystaldecisions.sdk.occa.infostore
                    .CePropertyID);

        gv_initialized = true;
    }//class_init

    // Static initialization at script load time has issues in SAP IDM.
    // Avoid it where possible, and use lazy initialization instead.
    // ===== DON'T TRY THIS =====
    // class_init()
    // ==========================
    return go_result;

})();
