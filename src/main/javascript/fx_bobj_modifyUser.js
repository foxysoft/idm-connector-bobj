/**
 * Modify a BusinessObjects user
 * @param {com.sap.idm.ic.DSEEntry} io_entry -
 *        Destination arguments of toGeneric pass
 *
 * @return {string} - empty on success, or error message
 * prefixed with !ERROR on failure
 * @throws java.lang.Exception
 * @requires fx_trace
 * @requires fx_bobj_Session
 * @requires fx_bobj_CeProperties
 * @requires fx_bobj_JavaUtils
 */
var fx_bobj_modifyUser = (function() {
    /*
     function fx_trace(){}
     var fx_bobj_Session;
     var fx_bobj_CeProperties;
     var fx_JavaUtils;
     function importClass(){}
     var Packages;
     var IUser;
     var IUserGroup;
     var CePropertyID;
     */
    function fx_bobj_modifyUserImpl(io_entry)
    {
        var SCRIPT = "fx_bobj_modifyUser: ";
        fx_trace(SCRIPT+"Entering io_entry="+io_entry);

        var lv_result = "";

        var lo_si_name = io_entry.get("SI_NAME");
        if(lo_si_name == null)
        {
            throw new java.lang.Exception(
                "Missing mandatory parameter SI_NAME"
            );
        }

        var lo_si_kind = io_entry.get("SI_KIND");
        if(lo_si_kind == null)
        {
            throw new java.lang.Exception(
                "Missing mandatory parameter SI_KIND"
            );
        }

        var lo_additional_props
                = fx_bobj_CeProperties.getName(
                    CePropertyID.SI_GROUP_MEMBERS
                );

        /**
         * IInfoObjects
         */
        var lo_to_modify_info_objects
                = fx_bobj_Session.lookupSingleInfoObject(
                    lo_si_name
                    ,lo_si_kind
                    ,lo_additional_props
                );

        /**
         * IUserGroup
         */
        var lo_to_modify = lo_to_modify_info_objects.get(0);

        var lo_si_group_members
                = io_entry.get("SI_GROUP_MEMBERS");

        if(lo_si_group_members != null)
        {
            //Comparison using == doesn't work
            if(lo_si_kind.equals(IUserGroup.KIND))
            {
                fx_trace(SCRIPT
                         + "Modifying SI_GROUP_MEMBERS="
                         + lo_si_group_members);
            }
            else
            {
                throw new java.lang.Exception(
                    "SI_GROUP_MEMBERS is not a valid attribute"
                        + " for SI_KIND="
                        + lo_si_kind
                );
            }

            /**
             * java.util.Set<java.lang.Integer>
             */
            var lo_current_members = fx_JavaUtils.callByReflection(
                lo_to_modify
                ,"getUsers"
            );

            fx_trace(SCRIPT
                     + "Have current members? "
                     + (lo_current_members != null));

            var lt_si_group_members
                    = ("" + lo_si_group_members).split("|")
            ;
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
                    lv_operation = "{A}";
                    lv_group_member_name = lv_si_group_member;
                    fx_trace(SCRIPT
                             + "Will ADD group member "
                             + lv_group_member_name
                             + " to "
                             + lo_si_name);
                }

                // IInfoObjects
                var lo_group_member_info_objects
                        =
                        fx_bobj_Session.lookupSingleInfoObject(
                            lv_group_member_name
                            ,IUser.KIND
                        );

                // IUser

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

        fx_trace(SCRIPT + "Committing info objects to modify");

        fx_bobj_Session.getInfoStore().commit(lo_to_modify_info_objects);

        fx_trace(SCRIPT+"Returning "+lv_result);
        return lv_result;

    }//fx_bobj_modifyUserImpl

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
    }

    class_init();
    return fx_bobj_modifyUserImpl;

})();
