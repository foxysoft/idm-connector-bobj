<?xml version="1.0" encoding="UTF-8"?>
<IDM Exported_on="2016-07-12 10:21:36.28"
     ImXport_Version="v.7.2.8-720_VAL_REL-BUILD-18.09.2013_18:45:43"
     MC_Version="7.20.8.0-SQL-2013-06-21"
     ObjectType="EXPORT_GLOBAL_SCRIPT"
     Schema_Version="1100"
     xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
     xsl:version="3.0"
     xmlns:xs="http://www.w3.org/2001/XMLSchema"
     xmlns:java="http://xml.apache.org/xslt/java">
  <xsl:variable name="gv_test" select="java:java.lang.String.new('Hello World')"/>
  <xsl:value-of select="$gv_test"/>

</IDM>
