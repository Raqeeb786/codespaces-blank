Good. Now we get to the part that will determine whether this becomes a **real academic project** or just a polished railway animation.

 I checked the research landscape again while formalizing this. The basic ingredients are already established: microscopic railway simulation, block/signalling constraints, rolling-horizon rescheduling, and conflict-aware optimization all exist in the literature and in mature tools such as OpenTrack.  Opentrack+1

 That actually helps us. **We should not pretend to invent those things.** Our project should contribute a clean, reproducible junction-level experimental platform and evaluate online scheduling strategies under controlled disturbances. Recent work continues to investigate dynamic/triggered rolling-horizon rescheduling, so the problem is still active rather than "solved."  ScienceDirect+1

 Here is the technical specification I would freeze.

 # Technical Design Specification

 ## Project

 **Interactive Microscopic Railway Traffic Simulation and Online Conflict-Aware Rescheduling**

---

 # 1\. Formal Problem Definition

 We model a railway junction and its surrounding corridor as a directed infrastructure graph:

 $$
G=(V,E)
$$

 where:

 - $V$ = railway locations/resources such as stations, junctions, signals and entry/exit points
- $E$ = directed track segments connecting those locations.

 Each track segment has physical and operational attributes:

 $$
e_i = (u_i,v_i,L_i,V_i,B_i)
$$

 where:

 - $u_i$ = starting node
- $v_i$ = ending node
- $L_i$ = length
- $V_i$ = maximum permitted speed
- $B_i$ = associated block/resource.

 A train travels through a sequence of edges:

 $$
R_k = [e_1,e_2,\ldots,e_n]
$$

 representing its route.

 The simulator maintains the state of all trains and infrastructure at simulation time $t$.

---

 # 2\. Railway Infrastructure Model

 The infrastructure is represented using five primary concepts.

 ## 2.1 Track Segment

 A track segment is the basic spatial unit.

```
interface TrackSegment {
  id: string;
  from: string;
  to: string;

  length: number;        // metres
  maxSpeed: number;      // m/s

  blockId: string;

  direction:
    | "up"
    | "down"
    | "bidirectional";
}
```

---

 ## 2.2 Block

 A block represents a protected section of railway infrastructure.

```
interface Block {
  id: string;

  state:
    | "FREE"
    | "RESERVED"
    | "OCCUPIED";

  reservedBy?: string;
  occupiedBy?: string;

  length: number;
}
```

 For the initial implementation:

 $$
capacity(B_i)=1
$$

 Therefore:

 $$
occupied(B_i,T_1) \land occupied(B_i,T_2)
$$

 is an invalid state.

 The simulator must never produce such a state.

---

 # 3\. Junction Model

 A junction is represented separately from individual track segments.

```
interface Junction {
  id: string;

  incomingEdges: string[];
  outgoingEdges: string[];

  routes: JunctionRoute[];
}
```

 A route represents a possible movement through the junction.

```
interface JunctionRoute {
  id: string;

  entry: string;
  exit: string;

  resources: string[];

  conflictsWith: string[];
}
```

 For example:

```
R1: A → C
R2: A → D
R3: B → C
R4: B → D
```

 The junction maintains a conflict matrix:

 $$
C_{ij} =
\begin{cases}
1 & \text{if routes }R_i,R_j\text{ conflict}\\
0 & \text{otherwise}
\end{cases}
$$

 Initially this matrix may be manually configured from the simplified infrastructure model.

 A later version can derive it automatically from shared resources.

---

 # 4\. Stations and Platforms

 Stations contain one or more platforms.

```
interface Station {
  id: string;
  name: string;

  platforms: Platform[];
}
```

```
interface Platform {
  id: string;

  stationId: string;

  length: number;

  occupiedBy?: string;
  reservedBy?: string;
}
```

 Platform conflicts are therefore treated similarly to track/resource conflicts.

---

 # 5\. Train Model

 Each train is represented by:

```
interface Train {
  id: string;

  category:
    | "LOCAL"
    | "EXPRESS"
    | "SUPERFAST"
    | "VANDE_BHARAT"
    | "FREIGHT";

  direction: "UP" | "DOWN";

  route: string[];

  routeIndex: number;

  currentSegment?: string;

  positionOnSegment: number;

  speed: number;

  maxSpeed: number;

  scheduledArrival?: number;
  scheduledDeparture?: number;

  actualArrival?: number;
  actualDeparture?: number;

  delay: number;

  state:
    | "APPROACHING"
    | "MOVING"
    | "WAITING"
    | "STOPPED"
    | "ARRIVED";

  priority: number;
}
```

---

 # 6\. Train Dynamics

 The initial simulator intentionally uses simplified train dynamics.

 For a train moving along a track:

 $$
x_{t+\Delta t}=x_t+v_t\Delta t
$$

 where:

 - $x_t$ = position
- $v_t$ = speed
- $\Delta t$ = simulation timestep.

 Speed is constrained by:

 $$
0 \leq v_t \leq V_{max}
$$

 and:

 $$
v_t \leq V_{track}
$$

 where $V_{track}$ is the speed restriction of the current track segment.

 Later versions may introduce:

 $$
v_{t+\Delta t}=v_t+a_t\Delta t
$$

 with simplified acceleration/deceleration limits.

 However, detailed locomotive physics is explicitly outside the initial scope.

---

 # 7\. Simulation Clock

 Simulation time is independent of wall-clock time.

 Let:

 $$
t_s
$$

 be simulation time.

 The visualization can run at:

```
1×
2×
4×
10×
100×
```

 without changing the underlying simulation model.

 The UI uses `requestAnimationFrame` only to display the state.

 The actual simulation engine should be independently executable.

---

 # 8\. Simulation Architecture

 The core architecture is:

```
                 Simulation Clock
                       │
                       ▼
                Event / Time Engine
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
       Train Dynamics       Infrastructure
             │                   │
             └─────────┬─────────┘
                       ▼
                 Current State
                       │
                       ▼
                Conflict Detector
                       │
                       ▼
                  Scheduler
                       │
                       ▼
                 Action Decision
                       │
                       ▼
                 State Update
                       │
                       └──────► next timestep
```

 React exists outside this loop.

---

 # 9\. Simulation State

 At any time $t$, the complete system state can be represented as:

 $$
S_t=(T_t,R_t,P_t,J_t,Q_t)
$$

 where:

 - $T_t$ = train states
- $R_t$ = resource states
- $P_t$ = platform states
- $J_t$ = junction states
- $Q_t$ = pending events/operations.

 The simulator performs:

 $$
S_t \rightarrow S_{t+\Delta t}
$$

 based on movement, resource constraints, scheduled events, disturbances and scheduler decisions.

---

 # 10\. Resource Reservation

 A train cannot enter a constrained resource unless it has successfully obtained permission.

 The basic process is:

```
Train requests resource
        ↓
Is resource free?
    /           \
  YES            NO
   ↓              ↓
Reserve          WAIT
   ↓
Enter
```

 Formally:

 $$
Request(T,R,t)
$$

 is feasible if:

 $$
R.state = FREE
$$

 and all required safety constraints are satisfied.

 For a route requiring resources:

 $$
R(T)=\{r_1,r_2,\ldots,r_n\}
$$

 all required resources must be simultaneously feasible according to the simplified signalling model.

---

 # 11\. Train Headway

 Two trains following the same direction cannot be allowed to violate a minimum separation.

 For consecutive trains $T_i,T_j$:

 $$
t_{j,enter} - t_{i,enter} \geq H
$$

 where $H$ is the minimum modeled headway.

 The first implementation can use a fixed headway.

 Later:

 $$
H=f(train\ type,\ speed,\ block,\ infrastructure)
$$

 may be investigated.

---

 # 12\. Conflict Definition

 A conflict occurs when two or more train movements cannot simultaneously satisfy the infrastructure constraints.

 We define:

 $$
Conflict(T_i,T_j,R,t)
$$

 when both trains require resource $R$ during overlapping time intervals.

 Suppose:

 $$
T_i:R=[t_i^{start},t_i^{end}]
$$

 and:

 $$
T_j:R=[t_j^{start},t_j^{end}]
$$

 A conflict exists if:

 $$
t_i^{start}<t_j^{end}
$$

 and:

 $$
t_j^{start}<t_i^{end}
$$

 This interval-overlap formulation is the core of the conflict detector.

---

 # 13\. Predicted Conflict

 The simulator should not wait for a physical conflict.

 For each train, calculate an estimated arrival time at future resources.

 For resource $R$:

 $$
ETA(T,R)=t+\frac{d(T,R)}{v}
$$

 with additional terms for:

 - station dwell
- acceleration/deceleration
- existing waiting
- speed restrictions.

 Then construct predicted occupation intervals.

 Example:

```
T1:
J1 occupation = 10:05:20 → 10:06:10

T2:
J1 occupation = 10:05:55 → 10:06:40
```

 Since:

```
10:05:55 < 10:06:10
```

 the simulator reports:

```
PREDICTED CONFLICT
T1 ↔ T2
Resource: J1
Time: 10:05:55
```

---

 # 14\. Conflict Severity

 Each conflict can optionally receive a severity score:

 $$
Severity =
w_1D +
w_2O +
w_3W +
w_4P
$$

 where:

 - $D$ = expected delay impact
- $O$ = resource occupancy overlap
- $W$ = waiting impact
- $P$ = train priority.

 This is initially heuristic and can later be studied experimentally.

---

 # 15\. Scheduler Action Space

 The scheduler does not control arbitrary physical train behavior.

 Its actions are deliberately restricted.

 For example:

```
type SchedulingAction =
  | {
      type: "ALLOW";
      trainId: string;
      routeId: string;
    }
  | {
      type: "HOLD";
      trainId: string;
      duration: number;
    }
  | {
      type: "RESERVE";
      trainId: string;
      routeId: string;
    };
```

 Additional actions can be introduced later.

 This restriction is important because it keeps the optimization problem manageable.

---

 # 16\. Rolling-Horizon Scheduling

 The scheduler operates over a prediction horizon $H$.

 At time $t$:

 $$
[t,t+H]
$$

 is considered.

 For example:

```
Current time = 10:00
Prediction horizon = 30 min

Consider:
10:00 ─────────────────────── 10:30
```

 The scheduler:

 1. reads current state;
2. predicts future conflicts;
3. constructs candidate decisions;
4. evaluates candidates;
5. selects a decision;
6. executes only the near-term decision;
7. advances simulation;
8. repeats.

 Therefore:

 $$
S_t
\rightarrow
Plan_t
\rightarrow
Action_t
\rightarrow
S_{t+\Delta t}
\rightarrow
Plan_{t+\Delta t}
$$

 This is the core online mechanism.

 Rolling-horizon approaches are already established in railway rescheduling research, including handling uncertain disruptions and multiple connected disruptions.  ScienceDirect+1

 Your contribution is therefore **not inventing rolling horizon**; it is implementing a controlled junction-level framework in which different policies can be experimentally compared.

---

 # 17\. Baseline Scheduler — FCFS

 The first scheduler should be extremely simple.

 For conflicting trains:

 $$
T_i,T_j
$$

 compare predicted arrival:

 $$
ETA_i < ETA_j
$$

 Then:

 $$
Priority(T_i)>Priority(T_j)
$$

 if $T_i$ arrives first.

 The scheduler grants the resource to the first feasible train.

 This gives a reproducible baseline.

---

 # 18\. Baseline Scheduler — Dynamic Priority

 A second baseline can calculate:

 $$
P_i =
w_dD_i +
w_wW_i +
w_cC_i +
w_pP_i^{base}
$$

 where:

 - $D_i$ = current delay
- $W_i$ = accumulated waiting
- $C_i$ = estimated downstream conflict impact
- $P_i^{base}$ = predefined train priority.

 The weights are configurable.

 The point is to establish a stronger heuristic baseline before introducing GA.

---

 # 19\. Optimization Problem

 For a scheduling horizon, suppose:

 $$
T=\{T_1,T_2,\ldots,T_n\}
$$

 contains trains expected to encounter conflicts.

 The scheduler searches for an ordering:

 $$
\pi=(T_{\pi_1},T_{\pi_2},\ldots,T_{\pi_n})
$$

 and corresponding feasible timing decisions.

 The objective is:

 $$
\min F(\pi)
$$

 where:

 $$
F =
w_1D_{total}
+w_2D_{max}
+w_3W_{total}
+w_4C
+w_5R
$$

 where:

 - $D_{total}$ = total delay
- $D_{max}$ = maximum delay
- $W_{total}$ = total waiting
- $C$ = conflict/constraint penalties
- $R$ = optional computational or operational penalty.

---

 # 20\. Hard vs Soft Constraints

 This distinction must remain explicit.

 ## Hard constraints

 The solution is invalid if these are violated.

 Examples:

 $$
\text{Same block cannot be simultaneously occupied}
$$

 $$
\text{Conflicting routes cannot overlap}
$$

 $$
\text{Minimum headway must be maintained}
$$

 $$
\text{Train must follow a valid route}
$$

 $$
\text{Platform capacity cannot be exceeded}
$$

---

 ## Soft objectives

 These influence which valid solution is preferred.

 Examples:

 $$
\min total\ delay
$$

 $$
\min waiting
$$

 $$
\min maximum\ delay
$$

 $$
\max throughput
$$

 This distinction will be central to your implementation and viva.

---

 # 21\. Genetic Algorithm

 The GA should only optimize the **decision problem inside the current horizon**.

 Do not encode the entire day's timetable.

 For example:

```
Conflicting trains:

T1
T2
T3
T4
```

 A chromosome can be:

```
[T3, T1, T4, T2]
```

 meaning:

 > Prefer this movement ordering when resolving the relevant conflicts.

---

 # 22\. GA Population

 Initial population:

 $$
P_0=
\{\pi_1,\pi_2,\ldots,\pi_N\}
$$

 where each $\pi$ is a candidate ordering.

 Candidate generation should respect obvious feasibility constraints where possible.

---

 # 23\. Fitness Evaluation

 For every chromosome:

```
Candidate ordering
       ↓
Construct schedule
       ↓
Check constraints
       ↓
Simulate horizon
       ↓
Calculate metrics
       ↓
Fitness
```

 For example:

 $$
Fitness =
D_{total}
+\lambda_1D_{max}
+\lambda_2W
+\lambda_3Violations
$$

 where:

 $$
\lambda_3 \gg \lambda_1,\lambda_2
$$

 so infeasible solutions receive a very large penalty.

---

 # 24\. GA Operators

 Initial implementation:

 ### Selection

 Tournament selection.

 ### Crossover

 Order crossover (OX), because chromosomes represent permutations.

 ### Mutation

 Swap mutation:

```
[T1,T2,T3,T4]
       ↓
[T1,T3,T2,T4]
```

 ### Termination

 Stop when either:

```
generation >= Gmax
```

 or:

```
no meaningful improvement for K generations
```

---

 # 25\. Important: Don't Assume GA Wins

 This should be written directly into the research methodology.

 The experiment asks:

 > How do different scheduling approaches perform under different traffic conditions?

 It does **not** ask:

 > How can we prove GA is superior?

 Potential outcomes include:

```
FCFS > GA
```

 under low congestion,

 while:

```
GA > FCFS
```

 under high congestion.

 Or GA might produce better schedules but take considerably longer.

 All of these are valid experimental outcomes.

---

 # 26\. Scenario Model

 Every experiment should be reproducible.

 Define:

```
interface Scenario {
  id: string;

  duration: number;

  infrastructureId: string;

  trains: ScenarioTrain[];

  disturbances: Disturbance[];

  seed: number;
}
```

 The random seed is important.

 If:

```
seed = 12345
```

 then all algorithms should receive the exact same scenario.

 This prevents an unfair comparison.

---

 # 27\. Disturbance Model

 Introduce disturbances systematically.

 Examples:

 ### Train delay

```
T3 delayed by 5 minutes
```

 ### Station dwell disturbance

```
T2 dwell +90 seconds
```

 ### Temporary block closure

```
B4 unavailable for 5 minutes
```

 ### Route unavailable

```
R2 unavailable
```

 ### Speed restriction

```
B3 speed reduced to 30 km/h
```

 These are scenario inputs, not random bugs.

---

 # 28\. Traffic Density

 Define a traffic-density parameter:

 $$
\rho =
\frac{\text{number of trains}}
{\text{simulation duration}}
$$

 or use a simpler scenario classification:

```
LOW
MEDIUM
HIGH
EXTREME
```

 The exact classification should be calibrated to your chosen junction.

---

 # 29\. Experimental Matrix

 A first experiment could be:

 | Traffic | Disturbance | Scheduler |
| --- | --- | --- |
| Low | None | FCFS |
| Low | None | Priority |
| Low | None | GA |
| Medium | Low | FCFS |
| Medium | Low | Priority |
| Medium | Low | GA |
| High | Medium | FCFS |
| High | Medium | Priority |
| High | Medium | GA |
| Extreme | High | FCFS |
| Extreme | High | Priority |
| Extreme | High | GA |

Then repeat each configuration over many random scenarios.

---

 # 30\. Metrics

 For each simulation:

 ### Total delay

 $$
D_{total}=\sum_i D_i
$$

 ### Average delay

 $$
D_{avg}=\frac{1}{N}\sum_iD_i
$$

 ### Maximum delay

 $$
D_{max}=\max_i(D_i)
$$

 ### Total waiting

 $$
W_{total}=\sum_iW_i
$$

 ### Throughput

 $$
Throughput =
\frac{\text{completed trains}}
{\text{simulation duration}}
$$

 ### Resource utilization

 $$
U_R=
\frac{\text{resource occupied time}}
{\text{simulation time}}
$$

 ### Conflict count

 $$
C=\text{number of predicted conflicts}
$$

 ### Computation time

 $$
T_{compute}
$$

 measured independently for each scheduling decision.

---

 # 31\. Crucial Evaluation Metric: Real-Time Feasibility

 This should be added to the project.

 A scheduler is not useful for online operation if:

 $$
T_{compute} > T_{decision\ window}
$$

 For example, if your simulator gives the scheduler only 2 seconds to make a decision but GA requires 8 seconds, that scheduling configuration is operationally unusable within your model.

 Therefore measure:

```
Solution quality
        VS
Computation time
```

 This makes the project significantly more interesting.

---

 # 32\. Experimental Questions

 Your dissertation should revolve around questions such as:

 ### RQ1

 How does increasing train density affect junction congestion?

 ### RQ2

 How does increasing initial delay affect conflict propagation?

 ### RQ3

 How do FCFS, priority-based scheduling and GA differ in delay reduction?

 ### RQ4

 Does optimization provide greater benefit under high congestion?

 ### RQ5

 What computational cost is associated with improved scheduling quality?

 ### RQ6

 How sensitive are scheduling outcomes to the prediction horizon?

 ### RQ7

 How does disturbance severity affect scheduler performance?

 These are much better research questions than:

 > "Can AI optimize trains?"

---

 # 33\. Prediction Horizon Experiment

 This deserves its own experiment.

 Compare:

```
H = 5 min
H = 10 min
H = 20 min
H = 30 min
H = 60 min
```

 Measure:

```
delay
conflicts
throughput
runtime
```

 You may find that a longer horizon gives better decisions but increases computational cost.

 That gives you a very nice research result.

---

 # 34\. Replanning Frequency Experiment

 Similarly:

```
Replan every:
10 sec
30 sec
60 sec
120 sec
```

 Compare the outcomes.

 This directly investigates the tradeoff between:

 > responsiveness

 and:

 > computational overhead.

---

 # 35\. Historical Replay

 Once the synthetic system works:

```
Historical observation
        ↓
Scenario reconstruction
        ↓
Simulator
        ↓
Actual/replayed trajectory
        ↓
Alternative scheduler
        ↓
Counterfactual result
```

 The purpose is not to claim:

 > "Our algorithm would have operated the real railway better."

 Instead:

 > "Under the assumptions of our simulation model, how do alternative scheduling policies behave when initialized from an observed railway scenario?"

 That wording protects the academic validity of the experiment.

---

 # 36\. Optional Live Data

 Architecture:

```
              ┌───────────────┐
              │ Historical CSV│
              └───────┬───────┘
                      │
              ┌───────▼───────┐
              │ Data Adapter  │
              └───────┬───────┘
                      │
              ┌───────▼───────┐
              │ Normalization  │
              └───────┬───────┘
                      │
                      ▼
                 Scenario
```

 A live source can plug into the same adapter.

 **Never let your core simulator directly depend on a railway website/API.**

 If the source changes or disappears, your project still functions.

---

 # 37\. Software Architecture

 The final architecture should look approximately like:

```
src/
│
├── simulation/
│   ├── engine/
│   │   ├── SimulationEngine.ts
│   │   ├── SimulationClock.ts
│   │   └── EventQueue.ts
│   │
│   ├── infrastructure/
│   │   ├── RailwayGraph.ts
│   │   ├── TrackSegment.ts
│   │   ├── Block.ts
│   │   ├── Junction.ts
│   │   ├── Route.ts
│   │   └── Platform.ts
│   │
│   ├── trains/
│   │   ├── Train.ts
│   │   ├── TrainMovement.ts
│   │   └── TrainDynamics.ts
│   │
│   ├── conflicts/
│   │   ├── ConflictDetector.ts
│   │   ├── ConflictPredictor.ts
│   │   └── Conflict.ts
│   │
│   └── scheduler/
│       ├── Scheduler.ts
│       ├── FCFS.ts
│       ├── PriorityScheduler.ts
│       └── RollingHorizon.ts
│
├── algorithms/
│   └── genetic/
│       ├── GeneticScheduler.ts
│       ├── Population.ts
│       ├── Fitness.ts
│       ├── Selection.ts
│       ├── Crossover.ts
│       └── Mutation.ts
│
├── scenarios/
│   ├── ScenarioLoader.ts
│   ├── ScenarioGenerator.ts
│   ├── DisturbanceGenerator.ts
│   └── HistoricalReplay.ts
│
├── experiments/
│   ├── ExperimentRunner.ts
│   ├── Metrics.ts
│   └── Results.ts
│
├── data/
│
├── components/
│
└── types/
```

---

 # 38\. The Most Important Interface

 Everything should ultimately pass through something resembling:

```
interface Scheduler {
  schedule(
    state: SimulationState,
    horizon: number
  ): SchedulingDecision;
}
```

 Then:

```
const scheduler: Scheduler =
  new FCFSScheduler();
```

 or:

```
const scheduler: Scheduler =
  new GeneticScheduler();
```

 The simulator doesn't care.

 This lets you compare algorithms without rewriting the simulation engine.

---

 # 39\. Experiment Runner

 This is what separates your project from a demo.

 Something like:

```
runExperiment({
  scenarios,
  schedulers: [
    fcfs,
    priority,
    genetic
  ]
});
```

 Output:

```
interface ExperimentResult {
  scenarioId: string;
  scheduler: string;

  totalDelay: number;
  averageDelay: number;
  maxDelay: number;

  totalWaiting: number;

  throughput: number;

  conflicts: number;

  resourceUtilization: number;

  computationTime: number;
}
```

 Then your research results are generated automatically.

---

 # 40\. Statistical Evaluation

 Don't run one scenario and conclude anything.

 For each configuration:

```
100+
random scenarios
```

 where computationally practical.

 Calculate:

 $$
mean
$$

 $$
median
$$

 $$
standard\ deviation
$$

 and preferably confidence intervals.

 Then you can say something meaningful such as:

 > Across repeated scenarios at a given traffic level, scheduler A produced X% lower median delay than scheduler B under the defined simulation assumptions.

 That's much stronger than a screenshot of a train junction.

---

 # 41\. Testing Strategy

 You need three categories of testing.

 ## Unit tests

 Examples:

```
Can a train enter a free block?

Can two trains enter the same block?

Can a conflicting route be reserved?

Does a released block become available?

Does the conflict detector identify interval overlap?
```

 ## Simulation tests

```
One train
Two trains
Opposite-direction trains
Junction conflict
Station dwell
Block closure
```

 ## Algorithm tests

```
Known scheduling problem
       ↓
Expected feasible ordering
       ↓
Scheduler output
```

---

 # 42\. Safety of the Model

 This must be explicit in the report.

 The simulator is:

 > **a research and educational simulation environment.**

 It is not:

 - railway signalling software;
- safety-critical software;
- an operational dispatching system;
- a substitute for railway traffic controllers.

 The infrastructure abstraction and safety constraints are designed for algorithmic experimentation.

---

 # 43\. The MVP Order

 Do this **exactly in this order**.

 ### Phase 1

```
Railway graph
+
Train model
+
Simulation clock
```

 ### Phase 2

```
Train movement
+
Blocks
+
Stations
```

 ### Phase 3

```
Junction routes
+
Resource reservation
```

 ### Phase 4

```
Conflict detection
```

 ### Phase 5

```
FCFS
```

 ### Phase 6

```
Rolling horizon
```

 ### Phase 7

```
Priority scheduler
```

 ### Phase 8

```
GA
```

 ### Phase 9

```
Scenario generator
+
Experiment runner
```

 ### Phase 10

```
Historical replay
```

 ### Phase 11

```
Optional live data
```

 ### Phase 12

```
Beautiful UI
```

 Yes, **UI is phase 12**.

 Your original project instinct was to start with the railway visualization. For this version, resist that temptation.

---

 # 44\. Definition of a Successful Project

 ### Minimum success

```
✓ Junction simulator
✓ Multiple trains
✓ Blocks
✓ Resource constraints
✓ Conflict prediction
✓ FCFS
✓ Rolling-horizon scheduling
✓ Scenario generator
✓ Automated evaluation
```

 ### Strong project

```
Everything above
+
Priority scheduler
+
GA
+
historical replay
+
large-scale experiments
```

 ### Exceptional extension

```
Everything above
+
adaptive scheduler selection
+
uncertainty modelling
+
ACO/SA comparison
+
live-data ingestion
```

 But the third category is **not required**.

---

 # 45\. What We Will NOT Do Yet

 We will not start with:

```
GNN
RL
ACO
GA
Live API
Full Indian Railways
```

 all at once.

 First we make this work:

```
TRAIN
  ↓
ROUTE
  ↓
BLOCK
  ↓
JUNCTION
  ↓
CONFLICT
  ↓
DECISION
  ↓
RESOLUTION
```

 Then we make it measurable.

 Then we optimize it.

 Then we experiment.

 Then we add sophistication.

---

 # 46\. Final Mathematical Formulation

 The overall problem can be summarized as:

 Given:

 $$
G=(V,E)
$$

 $$
T=\{T_1,\ldots,T_n\}
$$

 $$
R=\{R_1,\ldots,R_m\}
$$

 and current state:

 $$
S_t
$$

 predict future train-resource occupation over horizon $H$:

 $$
O(T_i,R_j,H)
$$

 detect conflicts:

 $$
C(T_i,T_j,R_j)
$$

 generate feasible scheduling actions:

 $$
A(S_t)
$$

 and select:

 $$
a^*=
\arg\min_{a\in A(S_t)}
F(S_t,a)
$$

 subject to:

 $$
\text{Infrastructure constraints}
$$

 $$
\text{Headway constraints}
$$

 $$
\text{Route compatibility}
$$

 $$
\text{Resource capacity}
$$

 The chosen action is executed:

 $$
S_{t+\Delta t}
=
Transition(S_t,a^*)
$$

 and the process repeats.

 Therefore the complete system is:

 $$
\boxed{
Observe
\rightarrow
Predict
\rightarrow
Detect
\rightarrow
Optimize
\rightarrow
Act
\rightarrow
Reobserve
}
$$

 That is the **core intellectual structure of the project**.

---

 # 47\. The Actual Research Contribution

 The project should ultimately answer:

 > **How do different online railway conflict-resolution strategies behave as traffic density, disturbance severity, prediction horizon, and computational constraints change in a microscopic junction-level simulation?**

 That is a legitimate research question.

 The simulator gives you the experimental environment.

 The conflict detector gives you the problem.

 The rolling horizon gives you the online aspect.

 FCFS gives you a baseline.

 The GA gives you the optimization component.

 The scenario generator gives you experimental scale.

 The metrics give you evidence.

 And the historical replay gives you a connection to real-world railway operation.

 ## One important adjustment to our earlier plan

 After checking the current literature, I would **not make "GA" the centerpiece of your project title or research claim**. Rolling-horizon railway rescheduling itself is established, and current research is still pushing dynamic priority, triggered rolling horizons, MILP and other approaches.  Wiley Online Library+1

 Your strongest framing is:

 > **Online conflict-aware railway rescheduling in a microscopic junction simulation**

 and then:

 > _FCFS, dynamic priority, and Genetic Algorithm are the algorithms being experimentally evaluated._

 That keeps you academically honest and gives you freedom to discover that GA isn't the best approach for some scenarios.

 Also, mature tools such as OpenTrack already combine microscopic train movement, infrastructure, blocks/signalling, timetables, disturbances and statistical simulation.  Opentrack+1  **So your goal is absolutely not to build "OpenTrack but in React."** Your differentiation is the lightweight, open, programmable **online conflict-resolution experimentation framework** and the controlled comparison of scheduling policies.

 ### And now we can finally start coding.

 **The first implementation should be the domain model, not the UI.**

 The very next concrete artifact should be:

```
01. railway graph
02. block/resource model
03. train model
04. route/conflict model
05. simulation state
06. simulation clock
07. one train moving
08. multiple trains
09. block reservation
10. first conflict
```

 Once those ten things work, we can build the scheduling algorithms on top without having to rewrite the foundation.