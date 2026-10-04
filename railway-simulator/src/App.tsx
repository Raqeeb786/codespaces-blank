import { RailwayView } from "./components/RailwayView";
import { SimulationControls } from "./components/SimulationControls";
import { TrainCard } from "./components/TrainCard";

import { INITIAL_BLOCKS } from "./data/blocks";
import { INITIAL_TRACKS } from "./data/tracks";
import { INITIAL_TRAINS } from "./data/trains";
import { INITIAL_SIGNALS } from "./data/signals";

import { useRailwaySimulation } from "./hooks/useRailwaySimulation";

function App() {
  const {
  trains,
  blocks,
  signals,
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

  initialSignals:
    INITIAL_SIGNALS,
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
          simulationSpeed={simulationSpeed}
          onToggleRunning={() =>
            running ? pause() : start()
          }
          onReset={reset}
          onSpeedChange={setSimulationSpeed}
        />

        {/* RAILWAY */}

        <RailwayView
          tracks={INITIAL_TRACKS}
          trains={trains}
          blocks={blocks}
          signals={signals}
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
