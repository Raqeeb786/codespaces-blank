interface SimulationControlsProps {
  running: boolean;

  simulationSpeed: number;

  onToggleRunning: () => void;

  onReset: () => void;

  onSpeedChange: (
    speed: number
  ) => void;
}

export function SimulationControls({
  running,
  simulationSpeed,
  onToggleRunning,
  onReset,
  onSpeedChange,
}: SimulationControlsProps) {
  return (
    <section className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <button
        onClick={onToggleRunning}
        className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold transition hover:bg-blue-500"
      >
        {running
          ? "Ⅱ Pause"
          : "▶ Start"}
      </button>

      <button
        onClick={onReset}
        className="rounded-lg border border-slate-700 bg-slate-800 px-5 py-2.5 font-semibold hover:bg-slate-700"
      >
        ↻ Reset
      </button>

      <div className="ml-0 flex items-center gap-2 sm:ml-4">
        <span className="text-sm text-slate-400">
          Simulation speed
        </span>

        {[1, 2, 4].map((speed) => (
          <button
            key={speed}
            onClick={() =>
              onSpeedChange(speed)
            }
            className={`rounded-md px-3 py-2 text-sm ${
              simulationSpeed === speed
                ? "bg-cyan-500 text-slate-950"
                : "bg-slate-800 text-slate-300"
            }`}
          >
            {speed}×
          </button>
        ))}
      </div>
    </section>
  );
}
