import type { Train } from "../types/railway";

export const INITIAL_TRAINS: Train[] = [
  {
    number: "12562",
    name: "Express",

    type: "EXPRESS",

    position: 0,

    direction: "TO_BAKHTIYARPUR",

    maxSpeed: 110,

    speed: 110,

    state: "STOPPED",

    stationStopRemaining: 2,

    color: "#22d3ee",

    currentBlockId: "B1",
  },

  {
    number: "13224",
    name: "Express",

    type: "EXPRESS",

    position: 100,

    direction: "TO_PATNA",

    maxSpeed: 110,

    speed: 110,

    state: "STOPPED",

    stationStopRemaining: 2,

    color: "#f59e0b",

    currentBlockId: "B5",
  },

  {
    number: "12310",
    name: "Superfast",

    type: "SUPERFAST",

    position: 25,

    direction: "TO_BAKHTIYARPUR",

    maxSpeed: 130,

    speed: 130,

    state: "RUNNING",

    stationStopRemaining: 0,

    color: "#a78bfa",

    currentBlockId: "B2",
  },

  {
    number: "12309",
    name: "Superfast",

    type: "SUPERFAST",

    position: 90,

    direction: "TO_PATNA",

    maxSpeed: 130,

    speed: 130,

    state: "RUNNING",

    stationStopRemaining: 0,

    color: "#34d399",

    currentBlockId: "B4",
  },
];
