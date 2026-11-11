import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { srtTimeToSeconds } from "../utils/srtUtils";
const HomePage = () => {
  const location = useLocation();

  const transcript = location.state?.transcript || "";
  const file = location.state?.file;

  const [videoUrl, setVideoUrl] = useState("");
  const [subtitleUrl, setSubtitleUrl] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [filteredSub, setFilteredSub] = useState([]);

  const videoRef = useRef(null);

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

  const getSubtitleInRange = () => {
    if (!startTime || !endTime) {
      alert("Please Enter both start and End time");
      return;
    }

    const start = srtTimeToSeconds(startTime);
    const end = srtTimeToSeconds(endTime);

    if (start > videoRef.current.duration || end > videoRef.current.duration) {
      alert("Please Enter time within video time duration");
      return;
    }

    if (start === null || end === null) {
      alert("Please Enter valid time");
      return;
    }

    if (start >= end) {
      alert("Please Enter valid time");
      return;
    }
    if (!videoRef.current) return;

    const track = videoRef.current.textTracks[0];

    const result = Array.from(track.cues)
      .filter((cue) => cue.startTime < end && cue.endTime > start)
      .map((cue) => ({
        text: cue.text,
        startTime: cue.startTime,
        endTime: cue.endTime,
      }));

    setFilteredSub(result);
    console.log(videoRef.current.duration);
    if (result.length === 0) {
      alert("No subtitles");
      return;
    }
  };
  const handleClick = () => {};

  return (
    <div className="p-6 ">
      <div>
        {file && (
          <video
            ref={videoRef}
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

      <div>
        <div className="flex gap-2 items-center ">
          <div>
            <h5 className="font-bold">Start Time</h5>
            <input
              className="border border-black rounded-md p-2"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              type="text"
              placeholder="00:00:30"
            />
          </div>
          <div>
            <h5 className="font-bold">End Time</h5>
            <input
              className="border border-black rounded-md p-2"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              type="text"
              placeholder="00:00:35"
            />
          </div>

          <button
            onClick={getSubtitleInRange}
            className="bg-blue-600 p-2.5 rounded-md mt-5 text-white font-semibold"
          >
            Get Subtitle
          </button>
        </div>

        <div className="mt-6 max-w-2xl bg-gray-100  rounded-lg p-4">
          <h2 className="font-bold">Subtitles</h2>

          {filteredSub.map((sub, ind) => (
            <div key={ind}>
              <p className="text-sm text-gray-500">
                {sub.startTime.toFixed(2)}s - {sub.endTime.toFixed(2)}s
              </p>
              <p>{sub.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
