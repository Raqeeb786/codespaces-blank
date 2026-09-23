import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type { Train } from "../types/railway";

import { updateSimulation } from "../simulation/engine";

interface UseRailwaySimulationOptions {
  initialTrains: Train[];
}

export function useRailwaySimulation({
  initialTrains,
}: UseRailwaySimulationOptions) {
  const [trains, setTrains] =
    useState<Train[]>(initialTrains);

  const [running, setRunning] =
    useState(false);

  const [simulationSpeed, setSimulationSpeed] =
    useState(1);

  const animationRef =
    useRef<number | null>(null);

  const previousTimeRef =
    useRef<number | null>(null);

  useEffect(() => {
    if (!running) {
      if (animationRef.current !== null) {
        cancelAnimationFrame(
          animationRef.current
        );
      }

      previousTimeRef.current = null;

      return;
    }

    const tick = (currentTime: number) => {
      if (
        previousTimeRef.current === null
      ) {
        previousTimeRef.current =
          currentTime;
      }

      const deltaMilliseconds =
        currentTime -
        previousTimeRef.current;

      previousTimeRef.current =
        currentTime;

      /*
       * Prevent giant jumps if the browser
       * gets suspended.
       */
      const deltaSeconds = Math.min(
        deltaMilliseconds / 1000,
        0.1
      );

      setTrains((currentTrains) =>
        updateSimulation(
          currentTrains,
          deltaSeconds,
          simulationSpeed
        )
      );

      animationRef.current =
        requestAnimationFrame(tick);
    };

    animationRef.current =
      requestAnimationFrame(tick);

    return () => {
      if (
        animationRef.current !== null
      ) {
        cancelAnimationFrame(
          animationRef.current
        );
      }
    };
  }, [
    running,
    simulationSpeed,
  ]);

  const start = useCallback(() => {
    setRunning(true);
  }, []);

  const pause = useCallback(() => {
    setRunning(false);
  }, []);

  const reset = useCallback(() => {
    setRunning(false);

    setTrains(
      initialTrains.map((train) => ({
        ...train,
      }))
    );
  }, [initialTrains]);

  return {
    trains,

    running,

    simulationSpeed,

    setSimulationSpeed,

    start,

    pause,

    reset,
  };
}
