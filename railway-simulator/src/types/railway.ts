// export type Direction =
//   | "TO_BAKHTIYARPUR"
//   | "TO_PATNA";

// export type TrainState =
//   | "RUNNING"
//   | "STOPPED"
//   | "SLOWING"
//   | "HOLDING";

// export type TrainType =
//   | "LOCAL"
//   | "EXPRESS"
//   | "SUPERFAST"
//   | "VANDE_BHARAT";

// export interface Train {
//   number: string;
//   name: string;

//   type: TrainType;

//   position: number;

//   direction: Direction;

//   maxSpeed: number;
//   speed: number;

//   state: TrainState;

//   stationStopRemaining: number;

//   color: string;

//   currentBlockId: string | null;
// }

// export interface TrackBlock {
//   id: string;

//   start: number;
//   end: number;

//   speedLimit: number;

//   OccupiedBy: string | null;

//   severity: number;

//   isBottleneck?: boolean;
// }







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
   * Physical railway track.
   * Currently all trains use T1.
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
   * Currently all blocks use T1.
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