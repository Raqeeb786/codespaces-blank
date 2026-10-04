import type {
  Signal,
  TrackBlock,
  Train,
} from "../types/railway";

import { updateTrainMovement } from "./movement";

import {
  updateBlockOccupancy,
  updateTrainBlock,
} from "./blocks";

import {
  updateSignalAspects,
} from "./signals";

export interface SimulationState {
  trains: Train[];
  blocks: TrackBlock[];
  signals: Signal[];
}

export function updateSimulation(
  state: SimulationState,
  deltaSeconds: number,
  simulationSpeed: number
): SimulationState {
  /*
   * =========================================
   * STEP 1
   * =========================================
   *
   * Move every train using the current
   * infrastructure state.
   */

  let updatedTrains =
    state.trains.map((train) =>
      updateTrainMovement(
        train,
        deltaSeconds,
        simulationSpeed,
        state.blocks,
        state.signals
      )
    );

  /*
   * =========================================
   * STEP 2
   * =========================================
   *
   * Recalculate each train's current block.
   */

  updatedTrains =
    updatedTrains.map((train) =>
      updateTrainBlock(
        train,
        state.blocks
      )
    );

  /*
   * =========================================
   * STEP 3
   * =========================================
   *
   * Recalculate block occupancy.
   */

  const updatedBlocks =
    updateBlockOccupancy(
      updatedTrains,
      state.blocks
    );

  /*
   * =========================================
   * STEP 4
   * =========================================
   *
   * Signals depend on the NEW block
   * occupancy.
   *
   * Therefore signals must be calculated
   * AFTER trains and blocks have been updated.
   */

  const updatedSignals =
    updateSignalAspects(
      state.signals,
      updatedBlocks
    );

  /*
   * =========================================
   * FINAL STATE
   * =========================================
   */

  return {
    trains: updatedTrains,
    blocks: updatedBlocks,
    signals: updatedSignals,
  };
}
