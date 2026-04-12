import { createVerticalAnimationFrames } from "./verticalFrames";
import { createHorizontalAnimationFrames } from "./horizontalFrames";
import { type AnimationDirection } from "./useAsciiText";

type CreateFrames = {
  asciiText: string[];
  animationDirection: AnimationDirection;
  animationCharacters: string;
  animationCharacterSpacing: number;
  fadeInOnly: boolean;
  fadeOutOnly: boolean;
};

function joinFrames(frames: string[][]): string[] {
  return frames.map((frame) => frame.join("\n"));
}

export function createFrames({
  asciiText,
  animationDirection,
  animationCharacters,
  animationCharacterSpacing,
  fadeInOnly = false,
  fadeOutOnly = false,
}: CreateFrames): string[] {
  try {
    if (
      animationDirection === "down" ||
      animationDirection === "up" ||
      animationDirection === "vertical"
    ) {
      const verticalFrames = createVerticalAnimationFrames({
        asciiText,
        animationDirection,
        animationCharacters,
        animationCharacterSpacing,
      });

      if (fadeOutOnly) return joinFrames(verticalFrames);

      const verticalFramesReversed = verticalFrames.slice().reverse();

      if (fadeInOnly) return joinFrames(verticalFramesReversed);

      return joinFrames(verticalFramesReversed.concat(verticalFrames));
    }

    const horizontalFrames = createHorizontalAnimationFrames({
      asciiText,
      animationDirection,
      animationCharacters,
      animationCharacterSpacing,
    });

    if (fadeInOnly) return joinFrames(horizontalFrames.slice().reverse());

    const horizontalFramesReversed = horizontalFrames.slice().reverse();

    if (fadeOutOnly) return joinFrames(horizontalFrames);

    return joinFrames(horizontalFramesReversed.concat(horizontalFrames));
  } catch (error) {
    throw new Error(`createFrames failed: ${error}`);
  }
}
