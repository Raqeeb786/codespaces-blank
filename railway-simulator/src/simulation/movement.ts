import type { Train } from "../types/railway";

import {
  PATNA_POSITION,
  BAKHTIYARPUR_POSITION,
  POSITION_UNITS_PER_SECOND_AT_80_KMH,
  STATION_STOP_SECONDS,
} from "./constants";

export function updateTrainMovement(
  train: Train,
  deltaSeconds: number,
  simulationSpeed: number
): Train {
  const nextTrain: Train = {
    ...train,
  };

  /*
   * ------------------------------------------
   * TRAIN IS STOPPED AT A STATION
   * ------------------------------------------
   */

  if (nextTrain.state === "STOPPED") {
    nextTrain.stationStopRemaining -=
      deltaSeconds * simulationSpeed;

    if (nextTrain.stationStopRemaining <= 0) {
      nextTrain.stationStopRemaining = 0;
      nextTrain.state = "RUNNING";
    }

    return nextTrain;
  }

  /*
   * ------------------------------------------
   * TRAIN IS MOVING
   * ------------------------------------------
   */

  const directionMultiplier =
    nextTrain.direction ===
    "TO_BAKHTIYARPUR"
      ? 1
      : -1;

  const movement =
    (nextTrain.speed / 80) *
    POSITION_UNITS_PER_SECOND_AT_80_KMH *
    deltaSeconds *
    simulationSpeed;

  nextTrain.position +=
    movement * directionMultiplier;

  /*
   * ------------------------------------------
   * REACHED BAKHTIYARPUR
   * ------------------------------------------
   */

  if (
    nextTrain.direction ===
      "TO_BAKHTIYARPUR" &&
    nextTrain.position >=
      BAKHTIYARPUR_POSITION
  ) {
    nextTrain.position =
      BAKHTIYARPUR_POSITION;

    nextTrain.direction = "TO_PATNA";

    nextTrain.state = "STOPPED";

    nextTrain.stationStopRemaining =
      STATION_STOP_SECONDS;
  }

  /*
   * ------------------------------------------
   * REACHED PATNA
   * ------------------------------------------
   */

  if (
    nextTrain.direction === "TO_PATNA" &&
    nextTrain.position <= PATNA_POSITION
  ) {
    nextTrain.position =
      PATNA_POSITION;

    nextTrain.direction =
      "TO_BAKHTIYARPUR";

    nextTrain.state = "STOPPED";

    nextTrain.stationStopRemaining =
      STATION_STOP_SECONDS;
  }

  return nextTrain;
}
