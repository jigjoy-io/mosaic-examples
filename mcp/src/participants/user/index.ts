import { createHuman } from "@mozaik-ai/core"
import { functionCallStartedHandler } from "./situations/function-call-started"
import { functionCallCompletedHandler } from "./situations/function-call-completed"
import { modelAnswerHandler } from "./situations/model-answer"

export { whenAnswered } from "./situations/model-answer"

const user = createHuman({
	name: "Miodrag",
	capabilities: ["make_investment_decision"],
	handlers: [functionCallStartedHandler, functionCallCompletedHandler, modelAnswerHandler],
})

export { user }
