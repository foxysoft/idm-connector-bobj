/**
 * Decrypts iv_ciphertext using internal function uDecrypt
 * and returns cleartext in the default character encoding
 * of the JRE.
 * @param {string} iv_ciphertext - encrypted data
 * @param {string} - decrypted text
 */
function fx_decrypt(iv_ciphertext)
{
    return uDecrypt(
        iv_ciphertext
        ,""
        /*,CharacterEncoding*/
    );
}
