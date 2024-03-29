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

/* global fx_trace, fx_bobj_Session, IUserGroup, fx_JavaUtils, IUser */

/**
 * Data manipulation functions for BOBJ groups
 * @class
 * @requires fx_trace
 * @requires fx_bobj_Session
 * @requires fx_JavaUtils
 * @since 1.0.0
 */
var fx_bobj_Group = (function() {
    /**
     * Indicates whether static class members have been initialized
     * or not. Each public method must first check this and call
     * class_init() if it's false. Set to true by class_init().
     */
    var gv_initialized = false;

    var go_result = {
        /**
         * Add/remove user members to a BOBJ group.
         * @public
         * @function
         * @name fx_bobj_Group.modifyGroupMembers
         * @param {com.sap.idm.ic.DSEEntry} io_entry - IDM entry
         * <pre>IO_ENTRY ::= {
         * SI_NAME:             Group name (<strong>mandatory</strong>)
         * SI_GROUP_MEMBERS:    &lt;DELTA_STRING&gt;
         * }
         *
         * &lt;DELTA_STRING&gt;  ::= [&lt;OPERATOR_SPEC&gt;]&lt;USER_ID&gt;
         *                     [|[&lt;OPERATOR_SPEC&gt;]&lt;USER_ID&gt;]...
         * &lt;USER_ID&gt;       ::= User login ID (=SI_NAME of user)
         * &lt;OPERATOR_SPEC&gt; ::= {&lt;OPERATOR&gt;}
         * &lt;OPERATOR&gt;      ::= A|D
         * </pre>
         * <p>As usual, {A} means "add member", {D} means "remove member".
         * If &lt;OPERATOR_SPEC&gt; is omitted, the default is {A}.</p>
         * <div>Example:</div>
         * <pre>
         * IO_ENTRY ::= {
         * SI_NAME: Cryptographic Officers
         * SI_GROUP_MEMBERS: {D}JOHNDOE|{A}JANEDOE
         * </pre>
         * will remove the user whose login ID (SI_NAME) is JOHNDOE
         * from group Cryptographic Officers, and add user JANEDOE
         * to that group.
         * @throws {java.lang.Exception}
         */
        modifyMembers: function(io_entry)
        {
            if(!gv_initialized)
            {
                class_init();
            }
            var SCRIPT = "fx_bobj_Group=>modifyMembers: ";
            fx_trace(SCRIPT+"Entering io_entry="+io_entry);

            var lo_si_name = io_entry.get("SI_NAME");
            if(lo_si_name == null)
            {
                throw new java.lang.Exception(
                    "Missing mandatory parameter SI_NAME"
                );
            }

            /**
             * @type {com.crystaldecisions.sdk.occa.infostore.IInfoObjects}
             */
            var lo_to_modify_info_objects
                    = fx_bobj_Session.lookupSingleInfoObject(
                        lo_si_name
                        ,IUserGroup.KIND
                        ,"SI_GROUP_MEMBERS"
                    );

            /**
             * @type {
             * com.crystaldecisions.sdk.plugin.desktop.usergroup.IUserGroup
             * }
             */
            var lo_to_modify = lo_to_modify_info_objects.get(0);

            /** @type {java.lang.String} */
            var lo_si_group_members
                    = io_entry.get("SI_GROUP_MEMBERS");

            if(lo_si_group_members != null)
            {
                /** @type {java.util.Set<java.lang.Integer>} */
                var lo_current_members = fx_JavaUtils.callByReflection(
                    lo_to_modify
                    ,"getUsers"
                );

                fx_trace(SCRIPT
                         + "Have current members? "
                         + (lo_current_members != null));

                /** @type {string[]}*/
                var lt_si_group_members
                        = ("" + lo_si_group_members).split("|");

                for(var i=0;i<lt_si_group_members.length;++i)
                {
                    var lv_si_group_member   = lt_si_group_members[i];
                    var lv_operation         = null;
                    var lv_group_member_name = null;
                    var lv_operation_result  = null;

                    if(lv_si_group_member.indexOf("{A}") == 0)
                    {
                        lv_operation = "{A}";
                        lv_group_member_name
                            = lv_si_group_member
                            .substring("{A}".length);

                        fx_trace(SCRIPT
                                 + "Will ADD group member "
                                 + lv_group_member_name
                                 + " to "
                                 + lo_si_name);
                    }
                    else if(lv_si_group_member.indexOf("{D}") == 0)
                    {
                        lv_operation = "{D}";
                        lv_group_member_name
                            = lv_si_group_member
                            .substring("{D}".length);

                        fx_trace(SCRIPT
                                 + "Will REMOVE group member "
                                 + lv_group_member_name
                                 + " from "
                                 + lo_si_name);
                    }
                    else
                    {
                        // Default operation is ADD {A}
                        lv_operation = "{A}";
                        lv_group_member_name = lv_si_group_member;
                        fx_trace(SCRIPT
                                 + "Will ADD group member "
                                 + lv_group_member_name
                                 + " to "
                                 + lo_si_name);
                    }

                    /**
                     * @type {
                     * com.crystaldecisions.sdk.occa.infostore.IInfoObjects
                     * }
                     */
                    var lo_group_member_info_objects
                            = fx_bobj_Session.lookupSingleInfoObject(
                                lv_group_member_name
                                ,IUser.KIND
                            );

                    /**
                     * @type {
                     * com.crystaldecisions.sdk.plugin.desktop.user.IUser
                     * }
                     */
                    var lo_group_member
                            = lo_group_member_info_objects.get(0);

                    fx_trace(SCRIPT
                             + "Have group member object? "
                             + (lo_group_member != null));

                    var lo_group_member_id = fx_JavaUtils.callByReflection(
                        lo_group_member
                        ,"getID"
                    );

                    fx_trace(SCRIPT
                             + "lo_group_member_id="
                             + lo_group_member_id);

                    if(lv_operation == "{A}")
                    {
                        // ========== IMPORTANT ==========
                        // must pass ID to add() method,
                        // not user object as a whole
                        // ===============================
                        lv_operation_result
                            = lo_current_members.add(lo_group_member_id);
                    }
                    else
                    {
                        // ========== IMPORTANT ==========
                        // must pass ID to remove() method,
                        // not user object as a whole
                        // ===============================
                        lv_operation_result
                            = lo_current_members.remove(lo_group_member_id);
                    }
                    fx_trace(SCRIPT
                             + lo_si_name
                             + ": "
                             + lv_operation
                             + lv_group_member_name
                             + " returned "
                             + lv_operation_result);

                }//for(var i=0;i<lt_si_group_members.length;++i)

            }//if(lo_si_group_members != null)

            fx_trace(SCRIPT + "Before commit");

            fx_bobj_Session.getInfoStore().commit(lo_to_modify_info_objects);

            fx_trace(SCRIPT+"Returning");

        }//modifyMembers
    }//go_result
    ;

    function class_init()
    {
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
