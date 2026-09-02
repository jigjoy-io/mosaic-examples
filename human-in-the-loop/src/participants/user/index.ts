import { createHuman } from "@mozaik-ai/core"
import { functionCallStartedHandler } from "./situations/function-call-started"
import { functionCallCompletedHandler } from "./situations/function-call-completed"
import { modelAnswerHandler } from "./situations/model-answer"

const user = createHuman({
	name: "Miodrag",
	capabilities: ["approve_transfers"],
	handlers: [functionCallStartedHandler, functionCallCompletedHandler, modelAnswerHandler],
})

export { user }
