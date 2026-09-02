# Mozaik Examples

This repository contains small, runnable TypeScript examples built with [`@mozaik-ai/core`](https://www.npmjs.com/package/@mozaik-ai/core).

Each example is a **self-contained mini project** with its own `package.json` and `tsconfig.json`. Install and run them independently.

The examples:

- `terminal-agent/` — a terminal-capable agent that can run shell commands and use the results to complete tasks
- `inference-interception/` — streaming planner plus observer; an `InterceptionHandler` on `runLoop` blocks risky answers and requests a safer plan
- `human-in-the-loop/` — human approval gate for function calls; accept runs the tool, reject returns a `FunctionCallOutputItem` with the typed reason
- `history-simulation/` — multiple historical-figure agents debating in a shared environment with a transcript observer
- `wrong-asnwer/` — a reactive agent with a tool, logging the transcript while answering a simple question

## Prerequisites

- Node.js 18+
- An OpenAI API key for examples that use inference

## Running an example

Each example follows the same workflow. From inside the example's folder:

```bash
cd terminal-agent      # or any other example folder
npm install
```

Create a `.env` file in that same folder:

```bash
OPENAI_API_KEY=your_api_key_here
```

Then run it:

```bash
npm start
```

Each project also exposes:

```bash
npm run build   # compile TypeScript to ./dist
npm run watch   # compile in watch mode
npm run clean   # remove ./dist
```

## Repository structure

```text
.
├── terminal-agent/
│   ├── package.json
│   ├── tsconfig.json
│   └── ...
├── inference-interception/
│   ├── package.json
│   ├── tsconfig.json
│   └── ...
├── human-in-the-loop/
│   ├── package.json
│   ├── tsconfig.json
│   └── ...
├── history-simulation/
│   ├── package.json
│   ├── tsconfig.json
│   └── ...
├── wrong-asnwer/
│   ├── package.json
│   ├── tsconfig.json
│   └── ...
├── purpose.md
└── README.md
```

## Notes

- This repository is primarily an examples and experimentation workspace.
- Each example installs its own dependencies, so there is no shared root `package.json`.
- The terminal agent can run arbitrary shell commands, so use it carefully in trusted environments.
