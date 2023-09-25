import figlet from "figlet";

const DEFAULT_FONT = "Slant" as figlet.Fonts;

export async function createAsciiText(
  text: string | string[],
  font?: string
): Promise<[string[]]> {
  const fontImport: string = !font
    ? (await import("./fonts/Slant.js")).default
    : "";
  figlet.parseFont(DEFAULT_FONT, font || fontImport);

  const createFigletText = async (textItem: string): Promise<string[]> => {
    return await new Promise((resolve, reject) => {
      figlet.text(
        textItem,
        {
          font: DEFAULT_FONT,
        },
        (err: Error | null, data: string | undefined) => {
          if (err) reject("Failed to load font");
          if (!data) reject("No ASCII text generated");
          else resolve(data.split("\n"));
        }
      );
    });
  };

  const asciiText: any = [];
  for await (const textItem of Array.isArray(text) ? text : [text]) {
    const figletText: string[] = await createFigletText(textItem);
    asciiText.push(figletText);
  }

  return asciiText;
}
