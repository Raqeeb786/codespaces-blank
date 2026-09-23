import type {
  TrackBlock,
  Train,
} from "../types/railway";

import { updateTrainMovement } from "./movement";
import {
  updateBlockOccupancy,
  updateTrainBlock,
} from "./blocks";

export interface SimulationState {
  trains: Train[];
  blocks: TrackBlock[];
}

export function updateSimulation(
  state: SimulationState,
  deltaSeconds: number,
  simulationSpeed: number
): SimulationState {
  /*
   * STEP 1
   *
   * Move every train.
   */

  let updatedTrains =
    state.trains.map((train) =>
      updateTrainMovement(
        train,
        deltaSeconds,
        simulationSpeed,
        state.blocks
      )
    );

  /*
   * STEP 2
   *
   * Determine which block each train
   * is currently occupying.
   */

  updatedTrains =
    updatedTrains.map((train) =>
      updateTrainBlock(
        train,
        state.blocks
      )
    );

  /*
   * STEP 3
   *
   * Update block occupancy.
   */

  const updatedBlocks =
    updateBlockOccupancy(
      updatedTrains,
      state.blocks
    );

  return {
    trains: updatedTrains,
    blocks: updatedBlocks,
  };
}
