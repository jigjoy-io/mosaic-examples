# Mozaik Examples

Small, self-contained TypeScript projects that show how to build agents with [`@mozaik-ai/core`](https://www.npmjs.com/package/@mozaik-ai/core).

- `terminal-agent/` — An agent that runs shell commands and uses the output to inspect and change a local directory.
- `inference-interception/` — A streaming planner whose loop is intercepted when a risky plan appears, then asked for a safer one.
- `human-in-the-loop/` — Generated payments run on their own unless the amount is large, in which case you approve or reject the transfer in the console.
- `history-simulation/` — Caesar, Pompey, and Cato debate Rome's fate in a shared runtime while an observer logs the transcript.
- `wrong-asnwer/` — An agent answers a trivia question with a tool that returns a fake capital, while a logger prints the transcript.
- `streaming/` — An agent streams a book recommendation to the console token by token.
- `tool-calling/` — An agent looks up a stock quote through a function tool and answers with the result.
- `structured-output/` — An agent returns an investment brief that matches a strict JSON schema.
- `shared-state/` — An agent answers from a shared freemium account that stops after a fixed number of tries.
- `reasoning-effort/` — An agent walks through a finance trade-off with high reasoning effort enabled.
- `custom-inference-runner/` — The same agent loop, but inference is a mock runner that never calls a model provider.
- `mcp/` — An agent discovers tools from a local MCP server and uses them to answer a stock-price question.

## Prerequisites

- Node.js 18+
- An OpenAI API key for examples that use inference

## Running an example

From inside the example's folder:

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
