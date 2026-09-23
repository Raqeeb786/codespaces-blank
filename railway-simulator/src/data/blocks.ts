import type { TrackBlock } from "../types/railway";

export const INITIAL_BLOCKS: TrackBlock[] = [
  {
    id: "B1",
    start: 0,
    end: 20,

    speedLimit: 100,

    occupiedBy: null,

    severity: 10,
  },

  {
    id: "B2",
    start: 20,
    end: 40,

    speedLimit: 110,

    occupiedBy: null,

    severity: 20,
  },

  {
    id: "B3",
    start: 40,
    end: 60,

    speedLimit: 70,

    occupiedBy: null,

    severity: 85,

    isBottleneck: true,
  },

  {
    id: "B4",
    start: 60,
    end: 80,

    speedLimit: 110,

    occupiedBy: null,

    severity: 25,
  },

  {
    id: "B5",
    start: 80,
    end: 100,

    speedLimit: 100,

    occupiedBy: null,

    severity: 15,
  },
];
