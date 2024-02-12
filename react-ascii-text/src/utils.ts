export function createSpacing(text: string, spacing: number): string {
  return text.replace(/.(?=.)/g, `$&${" ".repeat(spacing)}`);
}

export function replaceText(
  text: string,
  index: number,
  character: string
): string {
  return (
    text.substring(0, index) +
    character +
    text.substring(index + character.length)
  );
}

export function getRandomCharacter(characterSet: string): string {
  return characterSet[Math.floor(Math.random() * characterSet.length)];
}

export function replaceNonWhitespaceWithRandom(
  string: string,
  characterSet: string
): string {
  return string
    .split("")
    .map((char) => (/\s/.test(char) ? char : getRandomCharacter(characterSet)))
    .join("");
}

export function createNextFrame(
  prevFrame: string[],
  index: number,
  characters: string
): string[] {
  const nextFrame = [...prevFrame];
  nextFrame[nextFrame.length - index] = " ".repeat(
    nextFrame[nextFrame.length - index].length
  );

  const hasChar = /\S/.test(nextFrame[0]);
  if (!hasChar) return nextFrame;

  nextFrame[0] = replaceNonWhitespaceWithRandom(nextFrame[0], characters);
  return nextFrame;
}

export function replaceAndRepeat(
  frame: string[],
  index: number,
  characters: string,
  textLine: string
) {
  if (frame?.[index]) {
    frame[index] = replaceNonWhitespaceWithRandom(frame[index], characters);
  }
  if (frame?.[index - 1]) {
    frame[index - 1] = " ".repeat(textLine.length);
  }
}
