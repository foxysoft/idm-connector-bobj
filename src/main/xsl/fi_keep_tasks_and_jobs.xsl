<?xml version="1.0" encoding="UTF-8"?>
<!-- Filter to keep only IDM/TASKS and IDM/JOBS elements -->
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output encoding="UTF-8"/>
  <xsl:strip-space elements="*"/>
  <!-- Copy all attributes and nodes -->
  <xsl:template match="@*|node()">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()"/>
    </xsl:copy>
  </xsl:template>
  <!-- Cancel copying children of IDM unless its TASKS or JOBS -->
  <xsl:template match="IDM/*[not(name()='TASKS' or name()='JOBS')]">
    <xsl:message>Stripping <xsl:value-of select="name()"/></xsl:message>
  </xsl:template>
</xsl:stylesheet>
