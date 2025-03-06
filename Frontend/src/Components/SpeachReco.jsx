import React, { useEffect, useState } from "react";
import { Mic } from "lucide-react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const SpeachReco = ({ setTrans, setActiveField, activeField, fieldName }) => {
  const [isListening, setIsListening] = useState(false);
  const { transcript, resetTranscript } = useSpeechRecognition();

  const micToggle = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
      setIsListening(false);
    } else {
      resetTranscript(); // Clear any old transcript when starting fresh
      SpeechRecognition.startListening({ continuous: true });
      setIsListening(true);
      setActiveField(); // Set this field as the active field
    }
  };

  useEffect(() => {
    if (activeField === fieldName) {
      setTrans(transcript); // Only update if this is the active field
    }
  }, [transcript, activeField, setTrans, fieldName]);

  return (
    <Mic
      className={`hover:cursor-pointer ${isListening ? "text-yellow-500" : ""}`}
      onClick={micToggle}
    />
  );
};

export default SpeachReco;
