# idm-connector-bobj
SAP&reg; Identity Management connector for SAP&reg; BusinessObjects&trade; BI Platform
## What is it?
This is an add-on for [SAP&reg; Identity Management (IDM)](http://go.sap.com/product/technology-platform/identity-management.html) which enables IDM to manage users and authorizations of the  
[SAP&reg; BusinessObjects&trade; BI Platform](http://go.sap.com/germany/product/analytics/bi-platform.html).

It is is free and open source software available under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0.txt).  
Commercial consulting, implementation services and support are available from [Foxysoft GmbH](http://foxysoft.de) in Germany.
## Build
You need [Git](https://git-scm.com/) and [Maven 3.0](https://maven.apache.org/) to build the connector. Maven downloads dependencies
from the Internet by default, so your build machine will need to be connected to the Internet.


     git clone https://github.com/foxysoft/idm-connector-bobj.git
     cd idm-connector-bobj
     mvn package
## Install
Please refer to [INSTALL.txt](INSTALL.md) for detailed installation instructions.
## Features
* Initial load existing BusinessObjects&trade; users, groups and aliases into SAP&reg; IDM
* Create/update/delete Enterprise users
* Lock/unlock Enterprise users
* Change password of Enterprise users
* Add/remove user members to Enterprise groups
