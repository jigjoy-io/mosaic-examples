import { createHuman } from "@mozaik-ai/core"
import { inferenceStreamHandler } from "./situations/inference-stream"
import { modelAnswerHandler } from "./situations/model-answer"

const user = createHuman({
	name: "Miodrag",
	capabilities: ["make_investment_decision"],
	handlers: [inferenceStreamHandler, modelAnswerHandler],
})

export { user }
