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

Basic railway signalling

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
│   ├── signals.ts
│   └── constants.ts
│
├── hooks/
│   └── useRailwaySimulation.ts
│
├── simulation/
│   ├── blocks.ts
│   ├── engine.ts
│   ├── movement.ts
│   └── signals.ts
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


A train's position alone does not identify its physical location.

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

Signal

Signals have now been introduced.

Current signal model includes:

export interface Signal {
  id: string;

  trackId: string;

  position: number;

  direction: Direction;

  protectedBlockId: string;

  aspect: SignalAspect;
}


Current aspects:

type SignalAspect =
  | "RED"
  | "GREEN";


Yellow/caution has not been introduced yet.

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
Bakhtiyarpur → Patna
T2
position 90
RUNNING


The fourth train was intentionally moved to T2 to verify track-aware behavior.

7. Track-Aware Behaviour Verified

We have experimentally confirmed that trains on different physical tracks do not incorrectly block one another.

For example:

12310 → T1 / position 50

12309 ← T2 / position 50


These trains can occupy the same positional range without treating each other as occupying the same physical block.

Therefore:

T1/B3


and:

T2/C3


are correctly treated as different physical blocks.

This remains a major architectural milestone.

8. Track-Aware Block Lookup

Block lookup considers both position and physical track:

getBlockAtPosition(
  position,
  trackId,
  blocks
)


Only blocks belonging to the requested track are considered.

This prevents:

T1/B3


from being confused with:

T2/C3


even though both cover:

40 → 60

9. Track-Aware Movement

The movement engine obtains the current block using the train's physical track:

getBlockAtPosition(
  nextTrain.position,
  nextTrain.trackId,
  blocks
);


The next block is therefore calculated along the train's current physical track.

A train does not automatically interact with blocks belonging to another track.

10. Track-Aware Occupancy

Block occupancy is based on:

train.trackId
+
train.position


rather than position alone.

Each block has:

occupiedBy: string | null;


Only a train physically located on that block can occupy it.

11. Frontend

The live SVG railway visualization now displays two physical tracks.

Conceptually:

                    Patna Jn                         Bakhtiyarpur

T1   ═══════════════════════════════════════════════════════════
       B1       B2       B3       B4       B5
                 🚆              🚆


T2   ═══════════════════════════════════════════════════════════
       C1       C2       C3       C4       C5
                       🚆


The train's vertical SVG position is determined by:

train.trackId


Therefore trains visually appear on their actual physical track.

The frontend receives live simulation data:

<RailwayView
  tracks={INITIAL_TRACKS}
  trains={trains}
  blocks={blocks}
  signals={signals}
/>

12. Current Simulation State Architecture

The simulation uses a single combined state:

interface SimulationState {
  trains: Train[];
  blocks: TrackBlock[];
  signals: Signal[];
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
Update signal aspects
        ↓
New Simulation State


This preserves the earlier fix where trains and blocks were accidentally updated independently.

The simulation engine remains responsible for producing one consistent state per simulation tick.

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

14. Signals — IMPLEMENTED

The basic signalling milestone has now been reached.

Signals are represented explicitly and are associated with:

track
+
direction
+
position
+
protected block
+
aspect


Signals have been created for both tracks and both directions.

Conceptually:

T1 → B1 → B2 → B3 → B4 → B5

     🚦    🚦    🚦    🚦    🚦


and:

T2 → C1 → C2 → C3 → C4 → C5

     🚦    🚦    🚦    🚦    🚦


There are separate directional signals for movements toward Patna and Bakhtiyarpur.

15. Current Signal Logic

The current signal engine determines signal aspect from the occupancy of its protected block.

Conceptually:

Protected block occupied
        ↓
      RED


and:

Protected block free
        ↓
      GREEN


The signal engine contains logic equivalent to:

occupied
  ? "RED"
  : "GREEN"


This is intentionally simple.

It is not yet intended to model the complete railway signalling system.

16. Signal Visualization — VERIFIED

Signals are now visible in the frontend.

More importantly, they have been tested dynamically.

When a protected block becomes occupied:

GREEN
  ↓
RED


When the block becomes free:

RED
  ↓
GREEN


The change occurs in real time during the simulation.

Therefore the signalling system is not merely static UI decoration.

It is connected to live simulation state.

This milestone has been successfully verified.

17. Important Clarification About Signals

The signal system does not yet replace the existing block-protection logic.

The movement engine currently knows directly about the next block:

nextBlock.occupiedBy


and uses that information to:

slow
  ↓
reach boundary
  ↓
HOLD


At the same time, the signal system observes the same block occupancy and changes the signal:

block occupied
      ↓
    RED


Therefore the current architecture is:

                 BLOCK OCCUPANCY
                       │
             ┌─────────┴─────────┐
             ↓                   ↓
       MOVEMENT ENGINE       SIGNAL ENGINE
             ↓                   ↓
        SLOW / HOLD          RED / GREEN


This is intentional.

We should not replace the working movement-protection system merely for the sake of routing movement through signals.

The next signalling milestone should add useful signalling behavior rather than duplicate existing safety logic.

18. Current Simplifications

The following are intentionally not fully realistic yet:

Braking curves

Acceleration curves

Exact railway signal behavior

Multi-aspect signalling

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

The current purpose is to establish a correct physical infrastructure model and progressively add signalling intelligence.

19. Important Architectural Principle

The simulator should evolve approximately in this direction:

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


We have now completed:

Tracks
  ↓
Track-aware Blocks
  ↓
Track-aware Trains
  ↓
Basic Signals
  ↓
Live Signal State


The important point is that the signalling layer has been added without breaking the existing track-aware movement model.

20. What We Should NOT Do Yet

Do not jump directly into:

AI

timetable optimization

machine learning

automatic dispatching

complex junction routing

large-scale scheduling

Do not redesign the existing movement engine unnecessarily.

The current block protection and track-aware movement are working and should remain intact.

21. NEXT MAJOR MILESTONE — SMARTER SIGNALLING

The next major milestone should not be "add signals" because that milestone is already complete.

Instead:

MVP 04 — Multi-Aspect / Signal-Aware Railway Control

The next stage should build on the current signal system.

First, introduce:

RED
YELLOW
GREEN


Then make signal aspects depend on more than just the immediately protected block.

For example:

Next block occupied
        ↓
      RED

Next block free
but following block occupied
        ↓
      YELLOW

Next block free
and following block free
        ↓
      GREEN


This gives the signal system actual predictive meaning.

Eventually the architecture can evolve toward:

Train
  ↓
Signal
  ↓
Movement Authority
  ↓
Protected Block(s)
  ↓
Train Movement


However, this should be introduced incrementally.

The existing:

nextBlock.occupiedBy


movement protection should remain intact until the new signal-based authority system has been properly tested.

22. Recommended Next Implementation Order

The next work should proceed in this order:

Add YELLOW to SignalAspect.

Keep the existing RED/GREEN behavior working.

Make signals inspect the next protected block(s).

Introduce a simple RED/YELLOW/GREEN aspect calculation.

Improve the frontend signal rendering to clearly distinguish all aspects.

Test a train following another train on the same track.

Verify:

RED near an occupied block

YELLOW before a RED

GREEN when the route ahead is clear

Only after that, consider using signal state as an additional input to movement control.

Do not remove the current block-based slowing/holding behavior during these steps.

23. Current Checkpoint

The system can now represent:

                    PATNA JN

T1  ═════════════════════════════════════
       🚦 B1 🚦 B2 🚦 B3 🚦 B4 🚦 B5
             🚆


T2  ═════════════════════════════════════
       🚦 C1 🚦 C2 🚦 C3 🚦 C4 🚦 C5
                         🚆

                    BAKHTIYARPUR


A train at:

T1 / position 50


does not conflict with:

T2 / position 50


and this behavior has been tested and confirmed.

Signals are now also present on the physical tracks and respond to live block occupancy.

For example:

Train enters B3
      ↓
B3.occupiedBy = train
      ↓
S_T1_B3_UP = RED


When the train leaves B3:

B3.occupiedBy = null
      ↓
S_T1_B3_UP = GREEN


This has been tested successfully in the frontend.

24. Exact Point To Resume

When continuing this project, start with:

"The track-aware multi-track model is working and the basic signalling milestone is complete. T1 and T2 are visible, trains can operate independently on separate tracks, block occupancy is track-aware, and signals dynamically change between RED and GREEN based on protected-block occupancy. The next major milestone is smarter multi-aspect signalling. We should add YELLOW and make signals consider multiple blocks ahead, while preserving the existing block-based slowing and holding logic."

Do not redesign the entire simulation.

Do not replace the current movement engine yet.

Build incrementally on the working track, block, occupancy, movement, and basic signal architecture.