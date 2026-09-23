export type Direction =
  | "TO_BAKHTIYARPUR"
  | "TO_PATNA";

export type TrainState =
  | "RUNNING"
  | "STOPPED"
  | "SLOWING"
  | "HOLDING";

export type TrainType =
  | "LOCAL"
  | "EXPRESS"
  | "SUPERFAST"
  | "VANDE_BHARAT";

export interface Train {
  number: string;
  name: string;

  type: TrainType;

  /**
   * 0   = Patna
   * 100 = Bakhtiyarpur
   */
  position: number;

  direction: Direction;

  /**
   * Maximum permitted speed for this train.
   */
  maxSpeed: number;

  /**
   * Current actual speed.
   *
   * This is what will eventually be controlled
   * by the scheduling algorithm.
   */
  speed: number;

  state: TrainState;

  stationStopRemaining: number;

  color: string;

  /**
   * Block currently occupied by the train.
   */
  currentBlockId: string | null;
}

export interface TrackBlock {
  id: string;

  /**
   * Position range along the corridor.
   *
   * Example:
   * B1 = 0 → 20
   * B2 = 20 → 40
   */
  start: number;
  end: number;

  /**
   * Maximum permitted speed inside this block.
   */
  speedLimit: number;

  /**
   * Train currently occupying the block.
   */
  occupiedBy: string | null;

  /**
   * 0 → no bottleneck
   * 100 → extremely severe
   */
  severity: number;

  isBottleneck?: boolean;
}
