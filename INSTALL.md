# Installation on SAP IDM 8.0
This documentation is specific to SAP IDM 8.0. If you intend to install on SAP IDM 7.2, please refer to [INSTALL72.txt](INSTALL72.md).

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
 * jcmFIPS.jar (BIP 4.2 SP4 or higher)
 
For the purposes of this connector, you don't need any other content included in the SDK installation.

## Add SDK JARs to IDM Classpath
On the SAP IDM runtime machine, start the Identity Management Dispatcher Utility in GUI mode using the command `dispatcherutil gui`.

Open the Dispatcher Utility's settings dialog using **Tools -> Settings**. Add all SDK JAR files listed above to the setting **DSE Class Path**. Use absolute paths, and separate each JAR file's path from the next with one semicolon character (;) on Windows, or one colon character (:) on Unix. After saving your changes, regenerate dispatcher scripts and restart all dispatchers.

If you need to do edit the DSE class path without Identity Management Dispatcher Utility, edit property DSECLASSPATH in the dispatcher service property files directly. Keep in mind, though, that such manual changes will be lost whenever dispatcher scripts are regenerated from the tool.

## Install Connector
Perform the remaining steps on a machine with SAP IDM Developer Studio installed:

1. Unzip the content of idm-connector-bobj-&lt;VERSION&gt;.zip into a new directory, e.g. C:\IDM_BOBJ_INSTALL
1. Use SAP IDM Developer Studio to import the connector package file **de.foxysoft.bobj.idmpck** from the above directory into your main Identity Store (SAP Master IDS).
1. Use SAP IDM administration web UI (/idm/admin) to create a new repository of type **SapBusinessObjects42**
1. Run job **SAP BusinessObjects 4.2 - Initial Load** from package de.foxysoft.bobj with the new repository. The job is created automatically with each new SapBusinessObjects42 repository.

