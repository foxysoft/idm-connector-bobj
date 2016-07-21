SAP® Identity Management connector for SAP® BusinessObjects™ BI Platform

 What is it?

This is an add-on for SAP® Identity Management (IDM) which enables IDM to
manage users and authorizations of the SAP® BusinessObjects™ BI Platform.

It is free and open source software available under the Apache License, Version
2.0. Commercial consulting, implementation services and support are available
from Foxysoft GmbH in Germany. Visit http://foxysoft.de for more information.

 Build

You need Git and Maven 3.x to build the connector. Maven downloads dependencies
from the Internet by default, so your build machine will need to be connected
to the Internet.

 git clone https://github.com/foxysoft/idm-connector-bobj.git
 cd idm-connector-bobj
 mvn package

The build produces a file idm-connector-bobj-<VERSION>.zip in the target
subdirectory. The files in this ZIP archive can be imported into SAP® IDM.

 Install

Please refer to INSTALL.txt for detailed installation instructions.

 Features

  • Initial load existing BusinessObjects™ users, groups and aliases into SAP®
    IDM
  • Create/update/delete Enterprise users
  • Lock/unlock Enterprise users
  • Change password of Enterprise users
  • Add/remove user members to Enterprise groups
