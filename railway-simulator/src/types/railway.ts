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

export type SignalAspect =
  | "RED"
  | "GREEN";

export interface Train {
  number: string;
  name: string;

  type: TrainType;

  /**
   * Physical railway track.
   */
  trackId: string;

  position: number;

  direction: Direction;

  maxSpeed: number;
  speed: number;

  state: TrainState;

  stationStopRemaining: number;

  color: string;

  currentBlockId: string | null;
}

export interface TrackBlock {
  id: string;

  /**
   * Physical railway track this block belongs to.
   */
  trackId: string;

  start: number;
  end: number;

  speedLimit: number;

  /**
   * Train currently occupying this block.
   */
  occupiedBy: string | null;

  severity: number;

  isBottleneck?: boolean;
}

export interface Track {
  id: string;
  name: string;
  fromStation: string;
  toStation: string;
}

export interface Signal {
  id: string;

  /**
   * Physical railway track.
   */
  trackId: string;

  /**
   * Position of the signal on the track.
   */
  position: number;

  /**
   * Direction in which this signal controls movement.
   */
  direction: Direction;

  /**
   * Block protected by this signal.
   */
  protectedBlockId: string;

  /**
   * Current signal aspect.
   */
  aspect: SignalAspect;
}
