## React ASCII Text

<div align="center">
  <img src='https://samuelweckstrom-github.s3.eu-central-1.amazonaws.com/react-ascii-text.gif' />
</div>

##

This library provides a React hook to render or animate ASCII text art using Figlet fonts. Works with React 17 +, including Next.js App Router (the `"use client"` directive is already included in the package).

[DEMO](https://samuel.weckstrom.dev/react-ascii-text)
[Try the code out on StackBlitz](https://stackblitz.com/~/github.com/samuelweckstrom/react-ascii-text)

### Installation

```
npm install react-ascii-text
# or
pnpm add react-ascii-text
# or
yarn add react-ascii-text
```

## Usage

Figlet fonts are included in the package and can be imported. Full list of fonts along with UI to try them out can be found [here](https://patorjk.com/software/taag/#p=display&f=Graffiti&t=Type%20Something%20).

Note that the font names are converted to camelCasing, omitting spaces and hyphens to allow use as ES modules. This allows bundlers to include only the fonts you actually import.

| Font name| Import|
| ------------- | ------------- |
|1Row|`import { oneRow } from 'react-ascii-text'`|
|3-D|`import { threeD } from 'react-ascii-text'`|
|5 Line Oblique|`import { fiveLineOblique } from 'react-ascii-text'`|
|Big Money-sw|`import { bigMoneySw } from 'react-ascii-text'`|
etc.

### Render ASCII text

Passing a single string will render the text in a Figlet font.

```javascript
import { useAsciiText, alligator } from 'react-ascii-text';

function MyComponent() {
  const asciiTextRef = useAsciiText({
    font: alligator,
    text: "Hello, World!",
  });

  return <pre ref={asciiTextRef}></pre>;
}
```

### Animate ASCII text

Pass an array of strings to animate a transition between them.

```javascript
import { useAsciiText, alligator } from 'react-ascii-text';

function MyComponent() {
  const asciiTextRef = useAsciiText({
    animationCharacters: "▒░█",
    animationCharacterSpacing: 1,
    animationDelay: 2000,
    animationDirection: "down",
    animationInterval: 100,
    animationLoop: true,
    animationSpeed: 30,
    font: alligator,
    text: ["REACT", "ASCII", "TEXT"],
  });

  return <pre ref={asciiTextRef}></pre>;
}
```

### Parameters

- `animationDirection` (optional, default: `"horizontal"`): Direction of the animation. One of `"down"`, `"up"`, `"left"`, `"right"`, `"horizontal"`, or `"vertical"`.
- `animationCharacters` (optional, default: `"/*+#"`): Characters used to replace text during the animation transition.
- `animationCharacterSpacing` (optional, default: `1`): Spacing between animation characters.
- `animationDelay` (optional, default: `500`): Pause duration in ms at the midpoint of each animation.
- `animationInterval` (optional, default: `1000`): Gap in ms between consecutive animations.
- `animationIteration` (optional, default: `1`): Number of times the animation repeats before stopping (ignored when `animationLoop` is `true`).
- `animationLoop` (optional, default: `true`): Whether the animation loops indefinitely.
- `animationSpeed` (optional, default: `20`): Frame throttle in ms — lower values are faster.
- `fadeInOnly` (optional, default: `false`): Only play the fade-in half of the animation.
- `fadeOutOnly` (optional, default: `false`): Only play the fade-out half of the animation.
- `font` (optional, default: Slant): Figlet font data to use for rendering.
- `isAnimated` (optional, default: `true`): Render static text when `false`.
- `isPaused` (optional, default: `false`): Reactive prop — set to `true` to pause the animation, `false` to resume.
- `text` (optional, default: `["React", "ASCII", "Text"]`): Text to render. A single string renders statically; an array animates transitions between each string.

### License

MIT
