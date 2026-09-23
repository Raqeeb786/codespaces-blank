import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type { Train, TrackBlock } from "../types/railway"; // Ensure TrackBlock is imported
import { updateSimulation } from "../simulation/engine";

interface UseRailwaySimulationOptions {
  initialTrains: Train[];
  initialBlocks: TrackBlock[]; // 1. Added initialBlocks to options interface
}

export function useRailwaySimulation({
  initialTrains,
  initialBlocks, // 2. Destructure initialBlocks here
}: UseRailwaySimulationOptions) {
  const [trains, setTrains] =
    useState<Train[]>(initialTrains);

  // 3. Track blocks state so the UI can update when a train enters a block
  const [blocks, setBlocks] = 
    useState<TrackBlock[]>(initialBlocks);

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
      if (previousTimeRef.current === null) {
        previousTimeRef.current = currentTime;
      }

      const deltaMilliseconds = currentTime - previousTimeRef.current;
      previousTimeRef.current = currentTime;

      /*
      * Prevent giant jumps if the browser gets suspended.
      */
      const deltaSeconds = Math.min(deltaMilliseconds / 1000, 0.1);

      // 1. We must read the current state of both trains and blocks together
      setTrains((currentTrains) => {
        // We use a functional update step to combine the current data safely
        setBlocks((currentBlocks) => {
          
          // 2. Wrap them into the single 'state' object that engine.ts expects
          const updatedState = updateSimulation(
            {
              trains: currentTrains,
              blocks: currentBlocks,
            },
            deltaSeconds,
            simulationSpeed
          );

          // 3. Since setBlocks runs nested, return its slice here to update the blocks state
          return updatedState.blocks;
        });

        // 4. Return the trains slice here to update the trains state
        return updateSimulation(
          {
            trains: currentTrains,
            blocks: blocks, // Fallback to current hook scope reference for initial loop
          },
          deltaSeconds,
          simulationSpeed
        ).trains;
      });

      animationRef.current = requestAnimationFrame(tick);
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
    blocks, // Add blocks to effect dependency array
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
    
    setBlocks(
      initialBlocks.map((block) => ({
        ...block,
      }))
    );
  }, [initialTrains, initialBlocks]);

  return {
    trains,
    blocks, // 6. Return blocks to App.tsx

    running,

    simulationSpeed,

    setSimulationSpeed,

    start,

    pause,

    reset,
  };
}
