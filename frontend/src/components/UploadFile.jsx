import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UploadFile = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      return alert("Please select a file first");
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:5001/api/upload",
        formData,
      );

      // Send transcript to HomePage
      navigate("/home", {
        state: { transcript: res.data.transcript, file: file },
      });
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-6 bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-6">
          Upload Audio or Video File
        </h2>

        <input
          type="file"
          accept="audio/*,video/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer p-2 mb-4"
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className={`mt-4 px-6 py-2 text-white rounded-lg ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
          }`}
        >
          {loading ? "Processing..." : "Upload and Transcribe"}
        </button>

        {loading && (
          <div className="mt-4 text-gray-600 animate-pulse">
            Transcribing, please wait...
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadFile;
