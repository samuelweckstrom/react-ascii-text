import { useState, useMemo } from "react";
import * as allExports from "react-ascii-text";
import { useAsciiText, type AnimationDirection } from "react-ascii-text";
import "./styles.css";

// ---------------------------------------------------------------------------
// Font map — extract every string export that looks like a FIGlet font file
// ---------------------------------------------------------------------------
const FONT_MAP = Object.fromEntries(
  (Object.entries(allExports) as [string, unknown][])
    .filter((e): e is [string, string] =>
      typeof e[1] === "string" && e[1].startsWith("flf")
    )
    .sort(([a], [b]) => a.localeCompare(b))
) as Record<string, string>;

const FONT_KEYS = Object.keys(FONT_MAP);

/** camelCase → human-readable label, preserving uppercase runs as acronyms */
function toLabel(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/([a-zA-Z])(\d)/g, "$1 $2")
    .replace(/(\d)([a-zA-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
}

const DIRECTIONS: AnimationDirection[] = [
  "horizontal",
  "vertical",
  "up",
  "down",
  "left",
  "right",
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="toggle-row">
      <span className="toggle-label">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        className={`toggle ${checked ? "toggle--on" : ""}`}
        onClick={() => onChange(!checked)}
      >
        <span className="toggle-thumb" />
      </button>
    </label>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "ms",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <section className="ctrl-section">
      <h3 className="ctrl-heading">
        {label}
        <span className="ctrl-value">
          {value}
          {unit}
        </span>
      </h3>
      <input
        type="range"
        className="ctrl-range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </section>
  );
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

export function App() {
  const [texts, setTexts] = useState(["REACT", "ASCII", "TEXT"]);
  const [fontKey, setFontKey] = useState("deltaCorpsPriest1");
  const [fontSearch, setFontSearch] = useState("");
  const [animationCharacters, setAnimationCharacters] = useState("▒░█");
  const [animationCharacterSpacing, setAnimationCharacterSpacing] = useState(1);
  const [animationDelay, setAnimationDelay] = useState(2000);
  const [animationDirection, setAnimationDirection] =
    useState<AnimationDirection>("down");
  const [animationInterval, setAnimationInterval] = useState(100);
  const [animationIteration, setAnimationIteration] = useState(1);
  const [animationLoop, setAnimationLoop] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(30);
  const [fadeInOnly, setFadeInOnly] = useState(false);
  const [fadeOutOnly, setFadeOutOnly] = useState(false);
  const [isAnimated, setIsAnimated] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const filteredFontKeys = useMemo(() => {
    if (!fontSearch) return FONT_KEYS;
    const q = fontSearch.toLowerCase();
    const matches = FONT_KEYS.filter(
      (k) =>
        k.toLowerCase().includes(q) || toLabel(k).toLowerCase().includes(q)
    );
    // Always keep the current selection visible
    if (!matches.includes(fontKey)) return [fontKey, ...matches];
    return matches;
  }, [fontSearch, fontKey]);

  const ref = useAsciiText({
    animationCharacters,
    animationCharacterSpacing,
    animationDelay,
    animationDirection,
    animationInterval,
    animationIteration,
    animationLoop,
    animationSpeed,
    fadeInOnly,
    fadeOutOnly,
    font: FONT_MAP[fontKey],
    isAnimated,
    isPaused,
    text: texts,
  });

  const updateText = (i: number, v: string) =>
    setTexts((t) => t.map((x, j) => (j === i ? v : x)));
  const addText = () => setTexts((t) => [...t, ""]);
  const removeText = (i: number) => {
    if (texts.length > 1) setTexts((t) => t.filter((_, j) => j !== i));
  };

  const handleFadeInOnly = (v: boolean) => {
    setFadeInOnly(v);
    if (v) setFadeOutOnly(false);
  };
  const handleFadeOutOnly = (v: boolean) => {
    setFadeOutOnly(v);
    if (v) setFadeInOnly(false);
  };

  return (
    <div className="app">
      {/* ------------------------------------------------------------------ */}
      {/* Preview                                                             */}
      {/* ------------------------------------------------------------------ */}
      <div className="preview">
        <pre ref={ref} />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Controls                                                            */}
      {/* ------------------------------------------------------------------ */}
      <div className="controls">

        {/* text */}
        <section className="ctrl-section ctrl-section--wide">
          <h3 className="ctrl-heading">text</h3>
          <div className="text-inputs">
            {texts.map((t, i) => (
              <div key={i} className="text-row">
                <input
                  className="ctrl-input"
                  value={t}
                  onChange={(e) => updateText(i, e.target.value)}
                />
                <button
                  className="icon-btn"
                  onClick={() => removeText(i)}
                  disabled={texts.length === 1}
                  aria-label="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
            <button className="add-btn" onClick={addText}>
              + add item
            </button>
          </div>
        </section>

        {/* font */}
        <section className="ctrl-section ctrl-section--wide">
          <h3 className="ctrl-heading">
            font
            <span className="ctrl-value">{toLabel(fontKey)}</span>
          </h3>
          <input
            className="ctrl-input"
            placeholder="search fonts…"
            value={fontSearch}
            onChange={(e) => setFontSearch(e.target.value)}
          />
          <select
            className="ctrl-select"
            size={6}
            value={fontKey}
            onChange={(e) => setFontKey(e.target.value)}
          >
            {filteredFontKeys.map((k) => (
              <option key={k} value={k}>
                {toLabel(k)}
              </option>
            ))}
          </select>
          <p className="ctrl-hint">
            {filteredFontKeys.length} / {FONT_KEYS.length} fonts
          </p>
        </section>

        {/* animationDirection */}
        <section className="ctrl-section ctrl-section--wide">
          <h3 className="ctrl-heading">animationDirection</h3>
          <div className="segment">
            {DIRECTIONS.map((d) => (
              <button
                key={d}
                className={`segment-btn ${animationDirection === d ? "segment-btn--active" : ""}`}
                onClick={() => setAnimationDirection(d)}
              >
                {d}
              </button>
            ))}
          </div>
        </section>

        {/* sliders */}
        <Slider
          label="animationSpeed"
          value={animationSpeed}
          min={1}
          max={200}
          unit="ms"
          onChange={setAnimationSpeed}
        />
        <Slider
          label="animationDelay"
          value={animationDelay}
          min={0}
          max={5000}
          step={100}
          unit="ms"
          onChange={setAnimationDelay}
        />
        <Slider
          label="animationInterval"
          value={animationInterval}
          min={0}
          max={5000}
          step={100}
          unit="ms"
          onChange={setAnimationInterval}
        />
        <Slider
          label="animationCharacterSpacing"
          value={animationCharacterSpacing}
          min={0}
          max={5}
          unit=""
          onChange={setAnimationCharacterSpacing}
        />

        {/* animationCharacters */}
        <section className="ctrl-section">
          <h3 className="ctrl-heading">animationCharacters</h3>
          <input
            className="ctrl-input"
            value={animationCharacters}
            onChange={(e) => setAnimationCharacters(e.target.value)}
          />
        </section>

        {/* animationIteration */}
        <section className="ctrl-section">
          <h3 className="ctrl-heading">animationIteration</h3>
          <p className="ctrl-hint">only applies when animationLoop is off</p>
          <input
            type="number"
            className="ctrl-input ctrl-input--sm"
            min={1}
            max={100}
            value={animationIteration}
            onChange={(e) => setAnimationIteration(Number(e.target.value))}
          />
        </section>

        {/* toggles */}
        <section className="ctrl-section">
          <h3 className="ctrl-heading">options</h3>
          <div className="toggle-grid">
            <Toggle
              label="animationLoop"
              checked={animationLoop}
              onChange={setAnimationLoop}
            />
            <Toggle
              label="isAnimated"
              checked={isAnimated}
              onChange={setIsAnimated}
            />
            <Toggle
              label="isPaused"
              checked={isPaused}
              onChange={setIsPaused}
            />
            <Toggle
              label="fadeInOnly"
              checked={fadeInOnly}
              onChange={handleFadeInOnly}
            />
            <Toggle
              label="fadeOutOnly"
              checked={fadeOutOnly}
              onChange={handleFadeOutOnly}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
