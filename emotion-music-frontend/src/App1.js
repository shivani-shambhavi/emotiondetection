import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import "./App.css";

function App1() {
  const [screenshot, setScreenshot] = useState(null);
  const [emotion, setEmotion] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const webcamRef = useRef(null);

  // Capture image from webcam
  const captureImage = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setScreenshot(imageSrc);

    // Send the captured image to backend for emotion prediction
    try {
      const formData = new FormData();
      formData.append("image", dataURLToBlob(imageSrc));

      const response = await axios.post("http://127.0.0.1:5000/detect_emotion", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setEmotion(response.data.emotion);
      setPlaylist(response.data.playlist);
    } catch (error) {
      console.error("Error capturing image and detecting emotion:", error);
    }
  };

  // Convert data URL to Blob
  const dataURLToBlob = (dataURL) => {
    const [header, base64Data] = dataURL.split(",");
    const binaryString = atob(base64Data);
    const arrayBuffer = new ArrayBuffer(binaryString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < binaryString.length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }
    return new Blob([uint8Array], { type: "image/jpeg" });
  };

  return (
    <div className="App">
      <h1 className="app-header">Emotion Music App</h1>

      <div className="webcam-container">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width="100%"
          videoConstraints={{
            facingMode: "user", // Front camera
            width: 1280,
            height: 720,
            frameRate: { ideal: 10, max: 15 },
          }}
        />
      </div>

      <button className="capture-button" onClick={captureImage}>Capture Image</button>

      {screenshot && (
        <div className="captured-image-container">
          <h3>Captured Image</h3>
          <img src={screenshot} alt="Captured" className="captured-image" />
        </div>
      )}

      {emotion && (
        <div className="prediction-container">
          <h3>Detected Emotion: {emotion}</h3>
          <h4>Suggested Playlists:</h4>
          <ul className="playlist-container">
            {playlist.map((link, index) => (
              <li key={index}>
                <a href={link} target="_blank" rel="noopener noreferrer">
                  Playlist {index + 1}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App1;
