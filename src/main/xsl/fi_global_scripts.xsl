<?xml version="1.0" encoding="UTF-8"?>
<!--
Copyright 2016 Foxysoft GmbH

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

<xsl:stylesheet version="3.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:variable
        name="gv_script_last_change"
        select="format-dateTime(current-dateTime(), '[Y0001]-[M01]-[D01]T[H01]:[m01]:[s01]')"/>
  <xsl:template match="@*|node()">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()"/>
    </xsl:copy>
  </xsl:template>
  <xsl:template match="/IDM/GLOBALSCRIPTS">
    <xsl:copy>
      <xsl:for-each select="uri-collection('../javascript/?select=*.js')">
        <xsl:sort
            select='.'
            data-type='text'
            case-order='lower-first'/>
        <xsl:call-template name="get_global_script">
          <xsl:with-param
              name="iv_script_name"
              select="substring-before(tokenize(.,'/')[last()],'.')"/>
        </xsl:call-template>
      </xsl:for-each>
    </xsl:copy>
  </xsl:template>
  <xsl:template name="get_global_script">
    <xsl:param name="iv_script_name"/>
    <xsl:variable
        name="lv_base_uri"
        select="concat('../../../target/generated-resources/javascript/',$iv_script_name)"/>
    <xsl:variable
        name="lv_b64_uri"
        select="concat($lv_base_uri, '.b64')"/>
    <!-- Uncomment for debugging
    <xsl:message>
      <xsl:text>lv_base_uri=</xsl:text>
      <xsl:value-of select="$lv_base_uri"/>
    </xsl:message>
    -->
    <GLOBALSCRIPT>
      <MCSCRIPTSTATUS>0</MCSCRIPTSTATUS>
      <MXENABLED>1</MXENABLED>
      <MXPROTECTED>0</MXPROTECTED>
      <SCRIPTDEFINITION>
        <xsl:value-of select="unparsed-text($lv_b64_uri)"/>
      </SCRIPTDEFINITION>
      <SCRIPTHASH>00000000000000000000000000000000</SCRIPTHASH>
      <SCRIPTID><xsl:value-of select="position()"/></SCRIPTID>
      <SCRIPTLANGUAGE>JScript</SCRIPTLANGUAGE>
      <SCRIPTLASTCHANGE>
	<xsl:value-of select="$gv_script_last_change"/>
      </SCRIPTLASTCHANGE>
      <SCRIPTLOCKSTATE>0</SCRIPTLOCKSTATE>
      <SCRIPTNAME><xsl:value-of select="$iv_script_name"/></SCRIPTNAME>
    </GLOBALSCRIPT>
  </xsl:template>
</xsl:stylesheet>
