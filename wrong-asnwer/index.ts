import {
	AgenticEnvironment,
	Gpt54,
	ModelContext,
	DefaultInferenceRunner,
	DefaultFunctionCallRunner,
	BaseHuman,
	OpenAIResponses,
} from "@mozaik-ai/core"
import { capitalOfFranceTool } from "./capital-of-france-tool"
import { ReactiveAgent } from "./reactive-agent"
import { TranscriptLogger } from "./transcript-logger"
import "dotenv/config"

const functionCallRunner = new DefaultFunctionCallRunner([capitalOfFranceTool])
const modelRuntime = new OpenAIResponses()
const inferenceRunner = new DefaultInferenceRunner(modelRuntime)

const context = ModelContext.create("pr-1")
const model = new Gpt54()
model.setTools([capitalOfFranceTool])

const environment = new AgenticEnvironment()
const lotus = new ReactiveAgent(inferenceRunner, functionCallRunner, environment, context, model)
const logger = new TranscriptLogger()
const human = new BaseHuman()

environment.start()
lotus.join(environment)
logger.join(environment)
human.join(environment)

human.sendMessage(environment, "What is the capital of France?")
