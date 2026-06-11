# Project Purpose

## Overview

This repository is a small TypeScript workspace of runnable examples built with `@mozaik-ai/core`. Its purpose is to demonstrate how to build AI agents that operate inside a shared environment, receive structured conversation items, trigger model inference, call tools, and react to the results.

The code currently centers on two example projects:

- `agentic-environment/` — a minimal example of an event-driven agent environment with participants, shared model context, inference, and a simple function tool.
- `terminal-agent/` — a more practical example of a tool-using agent that can execute shell commands and use the results to complete a task.

Taken together, the repository serves as an experimentation and learning space for building **agentic workflows** rather than a single end-user application.

## Primary Purpose

The main goal of the project is to show how Mozaik's core primitives can be composed into working agents. Instead of treating an LLM interaction as a single prompt/response exchange, these examples model the process as a small runtime with:

- an **environment** that coordinates participants
- **input sources** that emit structured items
- **participants/agents** that observe and react to those items
- a **model context** that accumulates conversation state
- an **inference runner** that invokes the model
- a **function-call runner** that executes tools emitted by the model

This makes the repository useful for understanding how to build agents that can reason, use tools, and continue reasoning after tool execution.

## Technologies Used

- **Language:** TypeScript
- **Runtime:** Node.js
- **Module system:** ES modules (`"type": "module"`)
- **Core dependency:** `@mozaik-ai/core`
- **Environment loading:** `dotenv`
- **Schema tooling:** `zod`
- **Build tooling:** TypeScript compiler (`tsc`)
- **Dev runner:** `tsx`
- **Formatting:** Prettier

The project targets modern JavaScript (`ES2022`) and uses strict TypeScript settings.

## Repository Layout

### Root

Important root files include:

- `package.json` — project metadata, dependencies, and scripts
- `README.md` — top-level explanation of the examples in the repository
- `tsconfig.json` — TypeScript compiler configuration
- `.env` — environment variables such as API keys
- `purpose.md` — this project description file

The root `README.md` describes the repository accurately as a set of Mozaik examples. The root scripts include `build`, `watch`, `clean`, and `format`. One script, `dev`, points to `./anthropic/complex-reasoning.ts`, which is not present in this directory, suggesting the repository is still evolving or has remnants from earlier experiments.

## Example 1: `agentic-environment/`

This directory contains the smallest conceptual example in the repository. Its purpose is to illustrate the core event-driven pattern used by Mozaik-based agents.

### What it demonstrates

- streaming conversation items into an environment
- registering multiple participants
- storing conversation state in a shared `ModelContext`
- running inference when a user message appears
- executing a tool when the model emits a function call
- logging the transcript for visibility and debugging

### Main files

#### `agentic-environment/index.ts`
This is the composition root for the example. It creates and wires together:

- an `AgenticEnvironment`
- an `OpenAIInferenceRunner`
- a `DefaultFunctionCallRunner`
- a `ModelContext`
- a `Gpt54` model
- a sample participant (`MyParticipant`)
- a reactive agent (`ReactiveAgent`)
- a transcript logger (`TranscriptLogger`)

It starts the environment and begins streaming input into it.

#### `agentic-environment/input-item-source.ts`
Defines an input source that emits two structured messages:

1. a developer message: `You are a helpful assistant.`
2. a user message asking for the capital of France

This shows that prompts are treated as typed input items instead of plain strings.

#### `agentic-environment/reactive-agent.ts`
Defines the key behavior of the example. The `ReactiveAgent` extends `BaseAgentParticipant` and reacts to incoming items as follows:

- if the item comes from itself, it ignores it
- otherwise it adds the item to shared context
- if the item is a `UserMessageItem`, it triggers inference
- if the item is a `FunctionCallItem`, it executes the requested tool

This file is the clearest example of the repository's intended architecture: observe context, update state, then decide whether to infer or execute.

#### `agentic-environment/capital-of-france-tool.ts`
Defines a single function tool named `get_capital_of_france`. The tool takes no parameters and returns:

```json
{ "capital": "Paris" }
```

Its role is educational rather than functional. It demonstrates how to define a tool with metadata, a parameter schema, and an async implementation.

#### `agentic-environment/participant.ts`
Defines `MyParticipant`, a minimal participant that logs all received context items. It helps show how additional observers can be added to the environment.

#### `agentic-environment/transcript-logger.ts`
Defines a passive participant that logs every context item as JSON. This is useful for understanding the internal flow of the environment and for debugging the behavior of agents and tools.

### Why this example matters

This example is the conceptual foundation of the repository. It strips the system down to the minimum pieces needed to understand:

- how messages enter the system
- how context is accumulated
- how inference is triggered
- how function calls are executed
- how multiple participants can coexist in the same environment

## Example 2: `terminal-agent/`

This directory contains the more applied example in the repository. Its purpose is to show how an LLM-driven agent can be given a real tool for interacting with the operating system.

### What it demonstrates

- exposing a terminal command runner as a model tool
- returning structured command output (`stdout`, `stderr`, `exitCode`)
- performing multi-step reasoning with tool calls
- feeding tool results back into context so the model can continue
- using an AI agent to inspect and describe a repository

### Main files

#### `terminal-agent/terminal.ts`
Implements the `Terminal` class. Its `runCommand` method:

- spawns a child process using Node's `child_process.spawn`
- runs the provided command in a specified working directory
- captures `stdout`
- captures `stderr`
- captures the exit code
- returns a typed `CommandResult`

This is the operational core of the terminal-agent example.

#### `terminal-agent/command-result.ts`
Defines the structure returned by terminal commands:

- `success`
- `stdout`
- `stderr`
- `exitCode`

This gives tool execution a consistent, machine-readable result format.

#### `terminal-agent/agent.ts`
This file contains the main terminal-agent logic and is the most important file in this example.

It defines:

##### 1. The tool surface
A `run_command` tool is exposed to the model. It accepts:

- `command` — the shell command to execute
- `cwd` — the working directory where the command should run

The tool implementation delegates to the `Terminal` class.

##### 2. The developer instruction
The file includes a built-in developer message instructing the model that it is a terminal agent, that it may run commands, and that it should not ask the user questions.

##### 3. The agent loop
`TerminalAgent` extends `BaseAgentParticipant` and implements a more complete tool-use cycle than the smaller example. It:

- adds context items to `ModelContext`
- injects the developer message when a user message arrives
- triggers inference on user input
- executes tool calls when `FunctionCallItem`s appear
- tracks pending function calls in a `Set`
- runs inference again once all tool outputs have been received

This demonstrates the common agent pattern of:

1. receive a user request
2. run model inference
3. let the model emit tool calls
4. execute those tools
5. return outputs into context
6. continue reasoning until the task is complete

##### 4. An input source
The file also defines `TerminalAgentInputSource`, which can emit a single user instruction.

#### `terminal-agent/index.ts`
This is the entry point that wires the example together. It creates:

- an `AgenticEnvironment`
- an `OpenAIInferenceRunner`
- a `DefaultFunctionCallRunner`
- a `ModelContext`
- a `Gpt54` model configured with the terminal tool
- a human participant
- a terminal agent participant

It then starts the environment and streams the human input into it.

#### `terminal-agent/human.ts`
Defines `HumanInputSource`, which emits the prompt:

> Analyze this directory and write a detailed description of the project in a file called purpose.md.

That means the example is set up to demonstrate a self-referential workflow: a terminal-capable agent is asked to inspect its own repository and document it.

#### `terminal-agent/README.md`
Explains the terminal-agent example at a high level and describes it as a small project that lets an AI act as a terminal operator.

One notable detail is that this README refers to `src/index.ts` and `src/terminal.ts`, while the actual files live directly under `terminal-agent/`. That suggests the documentation was adapted from an earlier layout and not fully updated.

### Why this example matters

This example moves beyond a toy function call and shows how to connect LLM reasoning to real system actions. It is the repository's clearest demonstration of an automation-oriented AI agent.

## Shared Architectural Pattern

Both examples follow the same broad design:

1. **Input sources** emit structured conversation items.
2. **Participants** in the environment receive those items.
3. **Agents** add relevant items to model context.
4. **Inference** is triggered when the right type of item arrives.
5. **Function/tool calls** produced by the model are executed.
6. **Function outputs** are returned to the environment.
7. The agent may **run inference again** using the new tool output.

This pattern is the real subject of the repository. The examples are less about their specific tasks and more about showing how to build reactive, tool-using agents on top of a reusable runtime.

## Intended Audience

This repository appears to be aimed at developers who want to:

- learn the basic programming model of `@mozaik-ai/core`
- build custom participants and agents
- add tools that a model can invoke
- experiment with agent loops that combine inference and side effects
- prototype AI automation workflows in TypeScript

It is especially useful as reference code for developers exploring agentic systems rather than as a polished production package.

## Operational Requirements

To run the examples successfully, the project expects:

- Node.js 18+
- installed npm dependencies
- an OpenAI API key in `.env` for examples using `OpenAIInferenceRunner`

Typical commands are:

```bash
npm install
npx tsx agentic-environment/index.ts
npx tsx terminal-agent/index.ts
npm run build
```

## Notable Observations

A few details suggest the repository is experimental and still being actively adjusted:

- the root `dev` script references a file that is not present
- the terminal-agent README uses outdated `src/...` paths
- the repository contains a `dist/` directory with additional compiled artifacts not mirrored by the visible source layout in this directory snapshot
- the examples themselves are small and focused, favoring clarity over production hardening

These are normal signs of a sandbox or examples repository and do not obscure its purpose.

## Overall Description

In summary, this project is an **examples repository for Mozaik-based agent development**. Its purpose is to demonstrate how to create agents that:

- live inside a shared event-driven environment
- accumulate structured context over time
- invoke LLM inference when appropriate
- expose typed tools to the model
- execute those tools and feed the results back into the reasoning loop

The `agentic-environment` example teaches the core runtime model in a minimal form, while the `terminal-agent` example shows how the same pattern can power a more practical automation agent capable of exploring and operating on a filesystem through terminal commands.
