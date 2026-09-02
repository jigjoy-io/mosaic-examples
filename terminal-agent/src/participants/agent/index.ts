import { createAgent } from "@mozaik-ai/core"
import { messageSentHandler } from "./situations/message-sent"
import { terminalTools } from "./tools"

export const agent = createAgent({
	name: "Terminal Agent",
	capabilities: [],
	instruction: `You are a terminal agent.

You can run commands in the terminal to help the user with their request.
Do not ask any questions to the user. Just run the commands and return the result.

Tools:
- run_command: Run a command in the terminal. You can use this tool to run any command in the terminal.`,
	tools: terminalTools,
	handlers: [messageSentHandler],
})
