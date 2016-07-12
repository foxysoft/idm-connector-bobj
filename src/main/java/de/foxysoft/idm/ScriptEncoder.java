package de.foxysoft.idm;

import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FilenameFilter;
import java.io.OutputStream;

import org.apache.commons.codec.binary.Base64;

public class ScriptEncoder {
	public static void trc(String m) {
		System.err.println(m);
	}

	public static void main(String[] args) throws Exception {
		if (args.length != 2) {
			System.err.println("Usage: ScriptEncoder inputDir outputDir");
			return;
		}
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
			String outputFile = filesToProcess[i].substring(0,
					filesToProcess[i].length() - ".js".length()) + ".b64";
			trc("outputFile=" + outputFile);
			File fOutputFile = new File(fOutputDir, outputFile);
			byte[] binaryData = new byte[(int) fInputFile.length()];
			DataInputStream dis = new DataInputStream(new FileInputStream(
					fInputFile));
			dis.readFully(binaryData);
			dis.close();

			byte[] characterData = Base64.encodeBase64(binaryData);
			OutputStream os = new FileOutputStream(fOutputFile);
			os.write("{B64}".getBytes("UTF-8"));
			os.write(characterData, 0, characterData.length);
			os.close();
		}
	}

}
