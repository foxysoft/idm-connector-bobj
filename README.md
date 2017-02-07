# idm-connector-bobj
SAP&reg; Identity Management connector for SAP&reg; BusinessObjects&trade; BI Platform
## What is it?
This is an add-on for [SAP&reg; Identity Management (IDM)](http://go.sap.com/product/technology-platform/identity-management.html) which enables IDM to manage users and authorizations of the [SAP&reg; BusinessObjects&trade; BI Platform](http://go.sap.com/germany/product/analytics/bi-platform.html).

It is free and open source software available under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0.txt). Commercial consulting, implementation services and support are available from Foxysoft GmbH in Germany. Visit http://foxysoft.de for more information.
## Build
You need [Git](https://git-scm.com/) and [Maven 3.x](https://maven.apache.org/) to build the connector. Maven downloads dependencies from the Internet by default, so your build machine will need to be connected to the Internet.

     git clone https://github.com/foxysoft/idm-connector-bobj.git
     cd idm-connector-bobj
     mvn package
     
The build produces a file **idm-connector-bobj-&lt;VERSION&gt;.zip**  in the target subdirectory. The files in this ZIP archive can be imported into SAP&reg; IDM.
## Install
Please refer to [INSTALL.txt](INSTALL.md) or [INSTALL72.txt](INSTALL72.md) for detailed installation instructions specific to SAP&reg; IDM 8.0 or 7.2, respectively.
## Features
* Initial load existing SAP&reg; BusinessObjects&trade; users, groups and aliases into SAP&reg; IDM
* Create/update/delete Enterprise users
* Lock/unlock Enterprise users
* Change password of Enterprise users
* Add/remove user members to Enterprise groups
