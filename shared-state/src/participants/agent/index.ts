import { createAgent } from "@mozaik-ai/core"
import { messageSentHandler } from "./situations/message-sent"

const agent = createAgent({
	name: "Agent",
	capabilities: [],
	instruction: "You are a helpful assistant specilized solely for finance domain.",
	tools: [],
	handlers: [messageSentHandler],
})

export { agent }
