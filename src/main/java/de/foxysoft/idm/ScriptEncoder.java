package de.foxysoft.idm;
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

import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FilenameFilter;
import java.io.OutputStream;
import java.security.MessageDigest;

import org.apache.commons.codec.binary.Base64;

/**
 * <div>Helper class to support Maven build of BOBJ connector.</div>
 * <div>You should consider this class <strong>private</strong>. It's interface can
 * change at any time without notice.</div>
 */
public class ScriptEncoder {
	private static boolean g_traceEnabled = false;
	private static MessageDigest g_messageDigest;
	
	public static void trc(String m) {
		if(g_traceEnabled) {
			System.err.println(m);
		}
	}

	public static void main(String[] args) throws Exception {
		if (args.length != 2) {
			System.err.println("Usage: ScriptEncoder inputDir outputDir");
			return;
		}
		g_traceEnabled = System.getProperty("fx.trace") == "1";
		g_messageDigest = MessageDigest.getInstance("MD5");
		File fInputDir = new File(args[0]);
		trc("fInputDir=" + fInputDir);

		File fOutputDir = new File(args[1]);
		trc("fOutputDir=" + fOutputDir);

		if (!fInputDir.exists()) {
			throw new Exception("Input directory does not exist: " + fInputDir);
		}

		if (!fInputDir.isDirectory()) {
			throw new Exception("Not a directory: " + fInputDir);
		}

		if (!fOutputDir.exists()) {
			fOutputDir.mkdirs();
		}

		if (!fOutputDir.isDirectory()) {
			throw new Exception("Not a directory: " + fOutputDir);
		}

		String[] filesToProcess = fInputDir.list(new FilenameFilter() {
			public boolean accept(File dir, String name) {
				return name.toLowerCase().endsWith(".js");
			}
		}// FilenameFilter
				);
		for (int i = 0; i < filesToProcess.length; ++i) {
			File fInputFile = new File(fInputDir, filesToProcess[i]);
			String scriptName = filesToProcess[i].substring(0,
					filesToProcess[i].length() - ".js".length());
			byte[] binaryData = new byte[(int) fInputFile.length()];
			DataInputStream dis = new DataInputStream(new FileInputStream(
					fInputFile));
			dis.readFully(binaryData);
			dis.close();

			createB64File(scriptName, binaryData, fOutputDir);
			createMD5File(scriptName, binaryData, fOutputDir);
		}
	}
	
	private static void createB64File(String scriptName, byte[] scriptBinaryData, File fOutputDir) throws Exception {
		String outputFile = scriptName + ".b64";
		trc("outputFile=" + outputFile);
		File fOutputFile = new File(fOutputDir, outputFile);

		byte[] characterData = Base64.encodeBase64(scriptBinaryData);

		OutputStream os = new FileOutputStream(fOutputFile);
		os.write("{B64}".getBytes("UTF-8"));
		os.write(characterData, 0, characterData.length);
		os.flush();
		os.close();
	}
	
	private static void createMD5File(String scriptName, byte[] scriptBinaryData, File fOutputDir) throws Exception {
		String outputFile = scriptName + ".md5";
		trc("outputFile=" + outputFile);
		File fOutputFile = new File(fOutputDir, outputFile);

		byte[] md5 = g_messageDigest.digest(scriptBinaryData);
		byte[] characterData = rawBytesToHexStringBytes(md5);

		OutputStream os = new FileOutputStream(fOutputFile);
		os.write(characterData, 0, characterData.length);
		os.flush();
		os.close();
	}
	
	private static byte[] rawBytesToHexStringBytes(byte[] bytes) throws Exception {
		StringBuffer hexBuffer = new StringBuffer(bytes.length * 2);
		for(int i=0; i<bytes.length;++i) {
			hexBuffer.append(String.format("%02x", bytes[i]));
		}
		return hexBuffer.toString().getBytes("UTF-8");
	}

}
