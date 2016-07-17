# Installation
## Install Prerequisites
This connector internally uses the SAP Business Intelligence platform Java SDK, a commercial software available to SAP customers
on the SAP Service Marketplace. Before installling the connector, plase download the SDK first. We recommend you do not install
the SDK directly on the SAP IDM runtime, but instead install it on a separate machine or VM.

After installing the SDK, find the following JAR files and copy them over to the SAP IDM runtime machine into a new directory,
e.g. C:\IDM_BOBJ_LIBS:

 * aspectjrt.jar
 * bcm.jar
 * ceaspect.jar
 * cecore.jar
 * celib.jar
 * cesession.jar
 * corbaidl.jar
 * cryptojFIPS.jar
 * ebus405.jar
 * log4j.jar
 * logging.jar
 * TraceLog.jar
 
For the purposes of this connector, you don't need any other content included in the SDK installation.
## Add SDK JARs to IDM Classpath
Our preferred approach is to add a new Java extension directory containing the SDK JAR files
to the SAP IDM dispatcher's classpath. Other approaches may work as well.

In SAP IDM, add the following Java option to your dispatcher(s):

       -Djava.ext.dirs=C:\IDM_BOBJ_LIBS

If you're already using other extension directories, we recommend to append C:\IDM_BOBJ_LIBS after all directories you currently have
there. Use ; (semicolon) on Windows or : (colon) on Unix/Linux to separate entries from each other.

After this change, restart your SAP IDM dispatcher(s).
## Install Connector
1. Copy idm-connector-bobj-&lt;VERSION&gt;.zip to the SAP IDM runtime and unzip its contents into a new directory, e.g. C:\IDM_BOBJ_INSTALL
1. Import file **SAP BOBJ 4.2 Global Scripts.mcc** into SAP IDM's global scripts.
1. Import file **SAP BOBJ 4.2 Tasks.mcc** into SAP IDM's provisioning folder.
1. Create a new SAP IDM repository from template **SAP BOBJ 4.2 Repository.rtt**. Fill in the required connection data when prompted.
1. Create a new SAP IDM job from template **SAP BOBJ 4.2 Initial Load.dst**. Assign the repository created in the previous step to this job.
1. Execute the initial load job. 
1. After job completion, add the account privilege it has created as master privilege to the repository created in step 4.
