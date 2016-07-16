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