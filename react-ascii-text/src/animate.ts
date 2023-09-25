import type { AnimationDirection } from "./useAsciiText";

const CHARACTER_SET = "/*+#";
const CHARACTER_SET_SPACED = "/ * + #";

function replaceText(text: string, index: number, character: string): string {
  return (
    text.substring(0, index) +
    character +
    text.substring(index + character.length)
  );
}

function getRandomCharacter(characterSet: string): string {
  return characterSet[Math.floor(Math.random() * characterSet.length)];
}

function createHorizontalAnimationFrames(
  asciiTextFrame: string[],
  direction: AnimationDirection = "horizontal",
  animationCharacters?: string
): [string[]] {
  const newFrames: [string[]] = [[...structuredClone(asciiTextFrame)]];
  const frameStringLength =
    direction === "left" || direction === "right"
      ? asciiTextFrame[0].length
      : asciiTextFrame[0].length / 2;

  Array.from({ length: frameStringLength }).forEach((_, index) => {
    const CENTER_Y = 1;
    if (index === 0) {
      newFrames.push(asciiTextFrame);
      return;
    }

    const newFrame = newFrames[index].map((item, index, array) => {
      const firstCharIndex = item.search(/\S/);
      const lastCharIndex = item.search(/\S(?!.*\S)/);
      if (firstCharIndex !== -1 && lastCharIndex !== -1) {
        const animationCharCount = index > CENTER_Y ? -1 : 1;
        if (direction === "left" || direction === "horizontal") {
          item = replaceText(item, firstCharIndex, " ");
        }
        if (direction === "right" || direction === "horizontal") {
          item = replaceText(item, lastCharIndex, " ");
        }
        if (lastCharIndex - firstCharIndex > 2) {
          if (direction === "left" || direction === "horizontal") {
            const animationChar = getRandomCharacter(
              animationCharacters || CHARACTER_SET
            );
            array[index + animationCharCount] = replaceText(
              array[index + animationCharCount],
              firstCharIndex + 1,
              animationChar
            );
          }
          if (direction === "right" || direction === "horizontal") {
            const animationChar = getRandomCharacter(
              animationCharacters || CHARACTER_SET
            );
            array[index + animationCharCount] = replaceText(
              array[index + animationCharCount],
              lastCharIndex - 1,
              animationChar
            );
          }
        }
      }
      return item;
    });
    newFrames.push(newFrame);
  });
  return newFrames;
}

function replaceNonWhitespaceWithRandom(
  string: string,
  characterSet: string
): string {
  return string
    .split("")
    .map((char) => (/\s/.test(char) ? char : getRandomCharacter(characterSet)))
    .join("");
}

function createVerticalAnimationFrames(
  asciiTextFrame: string[],
  animationDirection: AnimationDirection,
  animationCharacters?: string
): [string[]] {
  return asciiTextFrame.reduce(
    (result, textLine, index) => {
      if (index === 0) return result;

      const prevFrame = result?.[result.length - 1]
        ? [...result[result.length - 1]]
        : undefined;
      if (!prevFrame) return result;
      const firstLineHasChar = /\S/.test(prevFrame[index - 1]);
      const lastindex = prevFrame.length - index;
      const lastLineHasChar = /\S/.test(prevFrame[lastindex]);
      let newFrame = [...prevFrame];

      if (
        firstLineHasChar &&
        (animationDirection === "up" || animationDirection === "vertical")
      ) {
        if (prevFrame?.[index]) {
          prevFrame[index] = replaceNonWhitespaceWithRandom(
            prevFrame[index],
            animationCharacters || CHARACTER_SET_SPACED
          );
        }
        if (prevFrame?.[index - 1]) {
          prevFrame[index - 1] = " ".repeat(textLine.length);
        }
        if (newFrame[index]) {
          newFrame[index] = replaceNonWhitespaceWithRandom(
            newFrame[index],
            animationCharacters || CHARACTER_SET
          );
        }
      }
      if (
        lastLineHasChar &&
        (animationDirection === "down" || animationDirection === "vertical")
      ) {
        if (prevFrame?.[lastindex]) {
          prevFrame[lastindex] = replaceNonWhitespaceWithRandom(
            prevFrame[lastindex],
            animationCharacters || CHARACTER_SET_SPACED
          );
        }
        if (prevFrame?.[lastindex + 1]) {
          prevFrame[lastindex + 1] = " ".repeat(textLine.length);
        }
        if (newFrame?.[lastindex]) {
          newFrame[lastindex] = replaceNonWhitespaceWithRandom(
            newFrame[lastindex],
            animationCharacters || CHARACTER_SET
          );
        }
      }
      if (firstLineHasChar || lastLineHasChar) {
        result.push(newFrame, prevFrame);
      }

      if (index === asciiTextFrame.length - 1 && animationDirection === "up") {
        const lastFrame = [...prevFrame];
        lastFrame[lastFrame.length - 1] = " ".repeat(
          lastFrame[lastFrame.length - 1].length
        );
        result.push(lastFrame);
      }

      if (
        index === asciiTextFrame.length - 1 &&
        animationDirection === "down"
      ) {
        const nextFrame = [...prevFrame];
        nextFrame[newFrame.length - index] = " ".repeat(
          nextFrame[newFrame.length - index].length
        );

        result.push(nextFrame);
        const nextFrame2 = [...nextFrame];
        const hasChar = /\S/.test(nextFrame2[0]);
        if (!hasChar) return result;
        nextFrame2[0] = replaceNonWhitespaceWithRandom(
          nextFrame2[0],
          animationCharacters || CHARACTER_SET_SPACED
        );
        result.push(nextFrame2);
        const nextFrame3 = [...nextFrame2];

        if (!/\S/.test(nextFrame3[0])) return result;
        nextFrame3[0] = replaceNonWhitespaceWithRandom(
          nextFrame3[0],
          animationCharacters || CHARACTER_SET_SPACED
        );
        result.push(nextFrame3);

        const nextFrame4 = [...nextFrame3];
        if (!/\S/.test(nextFrame4[0])) return result;
        nextFrame4[0] = " ".repeat(nextFrame4[0].length);
        result.push(nextFrame4);
      }

      if (index === asciiTextFrame.length - 1 && animationDirection === "up") {
      }

      return result;
    },
    [[...asciiTextFrame]]
  );
}

export async function createFrames(
  asciiText: string[],
  direction?: AnimationDirection,
  animationCharacters?: string
): Promise<[string[]]> {
  try {
    if (
      direction === "down" ||
      direction === "up" ||
      direction === "vertical"
    ) {
      const frames = createVerticalAnimationFrames(
        asciiText,
        direction,
        animationCharacters
      );
      const reverse = structuredClone(frames).reverse();
      const combined = reverse.concat(frames) as [string[]];
      return combined;
    }
    const horizontalFrames = createHorizontalAnimationFrames(
      asciiText,
      direction,
      animationCharacters
    );
    const reversedFrames = structuredClone(horizontalFrames).reverse();
    const loop = reversedFrames.concat(horizontalFrames) as [string[]];
    return loop;
  } catch (error) {
    throw error + " @createFrames";
  }
}
