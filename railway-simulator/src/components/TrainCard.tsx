import type { Train } from "../types/railway";

interface TrainCardProps {
  train: Train;
}

export function TrainCard({
  train,
}: TrainCardProps) {
  const directionText =
    train.direction ===
    "TO_BAKHTIYARPUR"
      ? "→ Bakhtiyarpur"
      : "← Patna Jn";

  const station =
    train.position <= 0
      ? "Patna Jn"
      : train.position >= 100
      ? "Bakhtiyarpur"
      : "En route";

  const stateClasses = {
      RUNNING:
        "bg-emerald-950 text-emerald-400",

      SLOWING:
        "bg-yellow-950 text-yellow-400",

      HOLDING:
        "bg-red-950 text-red-400",

      STOPPED:
        "bg-amber-950 text-amber-400",
    };


  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-500">
            {train.type}
          </p>

          <h3
            className="mt-1 text-xl font-bold"
            style={{
              color: train.color,
            }}
          >
            {train.number}
          </h3>

          <p className="text-sm text-slate-400">
            {train.name}
          </p>
        </div>

        <div
          className={`rounded-full px-2 py-1 text-xs ${
            stateClasses[train.state]
          }`}
        >
          {train.state}
        </div>
      </div>

      <div className="mt-4 space-y-1 text-sm">
        <p className="text-slate-400">
          Position:{" "}
          <span className="text-slate-200">
            {train.position.toFixed(1)}%
          </span>
        </p>

        <p className="text-slate-400">
          Speed:{" "}
          <span className="text-slate-200">
            {train.speed} km/h
          </span>
        </p>

        <p className="text-cyan-400">
          {train.state ===
          "STOPPED"
            ? `Stopped at ${station}`
            : directionText}
        </p>
      </div>
    </div>
  );
}
