Railway Simulator — Project Checkpoint
1. Project Goal

We are building a React + TypeScript railway traffic simulator for the Patna Jn ↔ Bakhtiyarpur corridor.

The current simulator supports:

Multiple trains

Train movement

Direction

Speed limits

Track blocks

Track-aware block occupancy

Bottleneck indication

Station stops

Simulation start/pause/reset

Simulation speed controls

Live SVG railway visualization

Train cards

Infrastructure state

Basic protection against trains entering occupied blocks

Multiple physical tracks

The eventual goal is to evolve this into a realistic railway traffic, signalling, dispatching, and scheduling simulator.

2. Current Architecture

Current structure is approximately:

src/
├── components/
│   ├── RailwayView.tsx
│   ├── SimulationControls.tsx
│   └── TrainCard.tsx
│
├── data/
│   ├── blocks.ts
│   ├── trains.ts
│   ├── tracks.ts
│   └── constants.ts
│
├── hooks/
│   └── useRailwaySimulation.ts
│
├── simulation/
│   ├── blocks.ts
│   ├── engine.ts
│   └── movement.ts
│
├── types/
│   └── railway.ts
│
└── App.tsx

3. Current Railway Model

The simulator now has an explicit physical track concept.

Track
  ↓
TrackBlock
  ↓
Train


The important distinction is that a train's position alone does not identify its physical location.

A train is identified by:

trackId + position


Therefore:

T1 / position 50


and:

T2 / position 50


are physically different locations.

4. Current Types
Train
export interface Train {
  number: string;
  name: string;

  type: TrainType;

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

TrackBlock
export interface TrackBlock {
  id: string;

  trackId: string;

  start: number;
  end: number;

  speedLimit: number;

  occupiedBy: string | null;

  severity: number;

  isBottleneck?: boolean;
}

Track
export interface Track {
  id: string;
  name: string;
  fromStation: string;
  toStation: string;
}


Current tracks:

T1 — Track 1
T2 — Track 2


Both currently connect:

Patna Jn ↔ Bakhtiyarpur

5. Current Tracks and Blocks
T1
B1 = 0 → 20
B2 = 20 → 40
B3 = 40 → 60
B4 = 60 → 80
B5 = 80 → 100

T2
C1 = 0 → 20
C2 = 20 → 40
C3 = 40 → 60
C4 = 60 → 80
C5 = 80 → 100


Both tracks are currently bidirectional from the simulation's perspective.

There is currently no junction, crossover, or route-changing logic.

6. Current Initial Trains

There are four trains.

12562
Patna → Bakhtiyarpur
T1
position 0
STOPPED initially

13224
Bakhtiyarpur → Patna
T1
position 100
STOPPED initially

12310
Patna → Bakhtiyarpur
T1
position 25
RUNNING

12309

Currently used to test the second track:

Bakhtiyarpur → Patna
T2
position 90
RUNNING


This was intentionally moved from T1 to T2 to verify that track-aware occupancy works.

7. Important Track-Aware Behaviour Verified

We have now experimentally confirmed that trains on different tracks do not incorrectly block one another.

For example:

12310 → T1 / position 50

12309 ← T2 / position 50


These trains can occupy the same positional range without treating each other as occupying the same physical block.

Therefore:

T1/B3


and:

T2/C3


are correctly treated as different physical blocks.

This is a major architectural milestone.

8. Track-Aware Block Lookup

The block lookup logic now considers the train's track.

Conceptually:

getBlockAtPosition(
  position,
  trackId,
  blocks
)


It must only consider blocks belonging to the requested track.

This prevents:

T1/B3


from being confused with:

T2/C3


even though both cover:

40 → 60

9. Track-Aware Movement

The movement engine now obtains the current block using:

getBlockAtPosition(
  nextTrain.position,
  nextTrain.trackId,
  blocks
);


The next block is therefore calculated along the train's current physical track.

The train does not automatically interact with blocks belonging to another track.

10. Track-Aware Occupancy

Block occupancy is now based on:

train.trackId
+
train.position


rather than position alone.

Each block has:

occupiedBy: string | null;


and only a train physically located on that block can occupy it.

11. Frontend

The live SVG railway visualization now displays two physical tracks.

Conceptually:

                    Patna Jn                         Bakhtiyarpur

T1   ═══════════════════════════════════════════════════════════
       B1       B2       B3       B4       B5
                 🚆              🚆


T2   ═══════════════════════════════════════════════════════════
       C1       C2       C3       C4       C5


The train's vertical SVG position is determined by:

train.trackId


Therefore trains visually appear on their actual physical track.

The frontend now receives:

<RailwayView
  tracks={INITIAL_TRACKS}
  trains={simulation.trains}
  blocks={simulation.blocks}
/>

12. Current Simulation State Architecture

The simulation continues to use a single combined state:

interface SimulationState {
  trains: Train[];
  blocks: TrackBlock[];
}


The simulation update remains conceptually:

Current Simulation State
        ↓
Update train movement
        ↓
Update train block
        ↓
Update block occupancy
        ↓
New Simulation State


This preserves the earlier fix where trains and blocks were accidentally updated independently.

13. Current Movement Protection

The simulator currently protects trains from entering occupied blocks.

When a train approaches an occupied next block:

TRAIN →       | occupied block |


it begins slowing.

When it reaches the protected boundary, it enters:

HOLDING


and remains at the boundary until the next block becomes available.

This behavior is intentionally simple for the MVP.

We are not currently trying to perfectly model braking curves or railway signalling physics.

14. Known Simplifications

The following are intentionally not fully realistic yet:

Braking curves

Acceleration curves

Exact railway signal behavior

Real railway signalling systems

Movement authority

Junctions

Crossovers

Route selection

Passing loops

Platform routing

Timetable dispatching

Automatic scheduling

Conflict resolution

Optimization

The current purpose is to establish a correct physical infrastructure model first.

15. Important Architectural Principle

The simulator should evolve in this order:

PHYSICAL INFRASTRUCTURE
        ↓
TRACKS
        ↓
BLOCKS
        ↓
SIGNALS
        ↓
MOVEMENT AUTHORITY
        ↓
TRAIN MOVEMENT
        ↓
CONFLICT DETECTION
        ↓
DISPATCHING
        ↓
SCHEDULING
        ↓
OPTIMIZATION


We have now completed the first important infrastructure expansion:

Tracks
  ↓
Track-aware Blocks
  ↓
Track-aware Trains

16. What We Should NOT Do Yet

Do not jump directly into:

AI

timetable optimization

machine learning

automatic dispatching

complex junction routing

large-scale scheduling

The infrastructure and signalling concepts should become stable first.

17. Current Checkpoint

The current system can now represent:

                    PATNA JN

T1  ═════════════════════════════════════
       B1 B2 B3 B4 B5
             🚆


T2  ═════════════════════════════════════
       C1 C2 C3 C4 C5
                       🚆

                    BAKHTIYARPUR


A train at:

T1 / position 50


does not conflict with:

T2 / position 50


This behavior has been tested and confirmed.

18. NEXT MAJOR MILESTONE — SIGNALS

The next major milestone is to introduce railway signals.

Instead of having the movement engine directly think only in terms of:

nextBlock.occupiedBy


we will begin moving toward:

Train
  ↓
Signal
  ↓
Movement Authority
  ↓
Protected Block(s)
  ↓
Train Movement


The first version does not need to be complicated.

We can introduce a simple signal model such as:

type SignalAspect =
  | "RED"
  | "YELLOW"
  | "GREEN";


and:

interface Signal {
  id: string;

  trackId: string;

  position: number;

  aspect: SignalAspect;
}


Initially, signals can simply protect blocks.

For example:

T1

Patna
  │
  🚦       🚦       🚦       🚦
  │        │        │        │
 B1       B2       B3       B4       B5


The first objective will be:

RED
 ↓
Train cannot enter protected block

GREEN
 ↓
Train may proceed


Then we can later introduce:

YELLOW
 ↓
Proceed with caution / prepare to stop


and eventually multiple aspects and movement authority.

19. Exact Point To Resume

When continuing this project, start with:

"The track-aware multi-track model is working. T1 and T2 are visible, trains can operate on separate tracks, and trains on different tracks do not conflict. The next major milestone is to introduce a basic Signal model and connect signals to block protection. Let's start by reviewing the current railway.ts, blocks.ts, and movement.ts before implementing signals."

Do not redesign the entire simulation.

Start with the smallest useful signal system and preserve the currently working track-aware movement.