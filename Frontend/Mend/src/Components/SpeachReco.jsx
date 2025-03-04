import React from "react";
import { Mic } from "lucide-react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const SpeachReco = () => {
  const [isListening, setIslistening] = React.useState(false);
  const { transcript } = useSpeechRecognition();

  const micToggle = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
      setIslistening(false);
    } else {
      SpeechRecognition.startListening({ continuous: true });
      setIslistening(true);
    }
  };
//   console.log(transcript);
     return (
       <>
         <Mic
           className={`hover:cursor-pointer ${
             isListening ? `text-yellow-500` : ``
           }`}
           onClick={micToggle}
         />
         <p>{transcript}</p>
       </>
     );
};

export default SpeachReco;
