"use client";

import { useRef, useEffect, useCallback, type RefObject } from "react";
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

type RenderState = {
  animationFrameId: number;
  animationIndex: number;
  animationIterationCount: number;
  animations: string[][] | null;
  frameId: number;
  frameIndex: number;
  isPaused: boolean;
  isTimeout: boolean;
  previousTimeStamp: number;
  timeoutId: number;
};

type AnimationOptions = {
  animationDelay: number;
  animationInterval: number;
  animationIteration: number;
  animationLoop: boolean;
  animationSpeed: number;
  fadeInOnly: boolean;
  fadeOutOnly: boolean;
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
}: UseAsciiTextArgs): RefObject<HTMLPreElement | null> {
  const outputRef = useRef<HTMLPreElement | null>(null);
  const renderStateRef = useRef<RenderState>({
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


  const optionsRef = useRef<AnimationOptions>({
    animationDelay,
    animationInterval,
    animationIteration,
    animationLoop,
    animationSpeed,
    fadeInOnly,
    fadeOutOnly,
  });

  optionsRef.current.animationDelay = animationDelay;
  optionsRef.current.animationInterval = animationInterval;
  optionsRef.current.animationIteration = animationIteration;
  optionsRef.current.animationLoop = animationLoop;
  optionsRef.current.animationSpeed = animationSpeed;
  optionsRef.current.fadeInOnly = fadeInOnly;
  optionsRef.current.fadeOutOnly = fadeOutOnly;

  const render = useCallback(async (timeStamp: number) => {
    const { animations, isPaused, isTimeout, previousTimeStamp } =
      renderStateRef.current;

    if (!outputRef.current || !animations?.length || isPaused || isTimeout)
      return;

    const {
      animationDelay,
      animationInterval,
      animationIteration,
      animationLoop,
      animationSpeed,
      fadeInOnly,
      fadeOutOnly,
    } = optionsRef.current;

    const elapsedTimeSinceLastRender = timeStamp - previousTimeStamp;

    if (elapsedTimeSinceLastRender > animationSpeed) {
      const { animationIndex, animationIterationCount, frameId, frameIndex } =
        renderStateRef.current;

      const frameData = animations[animationIndex];

      if (!frameData || isTimeout) return;

      const isFirstFrame = frameIndex === 0;
      const isLastFrame = frameIndex === frameData.length - 1;
      const isLastAnimation = animationIndex === animations.length - 1;
      outputRef.current.textContent = frameData[frameIndex];

      if (
        !animationLoop &&
        animationIterationCount === animationIteration &&
        isLastAnimation &&
        isLastFrame
      ) {
        cancelAnimationFrame(frameId);
        return;
      }

      renderStateRef.current.previousTimeStamp = timeStamp;

      const isMidFrame = frameIndex === Math.floor(frameData.length / 2);
      const isFadeOnly = fadeInOnly || fadeOutOnly;

      const delay = async (time: number) => {
        await new Promise<void>((resolve) => {
          renderStateRef.current.isTimeout = true;
          renderStateRef.current.timeoutId = window.setTimeout(resolve, time);
        });
        renderStateRef.current.isTimeout = false;
      };

      if (isFadeOnly && isLastFrame && animationDelay) {
        await delay(animationDelay);
      }
      if (isFadeOnly && isFirstFrame && animationInterval) {
        await delay(animationInterval);
      }
      if (!isFadeOnly && isMidFrame && animationDelay) {
        await delay(animationDelay);
      }
      if (!isFadeOnly && isLastFrame && animationInterval) {
        await delay(animationInterval);
      }

      if (isLastFrame) {
        renderStateRef.current.frameIndex = 0;
        renderStateRef.current.animationIndex++;
        renderStateRef.current.animationIterationCount++;
      } else {
        renderStateRef.current.frameIndex++;
      }

      if (
        animationLoop &&
        renderStateRef.current.animationIndex === animations.length
      ) {
        renderStateRef.current.animationIndex = 0;
      }
    }
    renderStateRef.current.frameId = requestAnimationFrame(render);
  }, []);

  const init = useCallback(async () => {
    try {
      if (renderStateRef.current.frameId) {
        cancelAnimationFrame(renderStateRef.current.frameId);
      }

      renderStateRef.current.animationIndex = 0;
      renderStateRef.current.animationIterationCount = 1;
      renderStateRef.current.frameIndex = 0;
      renderStateRef.current.isTimeout = false;
      renderStateRef.current.previousTimeStamp = 0;

      const asciiText = await createAsciiText(text, font);

      if (!isAnimated && outputRef.current) {
        outputRef.current.textContent = asciiText[0].join("\n");
      } else if (
        asciiText.length === (Array.isArray(text) ? text : [text]).length
      ) {
        renderStateRef.current.animations = asciiText.map((textLines) =>
          createFrames({
            asciiText: textLines,
            animationDirection,
            animationCharacters,
            animationCharacterSpacing,
            fadeInOnly,
            fadeOutOnly,
          })
        );
        renderStateRef.current.frameId = requestAnimationFrame(render);
      }
    } catch (error) {
      console.error(error);
    }
  }, [
    text,
    font,
    isAnimated,
    animationDirection,
    animationCharacters,
    animationCharacterSpacing,
    animationIteration,
    animationLoop,
    fadeInOnly,
    fadeOutOnly,
  ]);

  useEffect(() => {
    if (isPaused && renderStateRef.current.frameId) {
      renderStateRef.current.isPaused = true;
      cancelAnimationFrame(renderStateRef.current.frameId);
    } else if (!isPaused && renderStateRef.current.isPaused) {
      renderStateRef.current.isPaused = false;
      renderStateRef.current.frameId = requestAnimationFrame(render);
    }
  }, [isPaused]);

  useEffect(() => {
    init();
    return () => {
      if (renderStateRef.current.frameId) {
        cancelAnimationFrame(renderStateRef.current.frameId);
      }
      if (renderStateRef.current.timeoutId) {
        clearTimeout(renderStateRef.current.timeoutId);
      }
    };
  }, [init]);

  return outputRef;
}
