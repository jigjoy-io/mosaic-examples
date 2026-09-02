import { createAgent } from "@mozaik-ai/core"
import { messageSentHandler } from "./situations/message-sent"
import { queueTransaction } from "./tools"

export const generator = createAgent({
	name: "Transaction Generator",
	capabilities: [],
	instruction:
		"You queue payment transactions. When asked to create transactions, always call queue_transaction once per payment. Never invent a queue result.",
	tools: [queueTransaction],
	handlers: [messageSentHandler],
})
