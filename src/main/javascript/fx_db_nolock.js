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
 * Get database-specific SQL query hint for transaction isolation level.
 * @return {string} - On MSS, returns <pre>with (nolock)</pre>, surrounded by
 * space. On other databases, returns empty string.
 */
function fx_db_nolock()
{
    return "%$ddm.databasetype%" == "1" ? " with (nolock) " : "";
}
