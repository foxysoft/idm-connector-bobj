/**
 * @param {string} iv_cleartext
 * @return {string} - iv_cleartext encrypted using internal function
 *         uEncrypt() with the default symmetrical encryption
 *         algorithm, the default encryption key and the default
 *         characer encoding of the JRE, e.g. CP-1252 for Windows
 *         server with German localization.
 */
function fx_encrypt(iv_cleartext)
{
    return uEncrypt(
        iv_cleartext
        /*,algorithm*/
        /*,KeyString*/
        /*,CharacterEncoding*/
    );
}
