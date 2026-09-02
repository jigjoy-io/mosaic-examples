import { createHuman } from "@mozaik-ai/core"
import { inferenceCompletedHandler } from "./situations/inference-completed"
import { modelAnswerHandler } from "./situations/model-answer"

const user = createHuman({
	name: "Miodrag",
	capabilities: ["make_investment_decision"],
	handlers: [inferenceCompletedHandler, modelAnswerHandler],
})

export { user }
