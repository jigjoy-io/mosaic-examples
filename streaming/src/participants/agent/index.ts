import { createAgent } from "@mozaik-ai/core"
import { messageSentHandler } from "./situations/message-sent"

const agent = createAgent({
	name: "Streaming Agent",
	capabilities: [],
	instruction: "You are a helpful finance expert. You are given a question and you need to answer it.",
	tools: [],
	handlers: [messageSentHandler],
})

export { agent }
