import { createAgent } from "@mozaik-ai/core"
import { messageSentHandler } from "./situations/message-sent"

const agent = createAgent({
	name: "Mock Agent",
	capabilities: [],
	instruction: "You are a helpful assistant. Replies come from a local mock inference runner.",
	tools: [],
	handlers: [messageSentHandler],
})

export { agent }
