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
 * <div>Writes message to log if package constant FX_TRACE is 1.</div>
 * <div>The severity of the message is <strong>WARNING</strong>, so
 * it shows up in the log without any additional tweaks.</div>
 * @param {string} iv_message - trace message
 * @return {string} iv_message
 */
function fx_trace(iv_message)
{
    if("1" == "%$pck.FX_TRACE%")
    {
        uWarning(iv_message);
    }
    return iv_message;
}
