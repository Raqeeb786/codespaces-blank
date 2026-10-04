import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  Train,
  TrackBlock,
  Signal,
} from "../types/railway";

import { updateSimulation } from "../simulation/engine";

interface UseRailwaySimulationOptions {
  initialTrains: Train[];
  initialBlocks: TrackBlock[];
  initialSignals: Signal[];
}

interface SimulationState {
  trains: Train[];
  blocks: TrackBlock[];
  signals: Signal[];
}

export function useRailwaySimulation({
  initialTrains,
  initialBlocks,
  initialSignals,
}: UseRailwaySimulationOptions) {
  const [simulation, setSimulation] =
    useState<SimulationState>({
      trains: initialTrains,
      blocks: initialBlocks,
      signals: initialSignals,
    });

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
      if (
        animationRef.current !== null
      ) {
        cancelAnimationFrame(
          animationRef.current
        );
      }

      previousTimeRef.current = null;

      return;
    }

    const tick = (
      currentTime: number
    ) => {
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

      const deltaSeconds =
        Math.min(
          deltaMilliseconds / 1000,
          0.1
        );

      /*
       * IMPORTANT:
       *
       * The entire simulation is updated
       * together.
       *
       * trains
       * blocks
       * signals
       *
       * all come from the same state.
       */

      setSimulation(
        (currentState) =>
          updateSimulation(
            currentState,
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

    previousTimeRef.current = null;

    setSimulation({
      trains: initialTrains.map(
        (train) => ({
          ...train,
        })
      ),

      blocks: initialBlocks.map(
        (block) => ({
          ...block,
        })
      ),

      signals: initialSignals.map(
        (signal) => ({
          ...signal,
        })
      ),
    });
  }, [
    initialTrains,
    initialBlocks,
    initialSignals,
  ]);

  return {
    trains: simulation.trains,

    blocks: simulation.blocks,

    signals: simulation.signals,

    running,

    simulationSpeed,

    setSimulationSpeed,

    start,

    pause,

    reset,
  };
}
