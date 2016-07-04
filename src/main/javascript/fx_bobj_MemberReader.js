/**
 * @class
 * @requires fx_trace
 * @requires fx_bobj_Session
 * @requires fx_bobj_CeProperties
 * @requires fx_JavaUtils
 */
var fx_bobj_MemberReader = (function() {

    /*
     function importClass(){}
     var Packages;
     function fx_trace(){}
     var fx_bobj_CeProperties;
     var CePropertyID;
     function fx_bobj_Session(){}
     var IUserGroup;
     var fx_JavaUtils;
     */

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
        var SCRIPT = "fx_bobj_api=>MemberReaderState: ";
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
         * Reads users and subgroups of all groups
         * from the BO CMS. Users that have neither
         * users nor subgroups will not be returned.
         *
         * @return {com.sap.idm.ic.DSEEntry} -
         *         Exactly one membership relation
         *         between a user group and one of its
         *         members.
         */
        read: function()
        {
            var SCRIPT = "fx_bobj_MemberReader=>read: ";
            fx_trace(SCRIPT+"Entering");

            var lo_dse_entry = null;

            if(go_state == null)
            {
                fx_trace(SCRIPT
                         + "Initial invocation,"
                         + " retrieving entries from CMS");


                var lv_query
                        = "select"
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

    /**
     * @private
     */
    function class_init()
    {
        importClass(Packages
                    .com.crystaldecisions.sdk.plugin.desktop.usergroup
                    .IUserGroup);
        importClass(Packages
                    .com.crystaldecisions.sdk.occa.infostore
                    .CePropertyID);
    }

    class_init();
    return go_result;

})();
