import { useRef, useEffect, useCallback } from "react";
import { createFrames } from "./animate";
import { createAsciiText } from "./text";

export type AnimationDirection =
  | "down"
  | "up"
  | "left"
  | "right"
  | "horizontal"
  | "vertical";

type UseAsciiTextArgs = {
  animationDirection?: AnimationDirection;
  animationInterval?: number;
  animationLoop?: boolean;
  animationLoopTimeout?: number;
  animationSpeed?: number;
  fadeIn?: boolean;
  fadeOut?: boolean;
  font?: string;
  text: string | string[];
  isPaused?: boolean;
};

type AnimationRef = {
  frameId: number;
  timeoutId: number;
  isPaused: boolean;
  animationFrameId: number;
  animations: [string[]][] | null;
  animationIndex: number;
  frameIndex: number;
  previousTimeStamp: number;
};

export function useAsciiText({
  animationDirection = "horizontal",
  animationInterval = 1000,
  animationLoop,
  animationSpeed = 20,
  font,
  isPaused,
  text,
}: UseAsciiTextArgs) {
  const outputRef = useRef<HTMLPreElement>();
  const animationRef = useRef<AnimationRef>({
    animationFrameId: 0,
    animationIndex: 0,
    animations: null,
    frameId: 0,
    frameIndex: 0,
    isPaused: false,
    previousTimeStamp: 0,
    timeoutId: 0,
  });

  const createFrame = async (asciiTexts: [string[]]): Promise<[string[]][]> =>
    await Promise.all([
      ...asciiTexts.map(
        async (asciiText) => await createFrames(asciiText, animationDirection)
      ),
    ]);

  const render = async (timeStamp: number) => {
    if (animationRef.current.isPaused) {
      return;
    }

    if (timeStamp >= animationRef.current.previousTimeStamp + animationSpeed) {
      animationRef.current.previousTimeStamp = timeStamp; // set timestamp
      const { animations, animationIndex, frameIndex } = animationRef.current;
      const frameData = animations?.[animationIndex];

      if (!frameData) return;
      if (outputRef.current) {
        outputRef.current.textContent = frameData[frameIndex].join("\n");
      }

      if (frameIndex === Math.floor(frameData.length / 2)) {
        await new Promise((resolve) => setTimeout(resolve, animationInterval));
        if (animationIndex === animations?.length - 1 && !animationLoop) {
          cancelAnimationFrame(animationRef.current.frameId);
          return;
        }
      }

      if (
        animations?.length === 1 ||
        (!animationLoop && animationIndex === animations?.length)
      ) {
        cancelAnimationFrame(animationRef.current.frameId);
        return;
      }

      if (frameIndex === frameData.length - 1) {
        animationRef.current.frameIndex = 0;
        animationRef.current.animationIndex++;
      } else {
        animationRef.current.frameIndex++;
      }

      if (animationRef.current.animationIndex === animations.length) {
        animationRef.current.animationIndex = 0;
      }
    }
    animationRef.current.frameId = requestAnimationFrame(render);
  };

  useEffect(() => {
    if (isPaused) {
      animationRef.current.isPaused = true;
      cancelAnimationFrame(animationRef.current.frameId);
    } else {
      animationRef.current.isPaused = false;
      requestAnimationFrame(render);
    }
  }, [isPaused, animationRef]);

  const init = useCallback(async () => {
    try {
      const asciiText = await createAsciiText(text, font);
      if (
        text.length &&
        asciiText.length === 1 &&
        asciiText[0].length &&
        outputRef.current
      ) {
        outputRef.current.textContent = asciiText[0].join("\n");
      } else if (Array.isArray(text) && asciiText.length === text.length) {
        animationRef.current.animations = await createFrame(asciiText);
        requestAnimationFrame(render);
      }
    } catch (error) {
      console.error({ error });
    }
  }, []);

  useEffect(() => {
    init();
  }, [text, init]);

  return outputRef;
}
