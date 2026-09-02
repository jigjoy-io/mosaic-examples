import { createAgent, Tool } from "@mozaik-ai/core"
import { messageSentHandler } from "./situations/message-sent"

export function createMcpAgent(tools: Tool[]) {
	return createAgent({
		name: "MCP Market Agent",
		capabilities: [],
		instruction:
			"You are a market assistant. When the user asks for a stock price, always call get_stock_quote. Never invent prices.",
		tools,
		handlers: [messageSentHandler],
	})
}
