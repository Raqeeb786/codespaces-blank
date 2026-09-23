import type { Train } from "../types/railway";

export const INITIAL_TRAINS: Train[] = [
  {
    number: "12562",
    name: "Express",

    type: "EXPRESS",

    position: 0,

    direction: "TO_BAKHTIYARPUR",

    speed: 80,

    state: "STOPPED",

    stationStopRemaining: 2,

    color: "#22d3ee",
  },

  {
    number: "13224",
    name: "Express",

    type: "EXPRESS",

    position: 100,

    direction: "TO_PATNA",

    speed: 85,

    state: "STOPPED",

    stationStopRemaining: 2,

    color: "#f59e0b",
  },

  {
    number: "12310",
    name: "Superfast",

    type: "SUPERFAST",

    position: 25,

    direction: "TO_BAKHTIYARPUR",

    speed: 120,

    state: "RUNNING",

    stationStopRemaining: 0,

    color: "#a78bfa",
  },

  {
    number: "12309",
    name: "Superfast",

    type: "SUPERFAST",

    position: 75,

    direction: "TO_PATNA",

    speed: 120,

    state: "RUNNING",

    stationStopRemaining: 0,

    color: "#34d399",
  },
];
