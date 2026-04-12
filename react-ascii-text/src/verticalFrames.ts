import { createSpacing, replaceNonWhitespaceWithRandom } from "./utils";
import { type AnimationDirection } from "./useAsciiText";

type CreateVerticalAnimationFrames = {
  asciiText: string[];
  animationDirection: AnimationDirection;
  animationCharacters: string;
  animationCharacterSpacing: number;
};

const RE_NON_WS = /\S/;

export function createVerticalAnimationFrames({
  asciiText,
  animationDirection,
  animationCharacters,
  animationCharacterSpacing,
}: CreateVerticalAnimationFrames): string[][] {
  const spacedCharacters = createSpacing(
    animationCharacters,
    animationCharacterSpacing
  );

  return asciiText.reduce(
    (result: string[][], textLine, index) => {
      if (index === 0) return result;

      const prevFrame = result[result.length - 1]
        ? [...result[result.length - 1]]
        : undefined;
      if (!prevFrame) return result;

      const firstLineHasChar = RE_NON_WS.test(prevFrame[index - 1]);
      const lastindex = prevFrame.length - index;
      const lastLineHasChar = RE_NON_WS.test(prevFrame[lastindex]);
      const newFrame = [...prevFrame];

      if (
        firstLineHasChar &&
        (animationDirection === "up" || animationDirection === "vertical")
      ) {
        if (prevFrame[index]) {
          prevFrame[index] = replaceNonWhitespaceWithRandom(
            prevFrame[index],
            spacedCharacters
          );
        }
        if (prevFrame[index - 1]) {
          prevFrame[index - 1] = " ".repeat(textLine.length);
        }
        if (newFrame[index]) {
          newFrame[index] = replaceNonWhitespaceWithRandom(
            newFrame[index],
            animationCharacters
          );
        }
      }
      if (
        lastLineHasChar &&
        (animationDirection === "down" || animationDirection === "vertical")
      ) {
        if (prevFrame[lastindex]) {
          prevFrame[lastindex] = replaceNonWhitespaceWithRandom(
            prevFrame[lastindex],
            spacedCharacters
          );
        }
        if (prevFrame[lastindex + 1]) {
          prevFrame[lastindex + 1] = " ".repeat(textLine.length);
        }
        if (newFrame[lastindex]) {
          newFrame[lastindex] = replaceNonWhitespaceWithRandom(
            newFrame[lastindex],
            animationCharacters
          );
        }
      }
      if (firstLineHasChar || lastLineHasChar) {
        result.push(newFrame, prevFrame);
      }

      if (index === asciiText.length - 1 && animationDirection === "up") {
        const lastFrame = [...prevFrame];
        lastFrame[lastFrame.length - 1] = " ".repeat(
          lastFrame[lastFrame.length - 1].length
        );
        result.push(lastFrame);
      }

      if (index === asciiText.length - 1 && animationDirection === "down") {
        const nextFrame = [...prevFrame];
        nextFrame[newFrame.length - index] = " ".repeat(
          nextFrame[newFrame.length - index].length
        );

        result.push(nextFrame);
        const nextFrame2 = [...nextFrame];
        if (!RE_NON_WS.test(nextFrame2[0])) return result;
        nextFrame2[0] = replaceNonWhitespaceWithRandom(
          nextFrame2[0],
          spacedCharacters
        );
        result.push(nextFrame2);

        const nextFrame3 = [...nextFrame2];
        if (!RE_NON_WS.test(nextFrame3[0])) return result;
        nextFrame3[0] = replaceNonWhitespaceWithRandom(
          nextFrame3[0],
          spacedCharacters
        );
        result.push(nextFrame3);

        const nextFrame4 = [...nextFrame3];
        if (!RE_NON_WS.test(nextFrame4[0])) return result;
        nextFrame4[0] = " ".repeat(nextFrame4[0].length);
        result.push(nextFrame4);
      }

      return result;
    },
    [[...asciiText]]
  );
}
