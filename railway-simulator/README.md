🚆 India Railway Dynamic Track & Junction Congestion Simulator

An interactive railway traffic simulation system built to visualize how multiple trains move, interact, and create congestion on a shared railway corridor.

The project models a simplified railway section between Patna Jn and Bakhtiyarpur, with trains traveling in both directions at different speeds depending on their train category.

🎯 Objective

The goal is to create a visual and interactive environment where railway traffic can be stress-tested with increasing numbers of trains and different scheduling conditions.

The simulator will eventually compare two approaches:

Historical Mode — trains operate according to predefined timetable and conventional scheduling behavior.

Algorithmic Planning Mode — an intelligent scheduling system dynamically reacts to approaching conflicts, congestion, delays, and infrastructure constraints.

The system will measure and visualize metrics such as peak traffic density, bottleneck severity, average delay, throughput, train waiting time, and block occupancy.

🚉 Current MVP

The first version focuses on the fundamental simulation engine:

Patna Jn ↔ Bakhtiyarpur corridor

Multiple trains operating simultaneously

Bidirectional train movement

Independent train positions and states

Different speeds for Local, Express, Superfast, and Vande Bharat trains

Automatic station stopping

Continuous movement using browser animation

Start / Pause / Reset controls

Simulation speed controls (1× / 2× / 4×)

Live SVG-based railway visualization

Individual train information cards

The current implementation intentionally does not perform collision avoidance or intelligent scheduling. These will be added incrementally.

🧠 Planned Simulation Model

Future versions will introduce a more detailed railway infrastructure model:

Railway Corridor
│
├── Stations
├── Track Sections
├── Blocks
├── Signals
├── Junctions
├── Speed Restrictions
└── Passing/Crossover Sections


Congestion will be detected dynamically from the simulation rather than relying exclusively on predefined bottlenecks.

Potential interactions include:

Train → Train
Train → Occupied Block
Train → Junction
Train → Station


The simulator will predict conflicts and allow the scheduling system to slow, hold, release, or prioritize trains.

🛠️ Tech Stack

React.js — application and UI

TypeScript — simulation logic and type safety

Tailwind CSS — interface styling

SVG — dynamic railway and train visualization

Recharts — simulation analytics and performance charts

requestAnimationFrame — smooth real-time visualization

📁 Architecture

The project separates visualization from simulation logic:

src/
├── components/     # UI and visualization
├── simulation/     # Simulation engine
├── data/           # Train/infrastructure data
├── hooks/          # React simulation integration
└── types/          # TypeScript models


This separation allows the simulation engine to evolve independently from the user interface.

🚀 Development

Install dependencies:

npm install


Start the development server:

npm run dev


The project is intended to evolve from a simple multi-train animation into a dynamic railway traffic-control and congestion-analysis simulator.