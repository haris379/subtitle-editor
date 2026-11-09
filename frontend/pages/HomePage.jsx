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

  console.log(transcript);

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
    </div>
  );
};

export default HomePage;
