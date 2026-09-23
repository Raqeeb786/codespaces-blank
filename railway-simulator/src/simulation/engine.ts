import type { Train } from "../types/railway";

import { updateTrainMovement } from "./movement";

export function updateSimulation(
  trains: Train[],
  deltaSeconds: number,
  simulationSpeed: number
): Train[] {
  return trains.map((train) =>
    updateTrainMovement(
      train,
      deltaSeconds,
      simulationSpeed
    )
  );
}
