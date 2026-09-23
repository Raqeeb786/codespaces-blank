export type Direction =
  | "TO_BAKHTIYARPUR"
  | "TO_PATNA";

export type TrainState =
  | "RUNNING"
  | "STOPPED";

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
   * 0   = Patna Jn
   * 100 = Bakhtiyarpur
   */
  position: number;

  direction: Direction;

  /**
   * Maximum/current speed for now.
   * Later we'll distinguish:
   *
   * maxSpeed
   * targetSpeed
   * currentSpeed
   */
  speed: number;

  state: TrainState;

  /**
   * Remaining station dwell time.
   */
  stationStopRemaining: number;

  color: string;
}
