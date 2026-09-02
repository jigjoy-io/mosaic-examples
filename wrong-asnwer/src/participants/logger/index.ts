import { createHuman } from "@mozaik-ai/core"
import { messageSentHandler } from "./situations/message-sent"
import { functionCallStartedHandler } from "./situations/function-call-started"
import { functionCallCompletedHandler } from "./situations/function-call-completed"
import { inferenceCompletedHandler } from "./situations/inference-completed"
import { modelAnswerHandler } from "./situations/model-answer"

export const logger = createHuman({
	name: "Transcript Logger",
	capabilities: [],
	handlers: [
		messageSentHandler,
		functionCallStartedHandler,
		functionCallCompletedHandler,
		inferenceCompletedHandler,
		modelAnswerHandler,
	],
})
