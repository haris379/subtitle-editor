import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";

const FFMPEG =
  "D:/A - Files/ffmpeg-8.1.2-full_build/ffmpeg-8.1.2-full_build/bin/ffmpeg.exe";

export const transcribeAudio = async (filePath) => {
  const wavFile = filePath.replace(path.extname(filePath), ".wav");
  const outDir = path.dirname(wavFile);

  try {
    execFileSync(
      FFMPEG,
      ["-y", "-i", filePath, "-ar", "16000", "-ac", "1", wavFile],
      { stdio: "inherit" },
    );

    execFileSync(
      "python",
      [
        "-m",
        "whisper",
        wavFile,
        "--model",
        "small",
        "--language",
        "en",
        "--output_format",
        "srt",
        "--output_dir",
        outDir,
      ],
      { stdio: "inherit" },
    );

    const srtFile = wavFile.replace(/\.wav$/i, ".srt");

    if (!fs.existsSync(srtFile)) {
      throw new Error(`Transcript file not found: ${srtFile}`);
    }

    const transcript = fs.readFileSync(srtFile, "utf-8");

    return transcript.trim();
  } catch (error) {
    console.error("Audio transcription failed:", error.message);
    throw error;
  } finally {
    for (const file of [filePath, wavFile]) {
      try {
        if (fs.existsSync(file)) fs.unlinkSync(file);
      } catch (cleanupError) {
        console.error("Cleanup failed:", cleanupError.message);
      }
    }
  }
};
