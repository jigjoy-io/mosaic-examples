import { createAgent } from "@mozaik-ai/core"
import { messageSentHandler } from "./situations/message-sent"

const agent = createAgent({
	name: "Reasoning Agent",
	capabilities: [],
	instruction:
		"You are a finance analyst. Think carefully about capital-allocation trade-offs before answering. Show your conclusion clearly.",
	tools: [],
	handlers: [messageSentHandler],
})

export { agent }
