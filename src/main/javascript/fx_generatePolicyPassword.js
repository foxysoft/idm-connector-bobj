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

/* global fx_trace, fx_db_nolock, fx_JavaUtils, */

/**
 * <div>Generate random password compliant with IDM's password policy.</div>
 * <div>This function uses a subset of the password policy defined for
 * the current identity store, specifically minimum length, maximum
 * length, mixed case and mixed letters and numbers.</div>
 * <div>Use the following package constants (IDM 8.0) or global constants
 * (IDM 7.2) for additional customizing:</div>
 * <table>
 * <tr><th>Constant</th><th>Description</th></tr>
 * <tr><td>FX_PASSWORD_EXCLUDE_CHARS</td>
 *     <td>Characters that must never occur in passwords</td>
 * </tr>
 * <tr><td>FX_PASSWORD_INCLUDE_SPECIALS</td>
 *     <td>Special characters to include in passwords.
 *         If non-empty, at least one of these special
 *         characters will occur in every password.</td>
 * </tr>
 * </table>
 * @function
 * @return {string} - cleartext password or !ERROR-prefixed message
 * @requires fx_trace
 * @requires fx_db_nolock
 * @requires fx_JavaUtils
 */
var fx_generatePolicyPassword = (function() {

    var SCRIPT = "fx_generatePolicyPassword: ";

    var gv_initialized;
    var gv_mixed_char;
    var gv_char_numb;
    var gv_min_len;
    var gv_max_len;
    var gt_bytes;
    var gv_include_specials;
    var go_compat_api;

    function init()
    {
        var DEFAULT_PWD_LEN   = 8;

        // Java byte array of length 1
        // required by helper function next_random_uint
        gt_bytes = java.lang.reflect.Array.newInstance(
            java.lang.Byte.TYPE
            ,1
        );

        go_compat_api = fx_trace({compat:1.0});

        // Include special characters as per configuration
        gv_include_specials
            = go_compat_api.fx_getConstant("pck.FX_PASSWORD_INCLUDE_SPECIALS");
        fx_trace(SCRIPT+"gv_include_specials="+gv_include_specials);

        var lv_sql = "select"
                + "    min_len"
                + "    ,max_len"
                + "    ,MixedChar"
                + "    ,CharNumb "
                + "    from mxi_attributes" + fx_db_nolock()
                + "    where is_id=" + go_compat_api.fx_IDSID()
                + "    and attrname='MX_PASSWORD'"
        ;
        fx_trace(SCRIPT+"lv_sql="+lv_sql);

        var lv_sql_result = uSelect(
            lv_sql
            /*,RowSeparator*/
            /*,ColumnSeparator*/
        );
        if(lv_sql_result.indexOf("!ERROR") == -1
           && lv_sql_result != "")
        {
            fx_trace(SCRIPT+"lv_sql_result="+lv_sql_result);

            var lt_columns = lv_sql_result.split("|");

            // Minimum password length
            gv_min_len= parseInt(lt_columns[0], 10);
            if(isNaN(gv_min_len) || gv_min_len < 1)
            {
                gv_min_len = DEFAULT_PWD_LEN;
                fx_trace(SCRIPT+"Defaulted gv_min_len="+gv_min_len);
            }

            // Maximum password length
            gv_max_len = parseInt(lt_columns[1], 10);

            if(isNaN(gv_max_len))
            {
                gv_max_len = DEFAULT_PWD_LEN;
                fx_trace(SCRIPT+"Defaulted gv_max_len="+gv_max_len);
            }

            if(gv_max_len < gv_min_len)
            {
                fx_trace(SCRIPT
                         + "Adjusting invalid gv_max_len ("
                         + gv_max_len
                         + ") to "
                         + gv_min_len);
                gv_max_len = gv_min_len;
            }

            // Mixed case characters required?
            gv_mixed_char = lt_columns[2] == "1";

            // Digits required?
            gv_char_numb = lt_columns[3] == "1";

        }//if(lv_sql_result.indexOf("!ERROR") == -1 && ...
        else
        {
            throw new java.lang.Exception(
                "uSelect("+lv_sql+"): "+lv_sql_result
            );
        }

        gv_initialized = true;

    }//init

    function next_random_uint(
        io_random
        ,iv_modulus
    )
    {
        if(iv_modulus < 1
           || iv_modulus > 0xFF)
        {
            // This will typcially occur if configured password
            // maximum length is too small to accomodate all
            // required character classes
            throw new java.lang.Exception(
                "Invalid password policy: "
                    + "Max length="
                    + gv_max_len
                    + ", min lengh="
                    + gv_min_len
                    + ", mixed case="
                    + gv_mixed_char
                    + ", digits="
                    + gv_char_numb
                    + ", special characters="
                    + (gv_include_specials != "")
            );
        }

        io_random.nextBytes(gt_bytes);

        var lo_byte          = new java.lang.Byte(gt_bytes[0]);
        var lv_unsigned_int  = lo_byte.intValue() & 0xFF;
        return lv_unsigned_int % iv_modulus;

    }//next_random_uint

    function reserve_idx_for_char_class(
        io_random
        ,ct_available_indexes
        ,iv_char_class
        ,iv_not_idx_zero
    )
    {
        fx_trace(SCRIPT
                 +"Entry into reserve_idx_for_char_class:"
                 + " ct_available_indexes="+ct_available_indexes);

        var lv_reserved_idx = next_random_uint(
            io_random
            ,ct_available_indexes.length)
        ;

        if(lv_reserved_idx == 0 && iv_not_idx_zero)
        {
            fx_trace(SCRIPT
                     + "Need to correct randomly selected index "
                     + lv_reserved_idx
                     + " for character class "
                     + iv_char_class);

            if(ct_available_indexes.length > 1)
            {
                lv_reserved_idx = 1;
            }
            else
            {
                throw new java.lang.Exception(
                    "Password max. length"
                        + gv_max_len
                        + " to small"
                        + " to include character class "
                        + iv_char_class
                );
            }
        }//if(lv_reserved_idx == 0 && iv_not_idx_zero)
        var lv_result = ct_available_indexes[lv_reserved_idx];

        fx_trace(SCRIPT
                 + "Will include at least one "
                 + iv_char_class
                 + " at index "
                 + lv_result);

        // Arrays are passed by reference in JavaScript,
        // so our caller will see the modified array ==>
        // ct_available_indexes is a CHANGING parameter.
        ct_available_indexes.splice(lv_reserved_idx, 1);

        return lv_result;

    }//reserve_idx_for_char_class

    function fx_generatePolicyPasswordImpl()
    {
        fx_trace(SCRIPT+"Entering");
        var lv_result;

        try
        {

            if(!gv_initialized)
            {
                init();
            }

            var UPPER_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            var LOWER_CHARS = UPPER_CHARS.toLowerCase();
            var DIGITS      = "0123456789";

            var lo_random
                    = java.security.SecureRandom.getInstance(
                        "SHA1PRNG"
                    )
            ;
            fx_trace(SCRIPT+"lo_random="+lo_random);

            // Exclude characters and digits as per package constant
            var lv_exclude_chars
                    = go_compat_api.fx_getConstant("pck.FX_PASSWORD_EXCLUDE_CHARS");

            // Exclude characters and digits as per package constant
            var i;
            for(i=0; i < lv_exclude_chars.length;++i)
            {
                UPPER_CHARS = UPPER_CHARS.replace(lv_exclude_chars[i], "");
                LOWER_CHARS = LOWER_CHARS.replace(lv_exclude_chars[i], "");
                DIGITS = DIGITS.replace(lv_exclude_chars[i], "");
            }

            var lt_pwd_chars_idx  = [];
            var lt_pwd_chars_data = [];

            // Always use generate passwords with the configure
            // MAXIMUM length. Minimum length will be ignored.
            for(i=0; i < gv_max_len; ++i)
            {
                lt_pwd_chars_idx.push(i);
                lt_pwd_chars_data.push(null);
            }

            // Note that because special characters have a bias
            // regarding WHERE they may occur (not at index 0),
            // their reservation must be done FIRST, before all
            // other character classes. That's because if you have
            // a small maximum length (e.g. 2) and another character
            // class, such as lower case, already reserves index 1,
            // the password generation would fail because the only
            // remaining index for special chars would be 0, which
            // is not allowed.
            if(gv_include_specials != "")
            {
                // Special characters must not occur at index zero
                // because ABAP can't handle ? or ! at first position.
                // To this end, we call the helper method with an
                // optional fourth argument here.
                var lv_special_char_idx = reserve_idx_for_char_class(
                    lo_random
                    ,lt_pwd_chars_idx
                    ,"special character"
                    ,true //not at index zero
                );

                lt_pwd_chars_data[lv_special_char_idx]
                    = gv_include_specials[next_random_uint(
                        lo_random
                        ,gv_include_specials.length
                    )];
            }//if(gv_include_specials != "")
            else
            {
                // If none specified, passwords will
                // NOT include special chars
                fx_trace(SCRIPT
                         + "Package constant FX_PASSWORD_INCLUDE_SPECIALS"
                         + " is empty => passwords will not include"
                         + " any special characters");
            }

            // Password will ALWAYS include at least on lower case char
            var lv_lower_char_idx = reserve_idx_for_char_class(
                lo_random
                ,lt_pwd_chars_idx
                ,"lower-case character"
            );

            lt_pwd_chars_data[lv_lower_char_idx]
                = LOWER_CHARS[next_random_uint(
                    lo_random
                    ,LOWER_CHARS.length
                )];

            if(gv_mixed_char)
            {
                var lv_upper_char_idx = reserve_idx_for_char_class(
                    lo_random
                    ,lt_pwd_chars_idx
                    ,"upper-case character"
                );

                lt_pwd_chars_data[lv_upper_char_idx]
                    = UPPER_CHARS[next_random_uint(
                        lo_random
                        ,UPPER_CHARS.length
                    )];
            }//if(gv_mixed_char)

            if(gv_char_numb)
            {
                var lv_digit_idx = reserve_idx_for_char_class(
                    lo_random
                    ,lt_pwd_chars_idx
                    ,"digit"
                );

                lt_pwd_chars_data[lv_digit_idx]
                    = DIGITS[next_random_uint(
                        lo_random
                        ,DIGITS.length
                    )];
            }//if(gv_char_numb)

            var lv_all_possible_chars;

            for(i=0; i < lt_pwd_chars_idx.length; ++i)
            {
                if(i==0)
                {
                    lv_all_possible_chars = LOWER_CHARS;

                    if(gv_mixed_char)
                    {
                        lv_all_possible_chars += UPPER_CHARS;
                    }
                    if(gv_char_numb)
                    {
                        lv_all_possible_chars += DIGITS;
                    }

                    fx_trace(SCRIPT
                             + "First round alphabet: "
                             + lv_all_possible_chars);

                }//if(i==0)

                // Index 0 must not be a special character,
                // so include special characters in alphabet
                // only from index 1 on
                if(i==1)
                {
                    lv_all_possible_chars += gv_include_specials;

                    fx_trace(SCRIPT
                             + "Subsequent rounds alphabet: "
                             + lv_all_possible_chars);
                }//if(i==0)

                // Fill up remaining password characters
                lt_pwd_chars_data[lt_pwd_chars_idx[i]]
                    = lv_all_possible_chars[
                        next_random_uint(
                            lo_random
                            ,lv_all_possible_chars.length
                        )
                    ];

            }//for(i=0; i < lt_pwd_chars_idx.length; ++i)

            lv_result = lt_pwd_chars_data.join("");

        }//try
        catch(lo_exception)
        {
            lv_result = fx_JavaUtils.handleException(
                SCRIPT
                ,lo_exception
            );
        }

        fx_trace(SCRIPT+"Returning "+lv_result);
        return lv_result;

    }//fx_generatePolicyPasswordImpl

    return fx_generatePolicyPasswordImpl;

})();
