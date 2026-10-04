import type {
  Signal,
  TrackBlock,
  Train,
} from "../types/railway";

import {
  PATNA_POSITION,
  BAKHTIYARPUR_POSITION,
  POSITION_UNITS_PER_SECOND_AT_80_KMH,
  STATION_STOP_SECONDS,
} from "./constants";

import {
  getBlockAtPosition,
  getNextBlock,
  getDistanceToBlockBoundary,
} from "./blocks";

import {
  getSignalForTrain,
} from "./signals";

export function updateTrainMovement(
  train: Train,
  deltaSeconds: number,
  simulationSpeed: number,
  blocks: TrackBlock[],
  signals: Signal[]
): Train {
  const nextTrain: Train = {
    ...train,
  };

  /*
   * =========================================
   * STATION STOP
   * =========================================
   */

  if (nextTrain.state === "STOPPED") {
    nextTrain.stationStopRemaining -=
      deltaSeconds * simulationSpeed;

    if (
      nextTrain.stationStopRemaining <= 0
    ) {
      nextTrain.stationStopRemaining = 0;
      nextTrain.state = "RUNNING";
    }

    return nextTrain;
  }

  /*
   * =========================================
   * CURRENT BLOCK
   * =========================================
   */

  const currentBlock =
    getBlockAtPosition(
      nextTrain.position,
      nextTrain.trackId,
      blocks
    );

  if (!currentBlock) {
    return nextTrain;
  }

  /*
   * =========================================
   * NEXT BLOCK
   * =========================================
   */

  const nextBlock =
    getNextBlock(
      nextTrain,
      blocks
    );

  const hasNextBlock =
    nextBlock !== null;

  /*
   * =========================================
   * SIGNAL
   * =========================================
   *
   * Find the signal protecting the next
   * block in the train's direction.
   */

  const nextSignal =
    getSignalForTrain(
      nextTrain.trackId,
      nextTrain.direction,
      nextBlock,
      signals
    );

  /*
   * =========================================
   * SIGNAL STATE
   * =========================================
   *
   * A missing signal is treated as GREEN
   * for now so that existing behaviour is
   * not accidentally blocked.
   */

  const signalIsRed =
    nextSignal?.aspect === "RED";

  /*
   * =========================================
   * HOLDING
   * =========================================
   *
   * If the train has reached the protected
   * boundary, keep it there while the signal
   * remains RED.
   */

  if (nextTrain.state === "HOLDING") {
    if (signalIsRed) {
      nextTrain.speed = 0;

      nextTrain.position =
        nextTrain.direction ===
        "TO_BAKHTIYARPUR"
          ? currentBlock.end
          : currentBlock.start;

      return nextTrain;
    }

    /*
     * Signal is GREEN.
     * Resume movement.
     */

    nextTrain.state = "RUNNING";
  }

  /*
   * =========================================
   * SPEED LIMIT
   * =========================================
   */

  const currentSpeedLimit =
    currentBlock.speedLimit;

  let permittedSpeed =
    Math.min(
      nextTrain.maxSpeed,
      currentSpeedLimit
    );

  /*
   * =========================================
   * APPROACH RED SIGNAL
   * =========================================
   *
   * Begin slowing down as the train approaches
   * the boundary protected by a RED signal.
   */

  if (
    signalIsRed &&
    hasNextBlock
  ) {
    const distanceToBoundary =
      getDistanceToBlockBoundary(
        nextTrain,
        currentBlock
      );

    /*
     * Start slowing when 10 position units
     * away from the protected boundary.
     */

    const slowingDistance = 10;

    if (
      distanceToBoundary <=
      slowingDistance
    ) {
      nextTrain.state = "SLOWING";

      const ratio =
        Math.max(
          0,
          distanceToBoundary /
            slowingDistance
        );

      permittedSpeed =
        Math.min(
          permittedSpeed,
          nextTrain.maxSpeed *
            ratio
        );
    } else {
      nextTrain.state = "RUNNING";
    }
  } else {
    nextTrain.state = "RUNNING";
  }

  /*
   * =========================================
   * SPEED
   * =========================================
   */

  nextTrain.speed =
    Math.max(
      0,
      permittedSpeed
    );

  /*
   * =========================================
   * MOVEMENT
   * =========================================
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
    movement *
    directionMultiplier;

  /*
   * =========================================
   * PROTECTED SIGNAL BOUNDARY
   * =========================================
   *
   * Do not allow the train to cross a RED
   * signal / protected block boundary.
   */

  if (
    signalIsRed &&
    hasNextBlock
  ) {
    const reachedBoundary =
      nextTrain.direction ===
      "TO_BAKHTIYARPUR"
        ? nextTrain.position >=
          currentBlock.end
        : nextTrain.position <=
          currentBlock.start;

    if (reachedBoundary) {
      nextTrain.position =
        nextTrain.direction ===
        "TO_BAKHTIYARPUR"
          ? currentBlock.end
          : currentBlock.start;

      nextTrain.speed = 0;

      nextTrain.state = "HOLDING";

      return nextTrain;
    }
  }

  /*
   * =========================================
   * BAKHTIYARPUR
   * =========================================
   */

  if (
    nextTrain.direction ===
      "TO_BAKHTIYARPUR" &&
    nextTrain.position >=
      BAKHTIYARPUR_POSITION
  ) {
    nextTrain.position =
      BAKHTIYARPUR_POSITION;

    nextTrain.direction =
      "TO_PATNA";

    nextTrain.state =
      "STOPPED";

    nextTrain.stationStopRemaining =
      STATION_STOP_SECONDS;

    nextTrain.speed = 0;

    return nextTrain;
  }

  /*
   * =========================================
   * PATNA
   * =========================================
   */

  if (
    nextTrain.direction ===
      "TO_PATNA" &&
    nextTrain.position <=
      PATNA_POSITION
  ) {
    nextTrain.position =
      PATNA_POSITION;

    nextTrain.direction =
      "TO_BAKHTIYARPUR";

    nextTrain.state =
      "STOPPED";

    nextTrain.stationStopRemaining =
      STATION_STOP_SECONDS;

    nextTrain.speed = 0;

    return nextTrain;
  }

  return nextTrain;
}
