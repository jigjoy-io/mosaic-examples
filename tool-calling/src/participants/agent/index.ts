import { createAgent } from "@mozaik-ai/core"
import { messageSentHandler } from "./situations/message-sent"
import { getStockQuote } from "./tools"

const agent = createAgent({
	name: "Market Agent",
	capabilities: [],
	instruction:
		"You are a market assistant. When the user asks for a stock price, always call get_stock_quote. Never invent prices.",
	tools: [getStockQuote],
	handlers: [messageSentHandler],
})

export { agent }
