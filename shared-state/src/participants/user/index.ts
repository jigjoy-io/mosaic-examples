import { createHuman } from "@mozaik-ai/core"
import { modelAnswerHandler } from "./situations/model-answer"

const user = createHuman({
	name: "Miodrag",
	capabilities: ["make_investment_decision"],
	handlers: [modelAnswerHandler],
})

export { user }
