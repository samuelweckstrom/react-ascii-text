## ASCII Text Animator with Figlet Fonts

This library provides a React component and hook to animate ASCII text transformations using Figlet fonts. Users can either display the generated ASCII text in the chosen Figlet font or animate a transition between multiple texts in a morphing style.

### Installation

Make sure you have the necessary dependencies and styles installed and imported.

### Usage

#### AsciiText Component

Use the `AsciiText` component to display a static ASCII text or animate between multiple texts.

```tsx
import { AsciiText } from './path-to-ascii-text-component';

// Static ASCII text
function StaticComponent() {
    return <AsciiText text="Hello" />;

// Morphing between multiple texts
function AnimatedComponent() {
    return <AsciiText text={['Hello', 'World']} />;
}
```

#### useAsciiAnimation Hook

For more control, you can use the useAsciiAnimation hook.

```
import { useAsciiAnimation } from './path-to-your-hook';

function MyComponent() {
    const asciiRef = useAsciiAnimation({
        text: ['Hello', 'World'],
        morphInterval: 2000,
        morphSpeed: 10,
        font: 'Slant',
    });

    return <pre ref={asciiRef} />;
}
```

### Props & Configuration

#### AsciiText Props

- text: A string or an array of strings that you want to display or transition between.
- morphInterval (optional): Time in milliseconds between each morphing transition. Default is 3000 (3 seconds).
- morphSpeed (optional): Speed of each morphing transition. Default is 20.
- font (optional): The ASCII font style from the figlet library. Default is 'Slant'. Refer to the figlet library documentation for more font options.

#### useAsciiAnimation Hook Configuration

The hook configuration is the same as the AsciiText component props.

### Dependencies

This library relies on:
React (hooks)

### Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

### License

Your preferred license (e.g., MIT, GPL, etc.)
