import { createHuman } from "@mozaik-ai/core"
import { functionCallStartedHandler } from "./situations/function-call-started"
import { functionCallCompletedHandler } from "./situations/function-call-completed"
import { modelAnswerHandler } from "./situations/model-answer"

export const user = createHuman({
	name: "Operator",
	capabilities: [],
	handlers: [functionCallStartedHandler, functionCallCompletedHandler, modelAnswerHandler],
})
