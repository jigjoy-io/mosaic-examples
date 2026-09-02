import { createHuman } from "@mozaik-ai/core"
import { inferenceStreamHandler } from "./situations/inference-stream"
import { interceptionEventHandler } from "./situations/interception-event"
import { modelAnswerHandler } from "./situations/model-answer"

export const observer = createHuman({
	name: "Runtime Observer",
	capabilities: [],
	handlers: [inferenceStreamHandler, modelAnswerHandler, interceptionEventHandler],
})
