import { useLocation } from "react-router-dom";

const HomePage = () => {
  const location = useLocation();

  const transcript = location.state?.transcript || "";
  const file = location.state?.file;

  const videoUrl = file ? URL.createObjectURL(file) : "";

  const handleDownload = () => {
    const plainText = transcript
      .replace(
        /\[\d{2}:\d{2}\.\d{3}\s*-->\s*\d{2}:\d{2}\.\d{3}\]\s*/g,
        ""
      )
      .trim();

    const blob = new Blob([plainText], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "transcript.txt";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      {file && (
        <video
          src={videoUrl}
          controls
          className="w-full max-w-2xl rounded-lg"
        />
      )}

      {transcript && (
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
      )}
    </div>
  );
};

export default HomePage;