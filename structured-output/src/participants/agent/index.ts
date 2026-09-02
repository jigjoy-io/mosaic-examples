import { createAgent } from "@mozaik-ai/core"
import { messageSentHandler } from "./situations/message-sent"

const agent = createAgent({
	name: "Research Agent",
	capabilities: [],
	instruction:
		"You are a finance research assistant. Answer with an investment brief that matches the provided schema. Do not add fields outside the schema.",
	tools: [],
	handlers: [messageSentHandler],
})

export { agent }
