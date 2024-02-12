import { useState } from "react";
import { deltaCorpsPriest1, useAsciiText } from "react-ascii-text";
import "./styles.css";

export function App() {
  const [isPaused, setIsPaused] = useState(false);

  const asciiTextRef = useAsciiText({
    animationCharacters: "▒░█",
    animationCharacterSpacing: 1,
    animationDelay: 2000,
    animationDirection: "down",
    animationInterval: 100,
    animationLoop: true,
    animationSpeed: 30,
    font: deltaCorpsPriest1,
    text: ["REACT", "ASCII", "TEXT"],
  });

  return (
    <div>
      <div className="container">
        <pre ref={asciiTextRef} />
      </div>
      <button onClick={() => setIsPaused(!isPaused)}>
        {isPaused ? "play" : "pause"}
      </button>
    </div>
  );
}
