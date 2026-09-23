import { RailwayView } from "./components/RailwayView";
import { SimulationControls } from "./components/SimulationControls";
import { TrainCard } from "./components/TrainCard";

import { INITIAL_BLOCKS } from "./data/blocks";
import { INITIAL_TRAINS } from "./data/trains";

import { useRailwaySimulation } from "./hooks/useRailwaySimulation";

function App() {
  const {
    trains,
    blocks,
    running,
    simulationSpeed,
    setSimulationSpeed,
    start,
    pause,
    reset,
  } = useRailwaySimulation({
    initialTrains:
      INITIAL_TRAINS,

    initialBlocks:
      INITIAL_BLOCKS,
  });

  const occupiedBlocks =
    blocks?.filter(
      (block) =>
        block.occupiedBy !== null
    ).length;

  return (
    <main className="min-h-screen bg-[#080c12] px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <header className="mb-6">
          <p className="text-sm font-medium text-cyan-400">
            INDIA RAILWAY SIMULATOR · MVP 03
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            Patna Jn ↔ Bakhtiyarpur
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Multi-train railway corridor with
            block occupancy and speed restrictions.
          </p>
        </header>

        {/* CONTROLS */}

        <SimulationControls
          running={running}
          simulationSpeed={
            simulationSpeed
          }
          onToggleRunning={() =>
            running
              ? pause()
              : start()
          }
          onReset={reset}
          onSpeedChange={
            setSimulationSpeed
          }
        />

        {/* RAILWAY */}

        <RailwayView
          trains={trains}
          blocks={blocks}
        />

        {/* TRAIN CARDS */}

        <section className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {trains.map((train) => (
            <TrainCard
              key={train.number}
              train={train}
            />
          ))}
        </section>

        {/* INFRASTRUCTURE STATE */}

        <section className="mt-4 rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="font-semibold">
            Infrastructure state
          </h2>

          <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">

            <div>
              <span className="text-slate-500">
                Active trains
              </span>

              <p className="mt-1 text-lg font-semibold">
                {trains.length}
              </p>
            </div>

            <div>
              <span className="text-slate-500">
                Track blocks
              </span>

              <p className="mt-1 text-lg font-semibold">
                {blocks?.length}
              </p>
            </div>

            <div>
              <span className="text-slate-500">
                Occupied blocks
              </span>

              <p className="mt-1 text-lg font-semibold">
                {occupiedBlocks}
              </p>
            </div>

            <div>
              <span className="text-slate-500">
                Bottleneck
              </span>

              <p className="mt-1 text-lg font-semibold text-amber-400">
                B3
              </p>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
}

export default App;




















// import { SimulationControls } from "./components/SimulationControls";
// import { RailwayView } from "./components/RailwayView";
// import { TrainCard } from "./components/TrainCard";

// import { INITIAL_TRAINS } from "./data/trains";

// import { useRailwaySimulation } from "./hooks/useRailwaySimulation";

// function App() {
//   const {
//     trains,
//     running,
//     simulationSpeed,
//     setSimulationSpeed,
//     start,
//     pause,
//     reset,
//   } = useRailwaySimulation({
//     initialTrains:
//       INITIAL_TRAINS,
//   });

//   return (
//     <main className="min-h-screen bg-[#080c12] px-4 py-8 text-slate-100">
//       <div className="mx-auto max-w-6xl">

//         {/* HEADER */}

//         <header className="mb-6">
//           <p className="text-sm font-medium text-cyan-400">
//             INDIA RAILWAY SIMULATOR · MVP 02
//           </p>

//           <h1 className="mt-1 text-3xl font-bold">
//             Patna Jn ↔ Bakhtiyarpur
//           </h1>

//           <p className="mt-2 text-sm text-slate-400">
//             Multiple trains running simultaneously
//             through the same railway corridor.
//           </p>
//         </header>

//         {/* CONTROLS */}

//         <SimulationControls
//           running={running}
//           simulationSpeed={
//             simulationSpeed
//           }
//           onToggleRunning={() =>
//             running
//               ? pause()
//               : start()
//           }
//           onReset={reset}
//           onSpeedChange={
//             setSimulationSpeed
//           }
//         />

//         {/* RAILWAY */}

//         <RailwayView
//           trains={trains}
//         />

//         {/* TRAIN CARDS */}

//         <section className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//           {trains.map((train) => (
//             <TrainCard
//               key={train.number}
//               train={train}
//             />
//           ))}
//         </section>

//         {/* SIMULATION STATE */}

//         <section className="mt-4 rounded-xl border border-slate-800 bg-slate-900 p-5">
//           <h2 className="font-semibold">
//             Simulation state
//           </h2>

//           <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">

//             <div>
//               <span className="text-slate-500">
//                 Active trains
//               </span>

//               <p className="mt-1 font-semibold">
//                 {trains.length}
//               </p>
//             </div>

//             <div>
//               <span className="text-slate-500">
//                 Running
//               </span>

//               <p className="mt-1 font-semibold">
//                 {
//                   trains.filter(
//                     (train) =>
//                       train.state ===
//                       "RUNNING"
//                   ).length
//                 }
//               </p>
//             </div>

//             <div>
//               <span className="text-slate-500">
//                 Stopped
//               </span>

//               <p className="mt-1 font-semibold">
//                 {
//                   trains.filter(
//                     (train) =>
//                       train.state ===
//                       "STOPPED"
//                   ).length
//                 }
//               </p>
//             </div>

//             <div>
//               <span className="text-slate-500">
//                 Simulation
//               </span>

//               <p className="mt-1 font-semibold text-cyan-400">
//                 {simulationSpeed}×
//               </p>
//             </div>

//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }

// export default App;




















// import { useEffect, useRef, useState } from "react";

// type Direction = "TO_BAKHTIYARPUR" | "TO_PATNA";
// type TrainState = "RUNNING" | "STOPPED";

// interface Train {
//   number: string;
//   name: string;

//   // 0 = Patna
//   // 100 = Bakhtiyarpur
//   position: number;

//   direction: Direction;

//   speed: number; // km/h
//   state: TrainState;

//   stationStopRemaining: number; // seconds
// }

// const PATNA = 0;
// const BAKHTIYARPUR = 100;

// const INITIAL_TRAIN: Train = {
//   number: "12562",
//   name: "Express",

//   position: PATNA,

//   direction: "TO_BAKHTIYARPUR",

//   speed: 80,

//   state: "STOPPED",

//   stationStopRemaining: 2,
// };

// function App() {
//   const [train, setTrain] = useState<Train>(INITIAL_TRAIN);
//   const [running, setRunning] = useState(false);

//   // Simulation speed multiplier.
//   // 1x = normal simulation
//   // 2x = twice as fast
//   // 4x = four times as fast
//   const [simulationSpeed, setSimulationSpeed] = useState(1);

//   const animationRef = useRef<number | null>(null);
//   const previousTimeRef = useRef<number | null>(null);

//   /*
//    * One important conversion:
//    *
//    * Our railway is represented as 100 "position units".
//    *
//    * We don't need real geographical distance yet.
//    * We simply want the train to move smoothly between
//    * Patna (0) and Bakhtiyarpur (100).
//    */
//   const POSITION_UNITS_PER_SECOND_AT_80_KMH = 8;

//   useEffect(() => {
//     if (!running) {
//       if (animationRef.current !== null) {
//         cancelAnimationFrame(animationRef.current);
//       }

//       previousTimeRef.current = null;

//       return;
//     }

//     const tick = (currentTime: number) => {
//       if (previousTimeRef.current === null) {
//         previousTimeRef.current = currentTime;
//       }

//       const deltaMilliseconds =
//         currentTime - previousTimeRef.current;

//       previousTimeRef.current = currentTime;

//       // Prevent a huge jump if the browser/tab was suspended.
//       const deltaSeconds = Math.min(deltaMilliseconds / 1000, 0.1);

//       setTrain((currentTrain) => {
//         let nextTrain = {
//           ...currentTrain,
//         };

//         /*
//          * TRAIN IS STOPPED AT A STATION
//          */
//         if (nextTrain.state === "STOPPED") {
//           nextTrain.stationStopRemaining -=
//             deltaSeconds * simulationSpeed;

//           if (nextTrain.stationStopRemaining <= 0) {
//             nextTrain.state = "RUNNING";
//           }

//           return nextTrain;
//         }

//         /*
//          * TRAIN IS RUNNING
//          */

//         const directionMultiplier =
//           nextTrain.direction === "TO_BAKHTIYARPUR"
//             ? 1
//             : -1;

//         const movement =
//           (nextTrain.speed /
//             80) *
//           POSITION_UNITS_PER_SECOND_AT_80_KMH *
//           deltaSeconds *
//           simulationSpeed;

//         nextTrain.position +=
//           movement * directionMultiplier;

//         /*
//          * REACHED BAKHTIYARPUR
//          */
//         if (
//           nextTrain.direction === "TO_BAKHTIYARPUR" &&
//           nextTrain.position >= BAKHTIYARPUR
//         ) {
//           nextTrain.position = BAKHTIYARPUR;

//           nextTrain.direction = "TO_PATNA";

//           nextTrain.state = "STOPPED";

//           nextTrain.stationStopRemaining = 2;
//         }

//         /*
//          * REACHED PATNA
//          */
//         if (
//           nextTrain.direction === "TO_PATNA" &&
//           nextTrain.position <= PATNA
//         ) {
//           nextTrain.position = PATNA;

//           nextTrain.direction = "TO_BAKHTIYARPUR";

//           nextTrain.state = "STOPPED";

//           nextTrain.stationStopRemaining = 2;
//         }

//         return nextTrain;
//       });

//       animationRef.current =
//         requestAnimationFrame(tick);
//     };

//     animationRef.current =
//       requestAnimationFrame(tick);

//     return () => {
//       if (animationRef.current !== null) {
//         cancelAnimationFrame(animationRef.current);
//       }
//     };
//   }, [running, simulationSpeed]);

//   function resetSimulation() {
//     setRunning(false);
//     setTrain(INITIAL_TRAIN);
//   }

//   /*
//    * Convert our railway position (0 → 100)
//    * into an SVG x coordinate.
//    */
//   const getTrainX = (position: number) => {
//     const left = 100;
//     const right = 900;

//     return left + ((right - left) * position) / 100;
//   };

//   const trainX = getTrainX(train.position);

//   const directionText =
//     train.direction === "TO_BAKHTIYARPUR"
//       ? "→ Bakhtiyarpur"
//       : "← Patna Jn";

//   const statusText =
//     train.state === "STOPPED"
//       ? train.position === 0
//         ? "Stopped at Patna Jn"
//         : "Stopped at Bakhtiyarpur"
//       : directionText;

//   return (
//     <main className="min-h-screen bg-[#080c12] px-4 py-8 text-slate-100">
//       <div className="mx-auto max-w-6xl">
//         {/* HEADER */}

//         <header className="mb-6">
//           <p className="text-sm font-medium text-cyan-400">
//             INDIA RAILWAY SIMULATOR · MVP 01
//           </p>

//           <h1 className="mt-1 text-3xl font-bold">
//             Patna Jn ↔ Bakhtiyarpur
//           </h1>

//           <p className="mt-2 text-sm text-slate-400">
//             One train running continuously between two stations.
//           </p>
//         </header>

//         {/* CONTROLS */}

//         <section className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
//           <button
//             onClick={() => setRunning((value) => !value)}
//             className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold transition hover:bg-blue-500"
//           >
//             {running ? "Ⅱ Pause" : "▶ Start"}
//           </button>

//           <button
//             onClick={resetSimulation}
//             className="rounded-lg border border-slate-700 bg-slate-800 px-5 py-2.5 font-semibold hover:bg-slate-700"
//           >
//             ↻ Reset
//           </button>

//           <div className="ml-0 flex items-center gap-2 sm:ml-4">
//             <span className="text-sm text-slate-400">
//               Simulation speed
//             </span>

//             {[1, 2, 4].map((speed) => (
//               <button
//                 key={speed}
//                 onClick={() => setSimulationSpeed(speed)}
//                 className={`rounded-md px-3 py-2 text-sm ${
//                   simulationSpeed === speed
//                     ? "bg-cyan-500 text-slate-950"
//                     : "bg-slate-800 text-slate-300"
//                 }`}
//               >
//                 {speed}×
//               </button>
//             ))}
//           </div>
//         </section>

//         {/* RAILWAY */}

//         <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0b1018]">
//           <div className="border-b border-slate-800 p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h2 className="font-semibold">
//                   Live Railway
//                 </h2>

//                 <p className="text-xs text-slate-500">
//                   Schematic view · not geographically to scale
//                 </p>
//               </div>

//               <div
//                 className={`rounded-full px-3 py-1 text-xs font-semibold ${
//                   train.state === "RUNNING"
//                     ? "bg-emerald-950 text-emerald-400"
//                     : "bg-amber-950 text-amber-400"
//                 }`}
//               >
//                 {train.state}
//               </div>
//             </div>
//           </div>

//           <div className="p-3 sm:p-6">
//             <svg
//               viewBox="0 0 1000 360"
//               className="h-auto w-full"
//               role="img"
//               aria-label="Patna to Bakhtiyarpur railway with moving train"
//             >
//               {/* Background */}

//               <rect
//                 x="0"
//                 y="0"
//                 width="1000"
//                 height="360"
//                 rx="16"
//                 fill="#070b11"
//               />

//               {/* Station labels */}

//               <text
//                 x="60"
//                 y="55"
//                 fill="#f1f5f9"
//                 fontSize="23"
//                 fontWeight="700"
//               >
//                 Patna Jn
//               </text>

//               <text
//                 x="785"
//                 y="55"
//                 fill="#f1f5f9"
//                 fontSize="23"
//                 fontWeight="700"
//               >
//                 Bakhtiyarpur
//               </text>

//               {/* Direction labels */}

//               <text
//                 x="60"
//                 y="82"
//                 fill="#64748b"
//                 fontSize="12"
//               >
//                 STATION A
//               </text>

//               <text
//                 x="785"
//                 y="82"
//                 fill="#64748b"
//                 fontSize="12"
//               >
//                 STATION B
//               </text>

//               {/* Main railway */}

//               <line
//                 x1="100"
//                 y1="180"
//                 x2="900"
//                 y2="180"
//                 stroke="#4b5563"
//                 strokeWidth="12"
//               />

//               {/* Rails */}

//               <line
//                 x1="100"
//                 y1="174"
//                 x2="900"
//                 y2="174"
//                 stroke="#202833"
//                 strokeWidth="2"
//               />

//               <line
//                 x1="100"
//                 y1="186"
//                 x2="900"
//                 y2="186"
//                 stroke="#202833"
//                 strokeWidth="2"
//               />

//               {/* Sleepers */}

//               {Array.from({ length: 17 }).map((_, index) => {
//                 const x = 120 + index * 47;

//                 return (
//                   <line
//                     key={index}
//                     x1={x}
//                     y1="163"
//                     x2={x}
//                     y2="197"
//                     stroke="#303946"
//                     strokeWidth="4"
//                   />
//                 );
//               })}

//               {/* Station circles */}

//               <circle
//                 cx="100"
//                 cy="180"
//                 r="15"
//                 fill="#111827"
//                 stroke="#38bdf8"
//                 strokeWidth="4"
//               />

//               <circle
//                 cx="900"
//                 cy="180"
//                 r="15"
//                 fill="#111827"
//                 stroke="#38bdf8"
//                 strokeWidth="4"
//               />

//               {/* Train */}

//               <g
//                 transform={`translate(${trainX},180)`}
//                 style={{
//                   transition:
//                     "transform 0.05s linear",
//                 }}
//               >
//                 {/* Glow */}

//                 <circle
//                   r="30"
//                   fill="#22d3ee"
//                   opacity="0.08"
//                 />

//                 {/* Train body */}

//                 <rect
//                   x="-35"
//                   y="-17"
//                   width="70"
//                   height="34"
//                   rx="8"
//                   fill="#22d3ee"
//                   stroke="#ecfeff"
//                   strokeWidth="2"
//                 />

//                 {/* Windows */}

//                 <rect
//                   x="-23"
//                   y="-9"
//                   width="11"
//                   height="9"
//                   rx="2"
//                   fill="#082f49"
//                 />

//                 <rect
//                   x="-7"
//                   y="-9"
//                   width="11"
//                   height="9"
//                   rx="2"
//                   fill="#082f49"
//                 />

//                 <rect
//                   x="9"
//                   y="-9"
//                   width="11"
//                   height="9"
//                   rx="2"
//                   fill="#082f49"
//                 />

//                 {/* Train number */}

//                 <text
//                   x="0"
//                   y="27"
//                   textAnchor="middle"
//                   fill="#cbd5e1"
//                   fontSize="11"
//                   fontWeight="700"
//                 >
//                   12562
//                 </text>
//               </g>

//               {/* Direction arrow */}

//               <text
//                 x={trainX}
//                 y="125"
//                 textAnchor="middle"
//                 fill="#67e8f9"
//                 fontSize="14"
//                 fontWeight="700"
//               >
//                 {train.direction === "TO_BAKHTIYARPUR"
//                   ? "→"
//                   : "←"}
//               </text>

//               {/* Midpoint marker */}

//               <line
//                 x1="500"
//                 y1="145"
//                 x2="500"
//                 y2="215"
//                 stroke="#334155"
//                 strokeDasharray="4 5"
//               />

//               <text
//                 x="500"
//                 y="240"
//                 textAnchor="middle"
//                 fill="#64748b"
//                 fontSize="11"
//               >
//                 Corridor midpoint
//               </text>
//             </svg>
//           </div>
//         </section>

//         {/* TRAIN INFORMATION */}

//         <section className="mt-4 grid gap-4 md:grid-cols-3">
//           <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
//             <p className="text-xs text-slate-500">
//               TRAIN
//             </p>

//             <h3 className="mt-1 text-xl font-bold">
//               12562
//             </h3>

//             <p className="text-sm text-slate-400">
//               {train.name}
//             </p>
//           </div>

//           <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
//             <p className="text-xs text-slate-500">
//               POSITION
//             </p>

//             <h3 className="mt-1 text-xl font-bold">
//               {train.position.toFixed(1)}%
//             </h3>

//             <p className="text-sm text-cyan-400">
//               {statusText}
//             </p>
//           </div>

//           <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
//             <p className="text-xs text-slate-500">
//               SPEED
//             </p>

//             <h3 className="mt-1 text-xl font-bold">
//               {train.speed} km/h
//             </h3>

//             <p className="text-sm text-slate-400">
//               Simulation: {simulationSpeed}×
//             </p>
//           </div>
//         </section>

//         {/* CURRENT STATE */}

//         <section className="mt-4 rounded-xl border border-slate-800 bg-slate-900 p-5">
//           <h2 className="font-semibold">
//             Simulation state
//           </h2>

//           <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
//             <div>
//               <span className="text-slate-500">
//                 Direction
//               </span>

//               <p className="mt-1 font-semibold">
//                 {directionText}
//               </p>
//             </div>

//             <div>
//               <span className="text-slate-500">
//                 State
//               </span>

//               <p className="mt-1 font-semibold">
//                 {train.state}
//               </p>
//             </div>

//             <div>
//               <span className="text-slate-500">
//                 Station stop
//               </span>

//               <p className="mt-1 font-semibold">
//                 {train.state === "STOPPED"
//                   ? `${Math.max(
//                       0,
//                       train.stationStopRemaining
//                     ).toFixed(1)} sec`
//                   : "—"}
//               </p>
//             </div>

//             <div>
//               <span className="text-slate-500">
//                 Route
//               </span>

//               <p className="mt-1 font-semibold">
//                 Patna ↔ Bakhtiyarpur
//               </p>
//             </div>
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }

// export default App;