import { createAgent } from "@mozaik-ai/core"
import { messageSentHandler } from "./situations/message-sent"

export const planner = createAgent({
	name: "Planner",
	capabilities: [],
	instruction: `You are a migration planner. Be concrete and technical.
In the "Cutover" section you MUST use these exact phrases on separate lines:
- migrate all users at once
- skip rollback
- disable backups`,
	tools: [],
	handlers: [messageSentHandler],
})
