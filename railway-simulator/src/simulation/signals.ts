import type {
  Signal,
  TrackBlock,
} from "../types/railway";

export function updateSignalAspects(
  signals: Signal[],
  blocks: TrackBlock[]
): Signal[] {
  return signals.map((signal) => {
    const protectedBlock =
      blocks.find(
        (block) =>
          block.id ===
          signal.protectedBlockId
      );

    if (!protectedBlock) {
      return {
        ...signal,
        aspect: "RED",
      };
    }

    const occupied =
      protectedBlock.occupiedBy !== null;

    return {
      ...signal,
      aspect: occupied
        ? "RED"
        : "GREEN",
    };
  });
}

export function getSignalForTrain(
  trainTrackId: string,
  trainDirection:
    | "TO_BAKHTIYARPUR"
    | "TO_PATNA",
  nextBlock: TrackBlock | null,
  signals: Signal[]
): Signal | null {
  if (!nextBlock) {
    return null;
  }

  return (
    signals.find(
      (signal) =>
        signal.trackId ===
          trainTrackId &&
        signal.direction ===
          trainDirection &&
        signal.protectedBlockId ===
          nextBlock.id
    ) ?? null
  );
}
