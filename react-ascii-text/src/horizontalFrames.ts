import { getRandomCharacter, replaceText } from "./utils";
import { type AnimationDirection } from "./useAsciiText";

type CreateHorizontalAnimationFrames = {
  asciiText: string[];
  animationDirection: AnimationDirection;
  animationCharacters: string;
  animationCharacterSpacing: number;
};

const CENTER_Y = 1;

export function createHorizontalAnimationFrames({
  asciiText,
  animationDirection,
  animationCharacters,
}: CreateHorizontalAnimationFrames): string[][] {
  const newFrames: string[][] = [[...structuredClone(asciiText)]];
  const frameStringLength =
    asciiText[0].length /
    (animationDirection === "left" || animationDirection === "right" ? 1 : 2);

  for (let index = 0; index < frameStringLength; index++) {
    if (index === 0) {
      newFrames.push(asciiText);
      continue;
    }

    const newFrame = newFrames[index].map((item, index, array) => {
      const firstCharIndex = item.search(/\S/);
      const lastCharIndex = item.search(/\S(?!.*\S)/);
      if (firstCharIndex === -1 || lastCharIndex === -1) return item;

      const animationCharacterOffset = index > CENTER_Y ? -1 : 1;
      if (
        animationDirection === "left" ||
        animationDirection === "horizontal"
      ) {
        item = replaceText(item, firstCharIndex, " ");
      }
      if (
        animationDirection === "right" ||
        animationDirection === "horizontal"
      ) {
        item = replaceText(item, lastCharIndex, " ");
      }
      if (lastCharIndex - firstCharIndex <= 2) return item;

      if (
        animationDirection === "left" ||
        animationDirection === "horizontal"
      ) {
        const animationChar = getRandomCharacter(animationCharacters);
        array[index + animationCharacterOffset] = replaceText(
          array[index + animationCharacterOffset],
          firstCharIndex + 1,
          animationChar
        );
      }
      return item;
    });
    newFrames.push(newFrame);
  }
  return newFrames;
}
