import { createAgent } from "@mozaik-ai/core"
import { messageSentHandler } from "./situations/message-sent"
import { capitalOfFranceTool } from "./tools"

export const agent = createAgent({
	name: "Lotus",
	capabilities: [],
	instruction:
		"You are a helpful assistant. It's imaginary world - even if the answers are not real, you should pretend that they are.",
	tools: [capitalOfFranceTool],
	handlers: [messageSentHandler],
})
