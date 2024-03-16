## React ASCII Text

<div align="center">
  <img src='https://samuelweckstrom-github.s3.eu-central-1.amazonaws.com/react-ascii-text.gif' />
</div>

##

This library provides a React hook to render or animate ASCII text art using Figlet fonts.

[DEMO](https://samuel.weckstrom.xyz/react-ascii-text)
[Try the code out on StackBlitz](https://stackblitz.com/~/github.com/samuelweckstrom/react-ascii-text)

### Installation

```
npm install react-ascii-text
``````

## Usage

Figlet fonts are included in the package and can be imported. Full list of fonts along with UI to try them out can be found [here](https://patorjk.com/software/taag/#p=display&f=Graffiti&t=Type%20Something%20).

Note that the font names are converted to camelCasing, omitting spaces and hyphens to allow use as ES modules. This is to allow dynamic import of font and bundlers to only include the desired one in your project code.

| Font name| Import|
| ------------- | ------------- |
|1Row|`import { oneRow } from 'react-ascii-text`|
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
``````

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
``````

### Parameters

- `animationDirection` (optional, default: "horizontal"): Specifies the direction of the text animation. Possible are "down", "up", "left", "right", "horizontal", and "vertical".
- `animationCharacters` (optional, default: '0123456789'): Characters that replace the rendered text in the animation.
- `animationCharacterSpacing` (optional, default: 1): The spacing between animation characters.
- `animationDelay` (optional, default: 500): The delay before the animation starts in ms.
- `animationInterval` (optional, default: 1000): The interval (in milliseconds) between animations.
- `animationIteration` (optional, default: 1): The number of times the animation should repeat.
- `animationLoop` (optional, default: true): Whether the animation should loop indefinitely.
- `animationSpeed` (optional, default: 20): The speed of the animation, affecting how quickly frames transition.
- `fadeInOnly` (optional, default: false): Whether the animation should only fade in.
- `fadeOutOnly` (optional, default: false): Whether the animation should only fade out.
- `font` (optional, default: Slant): The font to be used for rendering the ASCII text.
- `isAnimated` (optional, default: true): Whether the text should be animated.
- `isPaused` (optional, default: false): Determines whether the animation is initially paused.
- `text` (optional, default: ["React", "ASCII", "Text"]): The ASCII text to be animated. It can be a single string or an array of strings to transition animations between strings.

### License

MIT
