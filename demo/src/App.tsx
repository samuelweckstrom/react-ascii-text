import { useMemo, useState } from "react";
import { deltaCorpsPriest1, useAsciiText } from "react-ascii-text";
import "./styles.css";

export function App() {
  const texts = useMemo(() => ["REACT", "ASCII", "TEXT"], []);
  const [isPaused, setIsPaused] = useState(false);

  const asciiTextRef = useAsciiText({
    animationCharacters: "▒ ░ █",
    animationDirection: "down",
    animationInterval: 1000,
    animationLoop: true,
    animationSpeed: 20,
    font: deltaCorpsPriest1,
    text: texts,
    isPaused,
  });

  return (
    <div>
      <div className="container">
        <pre ref={asciiTextRef} />
      </div>
      <button onClick={() => setIsPaused(!isPaused)}>
        {isPaused ? "play" : "pause"}{" "}
      </button>
    </div>
  );
}
