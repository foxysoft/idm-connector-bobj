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
 * Utility functions for scripting the Java language from JavaScript
 * @class 
 * @requires fx_trace
 * @since 1.0.0
 */
var fx_JavaUtils = (function() {

    var go_result = {
        /**
         * Invoke a Java method by means of reflection.
         * @function
         * @public
         * @name fx_JavaUtils.callByReflection
         * @param {?java.lang.Object} io_object -
         *        Java object instance to invoke method on.
         *        May be null.
         *
         * @param {string} iv_method_name -
         *        Method name, such as "getUsers"
         *
         * @param {java.lang.Class[]} [it_arg_types] -
         *        Java array of classes represeting the argument
         *        types of method iv_method_name. If iv_method_name
         *        doesn't have any parameters, you can omit this or
         *        supply null.
         *
         * @param {java.lang.Object[]} [it_arg_values] -
         *        Java array of objects representing the argument
         *        values of method iv_method_name. If iv_method_name
         *        doesn't have any parameter, you can omit this or
         *        supply null.
         *
         * @return {?java.lang.Object} -
         *         Return value of iv_method_name,
         *         or null for void methods.
         *
         * @throws {java.lang.Exception}
         */
        callByReflection: function(
            io_object
            , iv_method_name
            , it_arg_types
            , it_arg_values
        )
        {
            var SCRIPT = "fx_JavaUtils=>callByReflection: ";

            // it_arg_types is an optional parameter; if not
            // supplied, the runtime value will be undefined.
            // Rhino will NOT implicitly convert undefined
            // to Java null when passing this value to any
            // Java method, so we need to do this explicitly.
            var lt_arg_types
                    = (typeof it_arg_types != "undefined")
                    ? it_arg_types
                    : null
            ;

            if(lt_arg_types != null)
            {
                for(var i=0;i<lt_arg_types.length;++i)
                {
                    fx_trace(SCRIPT+"lt_arg_types["+i+"]="+lt_arg_types[i]);
                }
            }

            // Same situation as for it_arg_types. See comment above.
            var lt_arg_values
                    = (typeof it_arg_values != "undefined")
                    ? it_arg_values
                    : null
            ;

            // Note that we must use getMethod() to get ANY method,
            // no matter whether it's declared by io_object's
            // class or any of its super classes.
            // Using getDeclaredMethod() would be incorrect,
            // as this doesn't return any inherited methods.
            var lo_method = io_object.getClass().getMethod(
                iv_method_name
                , lt_arg_types
            );
            fx_trace(SCRIPT + "lo_method=" + lo_method);

            // Unless the method is explicitly set to accessible,
            // invocation will result in java.lang.IllegalAccessException
            // It's not exactly clear why this is the case, as the
            // methods used here are exposed via interfaces and thus
            // should be accessible anyway.
            lo_method.setAccessible(true);

            var lo_result = lo_method.invoke(
                io_object
                , lt_arg_values
            );

            // Don't invoke toString() method of lo_result, as this
            // can result in problems for some classes of the BOBJ SDK.
            // On example of such buggy toString() implementations is
            // com.crystaldecisions.sdk.plugin.desktop.user.IUserAlias,
            // whose toString() method throws java.lang.NullPointerException
            // for newly created aliases.
            return lo_result;

        },// callByReflection

        /**
         * <div>Create a new Java array.</div>
         * <div>This will create a one-dimensional Java array of type 
         * io_array_type and populate it with the elements of it_elements.</div>
         * <p>Example: to create a Java array of two Java Strings
         * "this" and "that", use:</p>
         * <pre>
         * var lt_this_and_that = fx_JavaUtils.newArray(
         *     java.lang.String.class
         *     , "this"
         *     , "that"
         * );
         * </pre>
         * @function
         * @public
         * @name fx_JavaUtils.newArray
         * @param {java.lang.Class} io_array_type -
         *        Class (or type) of all arrays elements
         *
         * @param {...java.lang.Object} [io_array_element] -
         *        Zero or more elements that the new array should be
         *        populated with. The number of actual parameters supplied
         *        for io_array_element will be the length of the new array.
         *
         * @return {java.lang.Object[]} - new Java array
         */
        newArray: function(io_array_type, io_array_element)
        {
            var SCRIPT = "fx_JavaUtils=>newArray: ";
            fx_trace(SCRIPT+"Entering");

            //https://developer.mozilla.org
            //      /de/docs/Web/JavaScript/Reference/Functions/arguments
            var lo_array_type = arguments[0];
            fx_trace(SCRIPT+"lo_array_type="+lo_array_type);

            var lv_num_elements = arguments.length - 1;
            fx_trace(SCRIPT+"lv_num_elements="+lv_num_elements);

            var lt_result = java.lang.reflect.Array.newInstance(
                lo_array_type, lv_num_elements);

            for (var i = 0; i < lv_num_elements; ++i)
            {
                lt_result[i] = arguments[i+1];
            }

            fx_trace(SCRIPT+"Returning, lt_result.length="+lt_result.length);
            return lt_result;

        },//newArray

        /**
         * <div>Handle any Java exception or JavaScript error.</div>
         * This function will write details about io_exception, such
         * as stack trace, if available, or message to the job log
         * using uError. It will return that detail message as string,
         * prefixed with !ERROR.
         * @function
         * @public
         * @name fx_JavaUtils.handleException
         * @param {string} iv_location - Function or location name
         *        where the error occurred
         *
         * @param {java.lang.Exception|Error} io_exception - Java exception
         *        or JavaScript Error
         *
         * @return {string} - Error message prefixed with !ERROR
         */
        handleException: function(iv_location, io_exception)
        {
            var SCRIPT = "fx_JavaUtils=>handleException: ";
            fx_trace(SCRIPT
                     + "Entering iv_location="
                     + iv_location
                     + ", io_exception="
                     + io_exception
                     + ", (typeof io_exception)="+(typeof io_exception));

            var lv_result;
            var lv_message;

            //Handle java.lang.Exception
            if(typeof io_exception["printStackTrace"] == "function")
            {
                var lo_string_writer
                        = new java.io.StringWriter();

                var lo_print_writer
                        = new java.io.PrintWriter(lo_string_writer);

                io_exception.printStackTrace(lo_print_writer);

                lv_message
                    = iv_location
                    + lo_string_writer.toString()
                ;
            }
            //Handle JavaScript Error
            else
            {
                lv_message
                    = iv_location
                    + io_exception.message
                ;
            }

            //Write error message to log without "!ERROR" prefix
            uError(lv_message);

            lv_result = "!ERROR: "+lv_message;
            fx_trace(SCRIPT
                     + "Returning lv_result ("
                     + lv_result.length
                     + " char)");

            //Return error message to caller with "!ERROR" prefix,
            //so caller can distinguish errors from normal results
            return lv_result;

        }//handleException

    }//go_result
    ;

    return go_result;

})();
