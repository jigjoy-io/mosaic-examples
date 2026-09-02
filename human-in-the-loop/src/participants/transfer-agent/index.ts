import { createAgent } from "@mozaik-ai/core"
import { transactionsReadyHandler } from "./situations/transactions-ready"
import { transferFunds } from "./tools"

const agent = createAgent({
	name: "Transfer Agent",
	capabilities: [],
	instruction:
		"You are a treasury assistant. When given a list of transfers, always call transfer_funds once per payment. Never invent a transfer result.",
	tools: [transferFunds],
	handlers: [transactionsReadyHandler],
})

export { agent }
