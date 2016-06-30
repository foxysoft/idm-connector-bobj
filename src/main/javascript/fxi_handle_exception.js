/**
 * Handles any JavaScript Error or Java exception
 * by emitting an error message via uError,
 * and then returning that error message.
 *
 * @param iv_location
 *        type JS String or java.lang.String
 *        Function/location where the error occurred
 *
 * @param io_exception
 *        type JS Error or java.lang.Exception
 *
 * @return type JS string
 *         Error message prefixed with !ERROR
 *         and containing the message text,
 *         plus stack trace, if any, of io_exception
 * @requires Global script {@link fx_trace}
 */
function fxi_handle_exception(iv_location, io_exception)
{
    var SCRIPT = "fxi_handle_exception: ";
    fx_trace(SCRIPT
             + "Entering iv_location="
             + iv_location
             + ", io_exception="
             + io_exception
             + ", (typeof io_exception)="+(typeof io_exception));

    var lv_message;

    //Handle java.lang.Exception
    if(typeof io_exception["printStackTrace"] != "undefined")
    {
        var lo_string_writer
                = new java.io.StringWriter();

        var lo_print_writer
                = new java.io.PrintWriter(lo_string_writer);

        io_exception.printStackTrace(lo_print_writer);

        lv_message
            = "!ERROR: "
            + iv_location
            + " "
            + lo_string_writer.toString()
        ;
    }
    //handle JavaScript Error
    else
    {
        lv_message
            = "!ERROR: "
            + iv_location
            + io_exception.message
        ;
    }

    uError(lv_message);

    fx_trace(SCRIPT+"Returning lv_message ("+lv_message.length+ " char)");
    return lv_message;

}//handle_exception
