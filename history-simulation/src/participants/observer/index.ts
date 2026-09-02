import { createHuman } from "@mozaik-ai/core"
import { messageSentHandler } from "./situations/message-sent"

export const narrator = createHuman({
	name: "Narrator",
	capabilities: [],
	handlers: [],
})

export const observer = createHuman({
	name: "Transcript Observer",
	capabilities: [],
	handlers: [messageSentHandler],
})
