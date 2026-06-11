# Project Purpose

## Overview

This project is a small TypeScript/Node.js example of a **terminal-capable AI agent** built with `@mozaik-ai/core`. Its purpose is to demonstrate how to connect a language model to a real executable tool—in this case, a shell command runner—so the agent can inspect a directory, run commands, collect structured results, and use those results to complete a task.

Rather than being a general-purpose application with a user interface, this repository is best understood as a focused example or prototype showing how to build an **agentic workflow** around:

- a message-driven environment,
- a model context that stores conversation state,
- a tool definition the model can call,
- tool execution against the local terminal, and
- a loop that continues reasoning after tool results are returned.

In practical terms, this project shows how an AI agent can behave like a lightweight terminal operator.

## Primary Goal

The main goal of the project is to provide a minimal but realistic pattern for building an AI agent that can:

1. receive a natural-language request,
2. decide which terminal commands to run,
3. execute those commands through a defined tool interface,
4. capture `stdout`, `stderr`, and exit codes in a structured way,
5. feed the results back into the model context, and
6. continue until the task is complete.

The example task embedded in the project is self-referential: the agent is asked to analyze the current directory and write a description of the project into `purpose.md`. That makes the repository both the subject of analysis and the execution environment.

## What the Project Demonstrates

This repository demonstrates several important agent-design ideas:

### 1. Tool-using AI agents
The model is not limited to producing text. It is given access to a `run_command` tool that lets it interact with the filesystem and shell.

### 2. Structured tool interfaces
The terminal capability is exposed as a typed function tool with a schema requiring:

- `command`: the shell command to run
- `cwd`: the working directory in which to run it

This makes tool use explicit, inspectable, and programmatic.

### 3. Message-driven orchestration
The project uses Mozaik primitives such as `AgenticEnvironment`, `ModelContext`, `BaseParticipant`, `runInference`, and `executeFunctionCall` to model the agent as a participant in an event-driven system.

### 4. Multi-step reasoning loop
The agent does not just call the model once. It supports a cycle of:

- user message,
- model inference,
- function call emission,
- tool execution,
- function output injection,
- another inference pass if more reasoning is needed.

### 5. Terminal automation with typed results
Commands are executed through Node's `child_process.spawn`, and the result is normalized into a reusable `CommandResult` shape.

## High-Level Architecture

The codebase is intentionally compact. Most of the important logic lives in four source files under `src/`.

### `src/index.ts`
This is the composition root and demo entry point.

It:
- creates an `AgenticEnvironment`,
- creates a shared `ModelContext`,
- instantiates the `TerminalAgent`,
- creates a simple human participant,
- joins both participants to the environment,
- sends an initial user message asking the agent to analyze the directory and write `purpose.md`.

This file shows how the example is intended to be run: as an autonomous interaction inside the Mozaik environment.

### `src/agent.ts`
This is the central file in the project.

It contains two major pieces:

#### The terminal tool definition
A tool named `run_command` is defined and exported. It is described to the model as a function that runs a terminal command. The tool schema requires `command` and `cwd`, and its implementation delegates actual execution to the `Terminal` class.

#### The `TerminalAgent` class
`TerminalAgent` extends `BaseParticipant` and implements the core agent loop.

Its behavior is roughly:
- on user message: add a developer instruction and the user message to the context, then trigger model inference;
- on function call: track the call, add it to context, find the matching tool, and execute it;
- on function call output: add the output to context, clear the pending call, and, once all pending calls are complete, trigger inference again.

This file is the clearest expression of the project's purpose: building a working AI agent that can reason, use tools, observe tool outputs, and continue reasoning.

### `src/terminal.ts`
This file implements the actual terminal integration.

The `Terminal` class exposes `runCommand(command, cwd, contextMessage?)`, which:
- starts a child process with `spawn`,
- executes using `shell: true`,
- collects standard output,
- collects standard error,
- listens for process errors,
- waits for process completion,
- returns a structured result indicating success and exit code.

This is the system boundary where model-directed actions become real operating-system commands.

### `src/command-result.ts`
This file defines the `CommandResult` interface:
- `success: boolean`
- `stdout: string`
- `stderr: string`
- `exitCode: number`

Its purpose is to make command execution results predictable and machine-readable.

## Developer Prompt Built Into the Agent

The agent includes an internal developer instruction telling the model:

- it is a terminal agent,
- it can run commands in the terminal,
- it should use those commands to help with the user's request,
- it should not ask the user questions,
- it should just run commands and return the result.

This is important because it shapes the model's behavior toward direct execution and reduces conversational hesitation. In other words, the repository is designed to showcase **action-oriented** agent behavior rather than chat-oriented interaction.

## Runtime Flow

When the project runs, the expected flow is:

1. `src/index.ts` sends a human request into the environment.
2. `TerminalAgent` receives the message.
3. The agent adds the developer instruction and user request to the `ModelContext`.
4. The agent calls `runInference(...)` with the configured model and available tools.
5. If the model emits a `FunctionCallItem`, the agent executes the named tool.
6. The `run_command` tool calls `Terminal.runCommand(...)`.
7. The terminal returns a `CommandResult` containing `stdout`, `stderr`, success state, and exit code.
8. That result is fed back into the environment as a `FunctionCallOutputItem`.
9. Once pending tool calls are resolved, the agent triggers another inference round.
10. The loop continues until the model produces a final response or finishes the task.

This makes the project a concrete example of a tool-augmented reasoning loop.

## Technology Stack

### Language and runtime
- **TypeScript**
- **Node.js**
- **ES modules** (`"type": "module"`)

### Core dependency
- **`@mozaik-ai/core`** — provides the agent environment, participants, model context, inference helpers, and tool-execution helpers.

### Supporting dependency
- **`dotenv`** — loads environment variables, likely for model/provider credentials.

### Development tools
- **`tsx`** — runs TypeScript entry points directly in development.
- **`typescript`** — compiles the project.
- **`rimraf`** — cleans build output.
- **`@types/node`** — Node.js type definitions.

## Scripts and Build Setup

The `package.json` scripts show that this is a simple runnable example:

- `npm start` — runs `tsx src/index.ts`
- `npm run build` — compiles with `tsc`
- `npm run watch` — watches with the TypeScript compiler
- `npm run clean` — removes `dist`

The TypeScript configuration targets modern JavaScript (`ES2022`) and uses strict type checking. Output is configured for `dist/`, although the project is small enough that development is likely intended to happen mainly through `tsx`.

## Intended Use Cases

This project appears intended for:

- experimenting with Mozaik agent primitives,
- learning how to wire an LLM to executable tools,
- building repository-inspection or automation agents,
- prototyping terminal-driven agent workflows,
- demonstrating tool invocation and result handling in a compact codebase.

It is especially useful as a teaching or reference project because the code is small, direct, and centered on one concrete capability.

## Strengths of the Design

Some notable strengths of this project:

- **Minimal surface area:** only a few source files are needed to demonstrate the full loop.
- **Clear separation of concerns:** agent orchestration, terminal execution, and result typing are split cleanly.
- **Practical example:** the tool does something real and useful instead of returning mock data.
- **Structured outputs:** command results are normalized instead of being loosely handled.
- **Reusable pattern:** the same architecture could be extended with more tools beyond terminal access.

## Important Caveats

The project is intentionally powerful, which also means it has important limitations and risks.

### Arbitrary command execution
The `run_command` tool can execute arbitrary shell commands in a provided working directory. That is useful for automation, but it also means the project should only be run in trusted or controlled environments.

### Shell execution details
The implementation uses `spawn(..., { shell: true })`, which increases flexibility but also increases the need for care around command construction and safety.

### Limited safety controls in this example
This repository is an example implementation, not a hardened sandbox. It does not appear to impose strict allowlists, path restrictions, or permission boundaries on terminal usage.

### Single-tool focus
The project is intentionally narrow. It focuses on terminal access rather than providing a broad tool ecosystem, persistence layer, user interface, or production guardrails.

## Overall Purpose Summary

In summary, this repository exists to show how to build a **terminal-enabled AI agent** with Mozaik core primitives. It is a concise example of an agent that can receive instructions, call a shell-command tool, observe structured outputs, and continue reasoning based on those outputs.

Its real value is as a reference architecture for **tool-augmented AI automation**: small enough to understand quickly, but complete enough to demonstrate the full loop from prompt to action to result-driven follow-up.
