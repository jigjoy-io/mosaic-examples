# Project Purpose

## Overview

This repository is a small TypeScript example of a **terminal-capable AI agent** built on top of `@mozaik-ai/core`. Its purpose is to demonstrate how to give an agent access to a real shell-command tool, let it inspect and manipulate a local working directory, and drive the interaction through Mozaik's event-based runtime.

At a high level, the project shows how to build an agent that can:

- receive a natural-language instruction,
- decide to call a tool,
- run a shell command in a chosen directory,
- capture `stdout`, `stderr`, and the exit code,
- feed the tool result back into the agent loop, and
- produce a final response based on what it learned from the terminal.

This is not a full end-user application with a UI or a production sandbox. It is a compact reference implementation intended to show the core mechanics of **tool-using, terminal-enabled agents**.

## What the Project Is For

The main purpose of the project is to provide a clear example of **action-oriented agent design** rather than chat-only AI behavior.

Instead of limiting the model to text generation, the code gives the agent one concrete capability: `run_command`. That tool lets the model interact with the operating system through the terminal, which makes the agent useful for tasks such as:

- inspecting a repository,
- reading files,
- listing directories,
- running local scripts,
- gathering information before answering,
- and making file changes as part of a task.

The sample flow in `src/main.ts` is intentionally simple and self-demonstrating: the runtime sends the agent a request to analyze the current directory and write a description of the project into `purpose.md`. That means the repository is both the example system and the target of the agent's work.

## Core Idea

The project demonstrates a minimal version of an **LLM + tools + runtime loop**:

1. A user message enters the runtime.
2. The agent receives the event.
3. The agent invokes a model with tool definitions attached.
4. The model may choose to call `run_command`.
5. The tool executes a real shell command.
6. The result is returned in structured form.
7. The runtime continues the loop until the model has enough information to answer.

That makes this repository useful as a learning example for anyone building AI agents that need to do real work in a local environment.

## Architecture Summary

The codebase is small, but it has a clear separation of responsibilities.

### `src/main.ts`
This is the runtime entry point.

It:
- loads environment variables with `dotenv/config`,
- initializes the Mozaik runtime with an `EnvironmentState`,
- joins a human participant and the terminal agent to the runtime,
- sends an initial user message requesting repository analysis.

This file effectively acts as the demo launcher for the whole system.

### `src/agent.ts`
This file defines the AI agent and its event-driven behavior.

Important responsibilities in this file:
- defining a `SituationSpecification` that reacts to `message.sent` events,
- defining an `InferenceProcessor` that turns a runtime event into a model inference request,
- constructing an `InferenceInput` with:
  - a model name,
  - reasoning effort,
  - memory context,
  - available tools,
- calling `runLoop(...)` to let the agent reason and use tools,
- creating the agent with a built-in instruction that explicitly tells it to behave like a terminal agent and avoid asking the user questions.

This file is the center of the project's agent behavior. It shows how a participant in the runtime becomes a model-powered actor with tools.

### `src/tools.ts`
This file exposes terminal access as a Mozaik tool.

It defines a single tool:
- `run_command`

The tool:
- has a strict schema,
- requires `command` and `cwd`,
- logs what is being run,
- delegates execution to the `Terminal` class,
- returns a structured command result.

This is the project's key integration point between the model layer and the local machine.

### `src/terminal.ts`
This file implements the real terminal execution layer.

The `Terminal` class:
- accepts a shell command and working directory,
- spawns a child process using Node's `child_process.spawn`,
- runs with `shell: true`,
- captures standard output and standard error incrementally,
- listens for process-level errors,
- resolves to a normalized `CommandResult` object when the process ends.

This class is intentionally simple. Its purpose is to turn arbitrary shell execution into a predictable, tool-friendly API.

### `src/command-result.ts`
This file defines the `CommandResult` interface:

- `success`
- `stdout`
- `stderr`
- `exitCode`

Its role is small but important: it standardizes tool output so the rest of the agent system can rely on a consistent result shape.

### `src/runtime.ts`
This file wraps Mozaik runtime creation.

It defines:
- `EnvironmentState`, extending `RuntimeState`,
- runtime helpers returned by `defineRuntime`, including:
  - `initializeRuntime`
  - `resolveRuntime`
  - `resolveParticipant`
  - `join`
  - `leave`
  - `sendMessage`
  - `sendEvent`
  - `runLoop`

Its purpose is to centralize runtime setup and re-export the runtime operations used by the rest of the project.

### `src/user.ts`
This file defines the human-side participant used in the demo.

Rather than being an interactive CLI, this “user” is another runtime participant that listens to agent-related events and prints them to the console.

It reacts to:
- `function_call.started`
- `function_call.completed`
- `model.answer`

Its processors log:
- which tool was called,
- the tool result,
- the final model answer.

This helps make the runtime behavior observable when the example runs.

## Runtime Model

A major purpose of the repository is to illustrate that the agent is not just a function call to an LLM. It is part of an **event-driven runtime**.

The flow is roughly:

1. The application initializes a shared runtime.
2. Participants join the runtime.
3. A user message is emitted.
4. The agent receives the message because its situation specification matches the event.
5. The agent assembles inference input and calls the Mozaik loop.
6. If the model chooses a tool, the runtime executes it.
7. The tool output is fed back into the loop.
8. The model eventually produces a final answer.
9. The user participant prints the intermediate and final events.

This design makes the project a useful example of **message-driven orchestration** for AI agents.

## Technology Stack

The project uses:

- **TypeScript** for implementation,
- **Node.js** as the runtime environment,
- **ES modules** (`"type": "module"`),
- **`@mozaik-ai/core`** for agent, runtime, memory, tool, and loop primitives,
- **`dotenv`** for environment configuration,
- **`tsx`** to run TypeScript directly during development.

The TypeScript configuration is modern and strict:
- target: `ES2022`
- module: `ESNext`
- strict type checking
- no emit in the current TS config

## Development and Execution Style

The project is meant to be run locally with:

- `npm install`
- `npm start`

The `start` script runs `tsx src/main.ts`.

That means this repository is primarily a **development/demo project** rather than a compiled distributable service. It is optimized for clarity and fast iteration.

## Design Characteristics

This repository is notable for being:

### Minimal
It contains only a handful of source files, each with a focused job. That keeps the architecture easy to follow.

### Practical
The agent does not call fake tools or mocks. It runs real terminal commands and returns real command output.

### Extensible
Although it currently exposes only one tool, the pattern is easy to extend with additional tools for file editing, HTTP requests, search, or other automation tasks.

### Explicitly agentic
The project is designed around a loop where the model can act, observe results, and continue reasoning. That is the core pattern behind more capable autonomous or semi-autonomous agents.

## Safety and Risk Considerations

The project is intentionally powerful, so its purpose must be understood alongside its risks.

### Arbitrary shell execution
The `run_command` tool allows execution of arbitrary commands in a specified working directory. This is useful for automation but dangerous in untrusted environments.

### Shell mode enabled
Because `spawn` is used with `shell: true`, the implementation favors flexibility and convenience over strict command isolation.

### No built-in sandboxing
There is no evidence in this codebase of:
- command allowlisting,
- filesystem permission controls,
- network restrictions,
- path confinement,
- approval workflows.

So the project should be understood as a prototype or example, not a hardened secure agent runner.

## Documentation Notes

One useful observation from analyzing the repository is that the `README.md` appears slightly out of sync with the current source layout. For example, it references `src/index.ts`, while the actual entry point in this directory is `src/main.ts`. The source files themselves are the more accurate guide to the current implementation.

## Overall Purpose Summary

In summary, this project exists to demonstrate how to build a **terminal-enabled AI agent** with Mozaik's core abstractions.

Its real purpose is to serve as a compact reference for:
- event-driven agent orchestration,
- tool registration,
- shell-command execution,
- structured tool outputs,
- and iterative model/tool/model workflows.

If you want to understand how an LLM can be wired into a local runtime and given real operational abilities through a terminal tool, this repository is a concise and practical example of that pattern.
