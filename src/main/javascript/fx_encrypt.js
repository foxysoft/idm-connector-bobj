/**
 * Encrypts cleartext with default algorithm, key and character encoding.
 * @param {string} iv_cleartext - cleartext data
 * @return {string} - ciphertext
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
