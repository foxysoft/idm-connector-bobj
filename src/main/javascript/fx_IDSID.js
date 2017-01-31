// Copyright 2017 Foxysoft GmbH
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

/* global fx_trace */

/**
 * <div>Returns the main (SAP Master) Identity Store's ID.</div>
 * <div><strong>SAP IDM 8.0:</strong> If $IDSID is non-empty and not -1,
 * returns that. Otherwise, obtains the minimum Identity Store ID
 * from the database and returns that.</div>
 * <div><strong>SAP IDM 7.2:</strong> Returns the value of global
 * constant SAP_MASTER_IDS_ID.</div>
 * @return {string} IDSID
 * @requires fx_trace
 * @since 1.1.0
 */
function fx_IDSID()
{
    return fx_trace({compat: 1.0}).fx_IDSID();
}
