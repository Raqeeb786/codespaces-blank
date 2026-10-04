// import type {
//   TrackBlock,
//   Train,
// } from "../types/railway";

// import {
//   PATNA_POSITION,
//   BAKHTIYARPUR_POSITION,
//   POSITION_UNITS_PER_SECOND_AT_80_KMH,
//   STATION_STOP_SECONDS,
// } from "./constants";

// export function updateTrainMovement(
//   train: Train,
//   deltaSeconds: number,
//   simulationSpeed: number,
//   blocks: TrackBlock[]
// ): Train {
//   const nextTrain: Train = {
//     ...train,
//   };

//   /*
//    * -----------------------------------------
//    * STOPPED
//    * -----------------------------------------
//    */

//   if (
//     nextTrain.state === "STOPPED"
//   ) {
//     nextTrain.stationStopRemaining -=
//       deltaSeconds *
//       simulationSpeed;

//     if (
//       nextTrain.stationStopRemaining <=
//       0
//     ) {
//       nextTrain.stationStopRemaining = 0;

//       nextTrain.state = "RUNNING";
//     }

//     return nextTrain;
//   }

//   /*
//    * -----------------------------------------
//    * CURRENT BLOCK
//    * -----------------------------------------
//    */

//   const currentBlock =
//     blocks.find(
//       (block) =>
//         nextTrain.position >=
//           block.start &&
//         nextTrain.position <=
//           block.end
//     );

//   /*
//    * Train cannot exceed the block's
//    * speed restriction.
//    */

//   const permittedSpeed =
//     currentBlock
//       ? Math.min(
//           nextTrain.maxSpeed,
//           currentBlock.speedLimit
//         )
//       : nextTrain.maxSpeed;

//   nextTrain.speed =
//     permittedSpeed;

//   /*
//    * -----------------------------------------
//    * MOVEMENT
//    * -----------------------------------------
//    */

//   const directionMultiplier =
//     nextTrain.direction ===
//     "TO_BAKHTIYARPUR"
//       ? 1
//       : -1;

//   const movement =
//     (nextTrain.speed / 80) *
//     POSITION_UNITS_PER_SECOND_AT_80_KMH *
//     deltaSeconds *
//     simulationSpeed;

//   nextTrain.position +=
//     movement *
//     directionMultiplier;

//   /*
//    * -----------------------------------------
//    * BAKHTIYARPUR
//    * -----------------------------------------
//    */

//   if (
//     nextTrain.direction ===
//       "TO_BAKHTIYARPUR" &&
//     nextTrain.position >=
//       BAKHTIYARPUR_POSITION
//   ) {
//     nextTrain.position =
//       BAKHTIYARPUR_POSITION;

//     nextTrain.direction =
//       "TO_PATNA";

//     nextTrain.state =
//       "STOPPED";

//     nextTrain.stationStopRemaining =
//       STATION_STOP_SECONDS;

//     nextTrain.speed = 0;
//   }

//   /*
//    * -----------------------------------------
//    * PATNA
//    * -----------------------------------------
//    */

//   if (
//     nextTrain.direction ===
//       "TO_PATNA" &&
//     nextTrain.position <=
//       PATNA_POSITION
//   ) {
//     nextTrain.position =
//       PATNA_POSITION;

//     nextTrain.direction =
//       "TO_BAKHTIYARPUR";

//     nextTrain.state =
//       "STOPPED";

//     nextTrain.stationStopRemaining =
//       STATION_STOP_SECONDS;

//     nextTrain.speed = 0;
//   }

//   return nextTrain;
// }












import type {
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

export function updateTrainMovement(
  train: Train,
  deltaSeconds: number,
  simulationSpeed: number,
  blocks: TrackBlock[]
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

  /*
   * =========================================
   * DESTINATION
   * =========================================
   *
   * If there is no next block, the train is
   * approaching a station rather than another
   * protected block.
   */

  const hasNextBlock =
    nextBlock !== null;

  /*
   * =========================================
   * BLOCK OCCUPANCY
   * =========================================
   */

  const nextBlockOccupied =
    nextBlock !== null &&
    nextBlock.occupiedBy !== null &&
    nextBlock.occupiedBy !==
      nextTrain.number;

  /*
   * =========================================
   * HOLDING
   * =========================================
   *
   * Once the train has physically reached the
   * boundary, KEEP it there until the next
   * block becomes free.
   */

  if (nextTrain.state === "HOLDING") {
    if (
      nextBlockOccupied
    ) {
      nextTrain.speed = 0;

      nextTrain.position =
        nextTrain.direction ===
        "TO_BAKHTIYARPUR"
          ? currentBlock.end
          : currentBlock.start;

      return nextTrain;
    }

    /*
     * Block has become free.
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
   * APPROACH OCCUPIED BLOCK
   * =========================================
   */

  if (
    nextBlockOccupied &&
    hasNextBlock
  ) {
    const distanceToBoundary =
      getDistanceToBlockBoundary(
        nextTrain,
        currentBlock
      );

    /*
     * Start slowing down when 10 position
     * units away from the protected boundary.
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
   * PROTECTED BLOCK BOUNDARY
   * =========================================
   *
   * IMPORTANT:
   *
   * We explicitly clamp the train to the
   * boundary. This prevents the train from
   * getting mathematically closer and closer
   * forever without actually reaching it.
   */

  if (
    nextBlockOccupied &&
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

