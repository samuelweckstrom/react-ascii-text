import { useRef, useEffect, useCallback } from "react";
import { createFrames } from "./createFrames";
import { createAsciiText } from "./text";

const CHARACTER_SET = "/*+#";

export type AnimationDirection =
  | "up"
  | "right"
  | "down"
  | "left"
  | "horizontal"
  | "vertical";

type UseAsciiTextArgs = {
  /**
   * The text to be animated. Accepts a string or an array of strings. Default is ["React", "ASCII", "Text"].
   */
  text: string | string[];
  /**
   * Characters used in the animation. Default is CHARACTER_SET.
   */
  animationCharacters?: string;
  /**
   * Spacing between animation characters. Default is 1.
   */
  animationCharacterSpacing?: number;
  /**
   * Delay before the animation starts in ms. Default is 500.
   */
  animationDelay?: number;
  /**
   * Direction of the animation. Default is "horizontal".
   */
  animationDirection?: AnimationDirection;
  /**
   * Interval between animations in ms. Default is 1000.
   */
  animationInterval?: number;
  /**
   * Number of times the animation should repeat. Default is 1.
   */
  animationIteration?: number;
  /**
   * Whether the animation should loop indefinitely. Default is true.
   */
  animationLoop?: boolean;
  /**
   * How fast the animation runs. Default is 20.
   */
  animationSpeed?: number;
  /**
   * Whether the animation should only fade in. Default is false.
   */
  fadeInOnly?: boolean;
  /**
   * Whether the animation should only fade out. Default is false.
   */
  fadeOutOnly?: boolean;
  /**
   * The font to use for the text. No default value.
   */
  font?: string;
  /**
   * Whether the text should be animated. Default is true.
   */
  isAnimated?: boolean;
  /**
   * Whether the animation is paused. Default is false.
   */
  isPaused?: boolean;
};

type renderRef = {
  animationFrameId: number;
  animationIndex: number;
  animationIterationCount: number;
  animations: string[][][] | null;
  frameId: number;
  frameIndex: number;
  isPaused: boolean;
  isTimeout: boolean;
  previousTimeStamp: number;
  timeoutId: number;
};

export function useAsciiText({
  animationCharacters = CHARACTER_SET,
  animationCharacterSpacing = 1,
  animationDelay = 500,
  animationDirection = "horizontal",
  animationInterval = 1000,
  animationIteration = 1,
  animationLoop = true,
  animationSpeed = 20,
  fadeInOnly = false,
  fadeOutOnly = false,
  font,
  isAnimated = true,
  isPaused = false,
  text = ["React", "ASCII", "Text"],
}: UseAsciiTextArgs): React.MutableRefObject<HTMLPreElement | undefined> {
  const outputRef = useRef<HTMLPreElement>();
  const renderRef = useRef<renderRef>({
    animationFrameId: 0,
    animationIndex: 0,
    animationIterationCount: 1,
    animations: null,
    frameId: 0,
    frameIndex: 0,
    isPaused: false,
    isTimeout: false,
    previousTimeStamp: 0,
    timeoutId: 0,
  });

  const render = async (timeStamp: number) => {
    const { animations, isPaused, isTimeout, previousTimeStamp } =
      renderRef.current;

    if (!outputRef.current || !animations?.length || isPaused || isTimeout)
      return;

    const elapsedTimeSinceLastRender = timeStamp - previousTimeStamp;

    if (elapsedTimeSinceLastRender > animationSpeed) {
      const {
        animationIndex,
        animationIterationCount,
        animations,
        frameId,
        frameIndex,
      } = renderRef.current;

      const frameData = animations?.[animationIndex];

      if (!frameData || isTimeout) return;

      const isFirstFrame = frameIndex === 0;
      const isLastFrame = frameIndex === frameData.length - 1;
      const isLastAnimation = animationIndex === animations.length - 1;
      outputRef.current.textContent = frameData[frameIndex].join("\n");

      if (
        !animationLoop &&
        animationIterationCount === animationIteration &&
        isLastAnimation &&
        isLastFrame
      ) {
        cancelAnimationFrame(frameId);
        return;
      }

      renderRef.current.previousTimeStamp = timeStamp;

      const isMidFrame = frameIndex === Math.floor(frameData.length / 2);
      const isFadeIn = fadeInOnly || fadeOutOnly;

      const delay = async (time: number) => {
        await new Promise((resolve) => {
          renderRef.current.isTimeout = true;
          setTimeout(resolve, time);
        });
        renderRef.current.isTimeout = false;
      };

      if (isFadeIn && isLastFrame && animationDelay) {
        await delay(animationDelay);
      }

      if (isFadeIn && isFirstFrame && animationInterval) {
        await delay(animationInterval);
      }

      if (!isFadeIn && isMidFrame && animationDelay) {
        await delay(animationDelay);
      }

      if (!isFadeIn && isLastFrame && animationInterval) {
        await delay(animationInterval);
      }

      if (isLastFrame) {
        // increment to next animation
        renderRef.current.frameIndex = 0;
        renderRef.current.animationIndex++;
        renderRef.current.animationIterationCount++;
      } else {
        // increment frame
        renderRef.current.frameIndex++;
      }

      if (
        animationLoop &&
        renderRef.current.animationIndex === animations.length
      ) {
        // loop from start
        renderRef.current.animationIndex = 0;
      }
    }
    renderRef.current.frameId = requestAnimationFrame(render);
  };

  const init = useCallback(async () => {
    try {
      const asciiText = await createAsciiText(text, font);
      if (!isAnimated && outputRef.current) {
        outputRef.current.textContent = asciiText[0].join("\n");
      } else if (
        asciiText.length === (Array.isArray(text) ? text : [text]).length
      ) {
        renderRef.current.animations = await Promise.all([
          ...asciiText.map(
            async (text) =>
              await createFrames({
                asciiText: text,
                animationDirection,
                animationCharacters,
                animationCharacterSpacing,
                fadeInOnly,
                fadeOutOnly,
              })
          ),
        ]);
        requestAnimationFrame(render);
      }
    } catch (error) {
      console.error({ error });
    }
  }, []);

  useEffect(() => {
    if (isPaused) {
      renderRef.current.isPaused = true;
      cancelAnimationFrame(renderRef.current.frameId);
    } else {
      renderRef.current.isPaused = false;
      renderRef.current.frameId = requestAnimationFrame(render);
    }
  }, [isPaused, renderRef]);

  useEffect(() => {
    init();
  }, [text]);

  return outputRef;
}
