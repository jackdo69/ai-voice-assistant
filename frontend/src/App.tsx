import React from "react";
import { useRef, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import "./App.css";
import microPhoneIcon from "./assets/microphone.svg";

const App = () => {
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const microphoneRef = useRef<HTMLDivElement>(null);
  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <div className="mircophone-container">Browser is not Support Speech Recognition.</div>;
  }
  const handleListing = () => {
    setIsListening(true);
    microphoneRef.current!.classList.add("listening");
    SpeechRecognition.startListening({
      continuous: true
    });
  };
  const stopHandle = async () => {
    setIsListening(false);
    microphoneRef.current!.classList.remove("listening");
    SpeechRecognition.stopListening();

    // Make HTTP request when stopHandle is called
    if (transcript.trim() !== "") {
      setIsLoading(true); // Set loading state to true
      const apiUrl = "https://m0w7itxz19.execute-api.ap-southeast-2.amazonaws.com/prod/prompt";

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            prompt: transcript
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP request failed with status ${response.status}`);
        }

        const data = await response.json();
        speakAnswer(data.answer);
        resetTranscript();
      } catch (error) {
        console.error("Error making HTTP request:", error);
      } finally {
        setIsLoading(false); // Set loading state to false after the request is complete
      }
    }
  };

  const speakAnswer = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };
  return (
    <>
      <div className="microphone-wrapper">
        <div className="mircophone-container">
          <div className="microphone-icon-container" ref={microphoneRef} onClick={handleListing}>
            <img src={microPhoneIcon} className="microphone-icon" />
          </div>
          <div className="microphone-status">{isListening ? "Listening........." : "Click to start speaking"}</div>
          {isListening && (
            <button className="microphone-stop btn" onClick={stopHandle}>
              Finish
            </button>
          )}
        </div>
        {isLoading ? <div className="spinner"></div> : ""}
      </div>
    </>
  );
};

export default App;
