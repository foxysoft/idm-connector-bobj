<?xml version="1.0" encoding="UTF-8"?>
<IDM Exported_on="2016-07-12 10:21:36.28"
     ImXport_Version="v.7.2.8-720_VAL_REL-BUILD-18.09.2013_18:45:43"
     MC_Version="7.20.8.0-SQL-2013-06-21"
     ObjectType="EXPORT_GLOBAL_SCRIPT"
     Schema_Version="1100"
     xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
     xsl:version="3.0"
     xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <GLOBALSCRIPTS>
    <!-- uri-collection requires XSLT 3.0 -->
    <xsl:for-each select="uri-collection('../javascript/?select=fx_trace.js')" >
      <GLOBALSCRIPT>
         <MCSCRIPTSTATUS>0</MCSCRIPTSTATUS>
         <MXENABLED>1</MXENABLED>
         <MXPROTECTED>0</MXPROTECTED>
         <SCRIPTDEFINITION/>
	 <!-- This is the MD5 hash of the script's UTF-8 cleartext -->
         <SCRIPTHASH>73dc2234236a47bd0932eadc1ea1ae3c</SCRIPTHASH>
         <SCRIPTID>251</SCRIPTID>
         <SCRIPTLANGUAGE>JScript</SCRIPTLANGUAGE>
         <SCRIPTLASTCHANGE>2016-07-10T10:17:41</SCRIPTLASTCHANGE>
         <SCRIPTLOCKSTATE>0</SCRIPTLOCKSTATE>
         <SCRIPTNAME>
	   <xsl:value-of select="tokenize(., '/')[last()]"/>
	 </SCRIPTNAME>
      </GLOBALSCRIPT>
      <xsl:message xmlns:str="java:java.lang.String">
        <!--xsl:value-of select="xs:base64Binary(unparsed-text(.))"/-->
        <xsl:value-of select="str:new()"/>
      </xsl:message>
    </xsl:for-each>
  </GLOBALSCRIPTS>
</IDM>
