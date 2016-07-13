/**
 * Decrypts ciphertext with default algorithm and character encoding.
 * @param {string} iv_ciphertext - encrypted data
 * @return {string} - cleartext
 */
function fx_decrypt(iv_ciphertext)
{
    return uDecrypt(
        iv_ciphertext
        ,""
        /*,CharacterEncoding*/
    );
}
