import type {
  Signal,
  Track,
  TrackBlock,
  Train,
} from "../types/railway";

interface RailwayViewProps {
  tracks: Track[];
  trains: Train[];
  blocks: TrackBlock[];
  signals: Signal[];
}

const getX = (
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

const getTrackY = (
  trackId: string
) => {
  switch (trackId) {
    case "T1":
      return 170;

    case "T2":
      return 260;

    default:
      return 170;
  }
};

const getSignalColor = (
  aspect: Signal["aspect"]
) => {
  switch (aspect) {
    case "GREEN":
      return "#22c55e";

    case "RED":
      return "#ef4444";

    default:
      return "#64748b";
  }
};

export function RailwayView({
  tracks,
  trains,
  blocks,
  signals,
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
              multi-track infrastructure
            </p>
          </div>

          <div className="rounded-full bg-emerald-950 px-3 py-1 text-xs font-semibold text-emerald-400">
            LIVE
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-6">
        <svg
          viewBox="0 0 1000 430"
          className="h-auto w-full"
        >
          {/* ================================= */}
          {/* BACKGROUND                         */}
          {/* ================================= */}

          <rect
            width="1000"
            height="430"
            rx="16"
            fill="#070b11"
          />

          {/* ================================= */}
          {/* STATION LABELS                    */}
          {/* ================================= */}

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
          {/* TRACKS                             */}
          {/* ================================= */}

          {tracks.map((track) => {
            const y =
              getTrackY(track.id);

            return (
              <g key={track.id}>
                {/* Track label */}

                <text
                  x="55"
                  y={y - 20}
                  fill="#94a3b8"
                  fontSize="11"
                  fontWeight="700"
                >
                  {track.id}
                </text>

                {/* Track base */}

                <line
                  x1="100"
                  y1={y}
                  x2="900"
                  y2={y}
                  stroke="#4b5563"
                  strokeWidth="12"
                />

                {/* Rails */}

                <line
                  x1="100"
                  y1={y - 6}
                  x2="900"
                  y2={y - 6}
                  stroke="#202833"
                  strokeWidth="2"
                />

                <line
                  x1="100"
                  y1={y + 6}
                  x2="900"
                  y2={y + 6}
                  stroke="#202833"
                  strokeWidth="2"
                />

                {/* Sleepers */}

                {Array.from({
                  length: 17,
                }).map(
                  (_, index) => {
                    const x =
                      120 +
                      index * 47;

                    return (
                      <line
                        key={`${track.id}-sleeper-${index}`}
                        x1={x}
                        y1={y - 17}
                        x2={x}
                        y2={y + 17}
                        stroke="#303946"
                        strokeWidth="4"
                      />
                    );
                  }
                )}

                {/* Station ends */}

                <circle
                  cx="100"
                  cy={y}
                  r="12"
                  fill="#111827"
                  stroke="#38bdf8"
                  strokeWidth="3"
                />

                <circle
                  cx="900"
                  cy={y}
                  r="12"
                  fill="#111827"
                  stroke="#38bdf8"
                  strokeWidth="3"
                />
              </g>
            );
          })}

          {/* ================================= */}
          {/* BLOCKS                             */}
          {/* ================================= */}

          {blocks.map((block) => {
            const x1 =
              getX(block.start);

            const x2 =
              getX(block.end);

            const width =
              x2 - x1;

            const trackY =
              getTrackY(
                block.trackId
              );

            const occupied =
              block.occupiedBy !== null;

            return (
              <g key={block.id}>
                <rect
                  x={x1}
                  y={trackY - 32}
                  width={width}
                  height="64"
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

                <text
                  x={
                    x1 +
                    width / 2
                  }
                  y={trackY - 13}
                  textAnchor="middle"
                  fill={
                    block.isBottleneck
                      ? "#fbbf24"
                      : "#64748b"
                  }
                  fontSize="10"
                  fontWeight="700"
                >
                  {block.id}
                </text>

                <text
                  x={
                    x1 +
                    width / 2
                  }
                  y={trackY + 1}
                  textAnchor="middle"
                  fill="#475569"
                  fontSize="8"
                >
                  {block.speedLimit} km/h
                </text>

                {occupied && (
                  <text
                    x={
                      x1 +
                      width / 2
                    }
                    y={trackY + 19}
                    textAnchor="middle"
                    fill="#38bdf8"
                    fontSize="8"
                    fontWeight="700"
                  >
                    OCCUPIED
                  </text>
                )}

                {block.isBottleneck && (
                  <text
                    x={
                      x1 +
                      width / 2
                    }
                    y={trackY + 19}
                    textAnchor="middle"
                    fill="#f59e0b"
                    fontSize="8"
                    fontWeight="700"
                  >
                    BOTTLENECK
                  </text>
                )}
              </g>
            );
          })}

          {/* ================================= */}
          {/* SIGNALS                            */}
          {/* ================================= */}

          {signals.map((signal) => {
            const x =
              getX(signal.position);

            const trackY =
              getTrackY(
                signal.trackId
              );

            const signalColor =
              getSignalColor(
                signal.aspect
              );

            /*
             * Put UP signals above the track.
             * Put DOWN signals below the track.
             */

            const signalY =
              signal.direction ===
              "TO_BAKHTIYARPUR"
                ? trackY - 48
                : trackY + 48;

            return (
              <g key={signal.id}>
                {/* Signal pole */}

                <line
                  x1={x}
                  y1={signalY}
                  x2={x}
                  y2={trackY}
                  stroke="#64748b"
                  strokeWidth="2"
                />

                {/* Signal housing */}

                <rect
                  x={x - 8}
                  y={signalY - 13}
                  width="16"
                  height="26"
                  rx="4"
                  fill="#111827"
                  stroke="#475569"
                  strokeWidth="1"
                />

                {/* Signal light */}

                <circle
                  cx={x}
                  cy={signalY}
                  r="5"
                  fill={signalColor}
                />

                {/* Glow */}

                <circle
                  cx={x}
                  cy={signalY}
                  r="10"
                  fill={signalColor}
                  opacity="0.12"
                />

                {/* Direction marker */}

                <text
                  x={x}
                  y={
                    signal.direction ===
                    "TO_BAKHTIYARPUR"
                      ? signalY - 18
                      : signalY + 25
                  }
                  textAnchor="middle"
                  fill={signalColor}
                  fontSize="9"
                  fontWeight="700"
                >
                  {signal.direction ===
                  "TO_BAKHTIYARPUR"
                    ? "→"
                    : "←"}
                </text>

                {/* Signal ID */}

                <text
                  x={x}
                  y={
                    signal.direction ===
                    "TO_BAKHTIYARPUR"
                      ? signalY - 30
                      : signalY + 38
                  }
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="7"
                >
                  {signal.id
                    .replace("S_", "")
                    .replace(
                      "_UP",
                      ""
                    )
                    .replace(
                      "_DOWN",
                      ""
                    )}
                </text>
              </g>
            );
          })}

          {/* ================================= */}
          {/* TRAINS                            */}
          {/* ================================= */}

          {trains.map((train) => {
            const trainX =
              getX(train.position);

            const trackY =
              getTrackY(
                train.trackId
              );

            const trainY =
              train.direction ===
              "TO_BAKHTIYARPUR"
                ? trackY - 7
                : trackY + 7;

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

                {/* Train */}

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

          {/* ================================= */}
          {/* LEGEND                            */}
          {/* ================================= */}

          <text
            x="100"
            y="350"
            fill="#64748b"
            fontSize="11"
          >
            TRACKS
          </text>

          <text
            x="100"
            y="372"
            fill="#94a3b8"
            fontSize="10"
          >
            T1 · Track 1
          </text>

          <text
            x="220"
            y="372"
            fill="#94a3b8"
            fontSize="10"
          >
            T2 · Track 2
          </text>

          <circle
            cx="105"
            cy="397"
            r="5"
            fill="#22c55e"
          />

          <text
            x="118"
            y="400"
            fill="#64748b"
            fontSize="10"
          >
            Green signal
          </text>

          <circle
            cx="225"
            cy="397"
            r="5"
            fill="#ef4444"
          />

          <text
            x="238"
            y="400"
            fill="#64748b"
            fontSize="10"
          >
            Red signal
          </text>
        </svg>
      </div>
    </section>
  );
}
