export function createSpacing(text: string, spacing: number): string {
  return text.replace(/.(?=.)/g, `$&${" ".repeat(spacing)}`);
}

export function replaceText(
  text: string,
  index: number,
  character: string
): string {
  return text.substring(0, index) + character + text.substring(index + 1);
}

export function getRandomCharacter(characterSet: string): string {
  return characterSet[Math.floor(Math.random() * characterSet.length)];
}

export function replaceNonWhitespaceWithRandom(
  str: string,
  characterSet: string
): string {
  const len = characterSet.length;
  let result = "";
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    result +=
      c === " " || c === "\t" || c === "\n" || c === "\r"
        ? c
        : characterSet[Math.floor(Math.random() * len)];
  }
  return result;
}
