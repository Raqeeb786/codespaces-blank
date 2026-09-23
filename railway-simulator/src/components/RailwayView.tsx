import type { Train } from "../types/railway";

interface RailwayViewProps {
  trains: Train[];
}

const getTrainX = (
  position: number
) => {
  const left = 100;
  const right = 900;

  return (
    left +
    ((right - left) * position) /
      100
  );
};

export function RailwayView({
  trains,
}: RailwayViewProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0b1018]">
      <div className="border-b border-slate-800 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">
              Live Railway
            </h2>

            <p className="text-xs text-slate-500">
              Schematic view · not geographically
              to scale
            </p>
          </div>

          <div className="rounded-full bg-emerald-950 px-3 py-1 text-xs font-semibold text-emerald-400">
            LIVE
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-6">
        <svg
          viewBox="0 0 1000 360"
          className="h-auto w-full"
          role="img"
          aria-label="Patna to Bakhtiyarpur railway with multiple moving trains"
        >
          {/* Background */}

          <rect
            x="0"
            y="0"
            width="1000"
            height="360"
            rx="16"
            fill="#070b11"
          />

          {/* Station labels */}

          <text
            x="60"
            y="55"
            fill="#f1f5f9"
            fontSize="23"
            fontWeight="700"
          >
            Patna Jn
          </text>

          <text
            x="785"
            y="55"
            fill="#f1f5f9"
            fontSize="23"
            fontWeight="700"
          >
            Bakhtiyarpur
          </text>

          {/* Station labels */}

          <text
            x="60"
            y="82"
            fill="#64748b"
            fontSize="12"
          >
            STATION A
          </text>

          <text
            x="785"
            y="82"
            fill="#64748b"
            fontSize="12"
          >
            STATION B
          </text>

          {/* Railway */}

          <line
            x1="100"
            y1="180"
            x2="900"
            y2="180"
            stroke="#4b5563"
            strokeWidth="12"
          />

          {/* Rails */}

          <line
            x1="100"
            y1="174"
            x2="900"
            y2="174"
            stroke="#202833"
            strokeWidth="2"
          />

          <line
            x1="100"
            y1="186"
            x2="900"
            y2="186"
            stroke="#202833"
            strokeWidth="2"
          />

          {/* Sleepers */}

          {Array.from({
            length: 17,
          }).map((_, index) => {
            const x =
              120 + index * 47;

            return (
              <line
                key={index}
                x1={x}
                y1="163"
                x2={x}
                y2="197"
                stroke="#303946"
                strokeWidth="4"
              />
            );
          })}

          {/* Station circles */}

          <circle
            cx="100"
            cy="180"
            r="15"
            fill="#111827"
            stroke="#38bdf8"
            strokeWidth="4"
          />

          <circle
            cx="900"
            cy="180"
            r="15"
            fill="#111827"
            stroke="#38bdf8"
            strokeWidth="4"
          />

          {/* ================================= */}
          {/* TRAINS                            */}
          {/* ================================= */}

          {trains.map((train) => {
            const trainX =
              getTrainX(
                train.position
              );

            /*
             * Upper visual lane:
             * Patna → Bakhtiyarpur
             *
             * Lower visual lane:
             * Bakhtiyarpur → Patna
             *
             * This is still one corridor.
             */

            const trainY =
              train.direction ===
              "TO_BAKHTIYARPUR"
                ? 168
                : 192;

            return (
              <g
                key={train.number}
                transform={`translate(${trainX},${trainY})`}
              >
                {/* Glow */}

                <circle
                  r="30"
                  fill={train.color}
                  opacity="0.08"
                />

                {/* Train body */}

                <rect
                  x="-35"
                  y="-13"
                  width="70"
                  height="26"
                  rx="7"
                  fill={train.color}
                  stroke="#ecfeff"
                  strokeWidth="2"
                />

                {/* Windows */}

                <rect
                  x="-23"
                  y="-7"
                  width="11"
                  height="8"
                  rx="2"
                  fill="#082f49"
                />

                <rect
                  x="-7"
                  y="-7"
                  width="11"
                  height="8"
                  rx="2"
                  fill="#082f49"
                />

                <rect
                  x="9"
                  y="-7"
                  width="11"
                  height="8"
                  rx="2"
                  fill="#082f49"
                />

                {/* Direction */}

                <text
                  x="0"
                  y="-22"
                  textAnchor="middle"
                  fill={train.color}
                  fontSize="14"
                  fontWeight="700"
                >
                  {train.direction ===
                  "TO_BAKHTIYARPUR"
                    ? "→"
                    : "←"}
                </text>

                {/* Train number */}

                <text
                  x="0"
                  y="25"
                  textAnchor="middle"
                  fill="#cbd5e1"
                  fontSize="10"
                  fontWeight="700"
                >
                  {train.number}
                </text>
              </g>
            );
          })}

          {/* Midpoint marker */}

          <line
            x1="500"
            y1="130"
            x2="500"
            y2="230"
            stroke="#334155"
            strokeDasharray="4 5"
          />

          <text
            x="500"
            y="250"
            textAnchor="middle"
            fill="#64748b"
            fontSize="11"
          >
            Corridor midpoint
          </text>
        </svg>
      </div>
    </section>
  );
}
