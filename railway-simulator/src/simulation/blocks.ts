import type {
  TrackBlock,
  Train,
} from "../types/railway";

export function getBlockAtPosition(
  position: number,
  blocks: TrackBlock[]
): TrackBlock | null {
  return (
    blocks.find(
      (block) =>
        position >= block.start &&
        position <= block.end
    ) ?? null
  );
}

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
        updatedBlocks
      );

    if (block) {
      block.occupiedBy =
        train.number;
    }
  }

  return updatedBlocks;
}

export function updateTrainBlock(
  train: Train,
  blocks: TrackBlock[]
): Train {
  const block =
    getBlockAtPosition(
      train.position,
      blocks
    );

  return {
    ...train,

    currentBlockId:
      block?.id ?? null,
  };
}
