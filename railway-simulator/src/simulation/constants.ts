export const PATNA_POSITION = 0;

export const BAKHTIYARPUR_POSITION = 100;

/**
 * At 80 km/h the train moves 8 simulation
 * position units per real second.
 *
 * This is intentionally NOT real geography yet.
 *
 * Later we'll replace this with:
 *
 * distanceKm
 * ----------------
 * actual railway distance
 */
export const POSITION_UNITS_PER_SECOND_AT_80_KMH = 8;

/**
 * How long a train waits at a station.
 */
export const STATION_STOP_SECONDS = 2;
