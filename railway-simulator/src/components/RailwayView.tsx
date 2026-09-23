import type {
  TrackBlock,
  Train,
} from "../types/railway";

interface RailwayViewProps {
  trains: Train[];
  blocks: TrackBlock[];
}

const getX = (
  position: number
) => {
  const left = 100;
  const right = 900;

  return (
    left +
    ((right - left) *
      position) /
      100
  );
};

export function RailwayView({
  trains,
  blocks,
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
              Patna Jn ↔ Bakhtiyarpur ·
              block-level simulation
            </p>
          </div>

          <div className="rounded-full bg-emerald-950 px-3 py-1 text-xs font-semibold text-emerald-400">
            LIVE
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-6">
        <svg
          viewBox="0 0 1000 420"
          className="h-auto w-full"
        >
          {/* Background */}

          <rect
            width="1000"
            height="420"
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

          <text
            x="60"
            y="80"
            fill="#64748b"
            fontSize="12"
          >
            STATION A
          </text>

          <text
            x="785"
            y="80"
            fill="#64748b"
            fontSize="12"
          >
            STATION B
          </text>

          {/* ================================= */}
          {/* BLOCK BACKGROUNDS                 */}
          {/* ================================= */}

          {blocks?.map((block) => {
            const x1 =
              getX(block.start);

            const x2 =
              getX(block.end);

            const width =
              x2 - x1;

            const occupied =
              block.occupiedBy !==
              null;

            return (
              <g key={block.id}>
                <rect
                  x={x1}
                  y="105"
                  width={width}
                  height="150"
                  fill={
                    block.isBottleneck
                      ? "#451a03"
                      : occupied
                      ? "#172554"
                      : "#0f172a"
                  }
                  opacity={
                    block.isBottleneck
                      ? 0.45
                      : 0.8
                  }
                  stroke={
                    block.isBottleneck
                      ? "#f59e0b"
                      : "#1e293b"
                  }
                  strokeWidth="1"
                  strokeDasharray={
                    block.isBottleneck
                      ? "5 4"
                      : undefined
                  }
                />

                {/* Block ID */}

                <text
                  x={
                    x1 +
                    width / 2
                  }
                  y="125"
                  textAnchor="middle"
                  fill={
                    block.isBottleneck
                      ? "#fbbf24"
                      : "#64748b"
                  }
                  fontSize="11"
                  fontWeight="700"
                >
                  {block.id}
                </text>

                {/* Speed limit */}

                <text
                  x={
                    x1 +
                    width / 2
                  }
                  y="142"
                  textAnchor="middle"
                  fill="#475569"
                  fontSize="9"
                >
                  {block.speedLimit} km/h
                </text>

                {/* Occupancy */}

                {occupied && (
                  <text
                    x={
                      x1 +
                      width / 2
                    }
                    y="235"
                    textAnchor="middle"
                    fill="#38bdf8"
                    fontSize="9"
                    fontWeight="700"
                  >
                    OCCUPIED
                  </text>
                )}

                {/* Bottleneck */}

                {block.isBottleneck && (
                  <text
                    x={
                      x1 +
                      width / 2
                    }
                    y="155"
                    textAnchor="middle"
                    fill="#f59e0b"
                    fontSize="9"
                    fontWeight="700"
                  >
                    BOTTLENECK
                  </text>
                )}
              </g>
            );
          })}

          {/* ================================= */}
          {/* RAILWAY                           */}
          {/* ================================= */}

          <line
            x1="100"
            y1="180"
            x2="900"
            y2="180"
            stroke="#4b5563"
            strokeWidth="12"
          />

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
              120 +
              index * 47;

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

          {/* Stations */}

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
              getX(
                train.position
              );

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
                  fill={
                    train.color
                  }
                  opacity="0.08"
                />

                {/* Train */}

                <rect
                  x="-35"
                  y="-13"
                  width="70"
                  height="26"
                  rx="7"
                  fill={
                    train.color
                  }
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
                  fill={
                    train.color
                  }
                  fontSize="14"
                  fontWeight="700"
                >
                  {train.direction ===
                  "TO_BAKHTIYARPUR"
                    ? "→"
                    : "←"}
                </text>

                {/* Number */}

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

          {/* Block legend */}

          <text
            x="100"
            y="310"
            fill="#64748b"
            fontSize="11"
          >
            TRACK BLOCKS
          </text>

          <rect
            x="100"
            y="325"
            width="14"
            height="14"
            fill="#172554"
          />

          <text
            x="122"
            y="336"
            fill="#64748b"
            fontSize="10"
          >
            Occupied
          </text>

          <rect
            x="195"
            y="325"
            width="14"
            height="14"
            fill="#451a03"
          />

          <text
            x="217"
            y="336"
            fill="#64748b"
            fontSize="10"
          >
            Bottleneck
          </text>
        </svg>
      </div>
    </section>
  );
}
