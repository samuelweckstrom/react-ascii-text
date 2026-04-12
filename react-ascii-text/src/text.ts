import figlet from "figlet";

const DEFAULT_FONT = "Slant" as figlet.Fonts;

export async function createAsciiText(
  text: string | string[],
  font?: string
): Promise<string[][]> {
  const fontImport: string = !font
    ? (await import("./fonts/Slant.js")).default
    : "";
  figlet.parseFont(DEFAULT_FONT, font || fontImport);

  const createFigletText = (textItem: string): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      figlet.text(
        textItem,
        { font: DEFAULT_FONT },
        (err: Error | null, data: string | undefined) => {
          if (err) reject(new Error("Failed to load font"));
          else if (!data) reject(new Error("No ASCII text generated"));
          else resolve(data.split("\n"));
        }
      );
    });
  };

  const asciiText: string[][] = [];
  for (const textItem of Array.isArray(text) ? text : [text]) {
    asciiText.push(await createFigletText(textItem));
  }

  return asciiText;
}
