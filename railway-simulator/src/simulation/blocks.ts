// // import type {
// //   TrackBlock,
// //   Train,
// // } from "../types/railway";

// // export function getBlockAtPosition(
// //   position: number,
// //   blocks: TrackBlock[]
// // ): TrackBlock | null {
// //   return (
// //     blocks.find(
// //       (block) =>
// //         position >= block.start &&
// //         position <= block.end
// //     ) ?? null
// //   );
// // }

// // export function updateBlockOccupancy(
// //   trains: Train[],
// //   blocks: TrackBlock[]
// // ): TrackBlock[] {
// //   const updatedBlocks = blocks.map(
// //     (block) => ({
// //       ...block,
// //       upOccupiedBy: null,
// // downOccupiedBy: null,//     })
// //   );

// //   for (const train of trains) {
// //     const block =
// //       getBlockAtPosition(
// //         train.position,
// //         updatedBlocks
// //       );

// //     if (block) {
// //       block.occupiedBy =
// //         train.number;
// //     }
// //   }

// //   return updatedBlocks;
// // }

// // export function updateTrainBlock(
// //   train: Train,
// //   blocks: TrackBlock[]
// // ): Train {
// //   const block =
// //     getBlockAtPosition(
// //       train.position,
// //       blocks
// //     );

// //   return {
// //     ...train,

// //     currentBlockId:
// //       block?.id ?? null,
// //   };
// // }







// import type {
//   TrackBlock,
//   Train,
// } from "../types/railway";

// export function getBlockAtPosition(
//   position: number,
//   blocks: TrackBlock[]
// ): TrackBlock | null {
//   return (
//     blocks.find((block) => {
//       const isLastBlock =
//         block === blocks[blocks.length - 1];

//       return isLastBlock
//         ? position >= block.start &&
//             position <= block.end
//         : position >= block.start &&
//             position < block.end;
//     }) ?? null
//   );
// }


// export function getNextBlock(
//   train: Train,
//   blocks: TrackBlock[]
// ): TrackBlock | null {
//   const currentBlock =
//     getBlockAtPosition(
//       train.position,
//       blocks
//     );

//   if (!currentBlock) {
//     return null;
//   }

//   const currentIndex =
//     blocks.findIndex(
//       (block) =>
//         block.id === currentBlock.id
//     );

//   if (currentIndex === -1) {
//     return null;
//   }

//   if (
//     train.direction ===
//     "TO_BAKHTIYARPUR"
//   ) {
//     return (
//       blocks[currentIndex + 1] ??
//       null
//     );
//   }

//   return (
//     blocks[currentIndex - 1] ??
//     null
//   );
// }


// export function getDistanceToBlockBoundary(
//   train: Train,
//   currentBlock: TrackBlock
// ): number {
//   if (
//     train.direction ===
//     "TO_BAKHTIYARPUR"
//   ) {
//     return (
//       currentBlock.end -
//       train.position
//     );
//   }

//   return (
//     train.position -
//     currentBlock.start
//   );
// }


// export function updateBlockOccupancy(
//   trains: Train[],
//   blocks: TrackBlock[]
// ): TrackBlock[] {
//   const updatedBlocks = blocks.map(
//     (block) => ({
//       ...block,
//       occupiedBy: null,    })
//   );

//   for (const train of trains) {
//     const block =
//       getBlockAtPosition(
//         train.position,
//         updatedBlocks
//       );

//     if (block) {
//       block.OccupiedBy =
//         train.number;
//     }
//   }

//   return updatedBlocks;
// }

// export function updateTrainBlock(
//   train: Train,
//   blocks: TrackBlock[]
// ): Train {
//   const block =
//     getBlockAtPosition(
//       train.position,
//       blocks
//     );

//   return {
//     ...train,

//     currentBlockId:
//       block?.id ?? null,
//   };
// }











import type {
  TrackBlock,
  Train,
} from "../types/railway";

/**
 * Find the block containing a position
 * on a specific physical track.
 */
export function getBlockAtPosition(
  position: number,
  trackId: string,
  blocks: TrackBlock[]
): TrackBlock | null {
  const trackBlocks = blocks.filter(
    (block) => block.trackId === trackId
  );

  return (
    trackBlocks.find((block, index) => {
      const isLastBlock =
        index === trackBlocks.length - 1;

      return isLastBlock
        ? position >= block.start &&
            position <= block.end
        : position >= block.start &&
            position < block.end;
    }) ?? null
  );
}

/**
 * Find the next block in the train's direction
 * on the train's current physical track.
 */
export function getNextBlock(
  train: Train,
  blocks: TrackBlock[]
): TrackBlock | null {
  const currentBlock =
    getBlockAtPosition(
      train.position,
      train.trackId,
      blocks
    );

  if (!currentBlock) {
    return null;
  }

  const trackBlocks = blocks.filter(
    (block) =>
      block.trackId === train.trackId
  );

  const currentIndex =
    trackBlocks.findIndex(
      (block) =>
        block.id === currentBlock.id
    );

  if (currentIndex === -1) {
    return null;
  }

  if (
    train.direction ===
    "TO_BAKHTIYARPUR"
  ) {
    return (
      trackBlocks[currentIndex + 1] ??
      null
    );
  }

  return (
    trackBlocks[currentIndex - 1] ??
    null
  );
}

/**
 * Distance from the train to the boundary
 * of its current block.
 */
export function getDistanceToBlockBoundary(
  train: Train,
  currentBlock: TrackBlock
): number {
  if (
    train.direction ===
    "TO_BAKHTIYARPUR"
  ) {
    return (
      currentBlock.end -
      train.position
    );
  }

  return (
    train.position -
    currentBlock.start
  );
}

/**
 * Recalculate block occupancy from
 * the current train positions.
 */
export function updateBlockOccupancy(
  trains: Train[],
  blocks: TrackBlock[]
): TrackBlock[] {
  const updatedBlocks = blocks.map(
    (block) => ({
      ...block,
      occupiedBy: null,
    })
  );

  for (const train of trains) {
    const block =
      getBlockAtPosition(
        train.position,
        train.trackId,
        updatedBlocks
      );

    if (block) {
      block.occupiedBy =
        train.number;
    }
  }

  return updatedBlocks;
}

/**
 * Update the train's current block
 * based on its position and track.
 */
export function updateTrainBlock(
  train: Train,
  blocks: TrackBlock[]
): Train {
  const block =
    getBlockAtPosition(
      train.position,
      train.trackId,
      blocks
    );

  return {
    ...train,

    currentBlockId:
      block?.id ?? null,
  };
}
