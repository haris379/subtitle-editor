import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const HomePage = () => {
  const location = useLocation();

  const transcript = location.state?.transcript || "";
  const file = location.state?.file;

  const [videoUrl, setVideoUrl] = useState("");
  const [subtitleUrl, setSubtitleUrl] = useState("");

  useEffect(() => {
    if (!file) return;

    const videoObjectUrl = URL.createObjectURL(file);
    setVideoUrl(videoObjectUrl);

    const vttContent =
      "WEBVTT\n\n" +
      transcript.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, "$1.$2");

    const subtitleBlob = new Blob([vttContent], {
      type: "text/vtt",
    });

    const vttObjectUrl = URL.createObjectURL(subtitleBlob);
    setSubtitleUrl(vttObjectUrl);

    return () => {
      URL.revokeObjectURL(videoObjectUrl);
      URL.revokeObjectURL(vttObjectUrl);
    };
  }, [file, transcript]);

  return (
    <div className="p-6">
      {file && (
        <video
          src={videoUrl}
          controls
          className="w-full max-w-2xl rounded-lg"
          loop
        >
          {subtitleUrl && (
            <track
              src={subtitleUrl}
              kind="subtitles"
              srcLang="en"
              label="English"
              default
            />
          )}
        </video>
      )}

      {/* {transcript && (
        <div className="mt-6 bg-gray-100 border border-gray-300 p-4 text-left rounded-lg max-w-2xl mx-auto">
          <h3 className="font-semibold text-lg mb-2">
            Transcript:
          </h3>

          <pre className="whitespace-pre-wrap text-sm text-gray-800">
            {transcript}
          </pre>

          <button
            onClick={handleDownload}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            Download Transcript
          </button>
        </div>
      )} */}
    </div>
  );
};

export default HomePage;
