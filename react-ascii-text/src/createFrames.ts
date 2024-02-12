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

export async function createFrames({
  asciiText,
  animationDirection,
  animationCharacters,
  animationCharacterSpacing,
  fadeInOnly = false,
  fadeOutOnly = false,
}: CreateFrames): Promise<string[][]> {
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

      if (fadeOutOnly) return verticalFrames;

      const verticalFramesReversed = structuredClone(verticalFrames).reverse();

      if (fadeInOnly) return verticalFramesReversed;

      const verticalFramesLoop = verticalFramesReversed.concat(verticalFrames);
      return verticalFramesLoop;
    }
    const horizontalFrames = createHorizontalAnimationFrames({
      asciiText,
      animationDirection,
      animationCharacters,
      animationCharacterSpacing,
    });

    if (fadeInOnly) return structuredClone(horizontalFrames).reverse();

    const horizontalFramesReversed =
      structuredClone(horizontalFrames).reverse();

    if (fadeOutOnly) return horizontalFrames;

    const horizontalFramesLoop =
      horizontalFramesReversed.concat(horizontalFrames);
    return horizontalFramesLoop;
  } catch (error) {
    throw error + " @createFrames";
  }
}
