import { useState } from "react";
import { alligator, useAsciiText } from "react-ascii-text";

export function App() {
  const [text, setText] = useState(["REACT", "ASCII", "TEXT"]);
  const [isPaused, setIsPaused] = useState(false);

  const asciiTextRef = useAsciiText({
    animationCharacters: "▒░█",
    animationCharacterSpacing: 1,
    animationDelay: 2000,
    animationDirection: "down",
    animationInterval: 100,
    animationLoop: true,
    animationSpeed: 30,
    font: alligator,
    isPaused,
    text,
  });

  let updatedText = [];
  const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value.toUpperCase();
    updatedText = text.split(/[\s,]+/);
  };

  const handleSetText = () => {
    if (updatedText.length === 0) return;
    setText(updatedText);
  };

  return (
    <main className="container bg-inherit mx-2 my-8 flex flex-col">
      <article className="text-s mx-auto text-center my-8">
        <pre className="text-white w-full mx-auto" ref={asciiTextRef} />
      </article>

      <div className="flex flex-row">
        <input
          className="mr-2"
          placeholder="Your text"
          onChange={handleChangeText}
          type="text"
        />
        <button onClick={handleSetText}>Change text</button>
      </div>
      <div className="my-2">
        <button onClick={() => setIsPaused(!isPaused)}>
          {isPaused ? "Play animation" : "Pause animation"}
        </button>
      </div>
    </main>
  );
}
