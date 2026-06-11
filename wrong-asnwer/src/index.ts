import {
	AgenticEnvironment,
	BaseParticipant,
	ModelContext,
	sendMessage
} from "@mozaik-ai/core"
import { capitalOfFranceTool } from "./capital-of-france-tool"
import { ReactiveAgent } from "./reactive-agent"
import { TranscriptLogger } from "./transcript-logger"
import "dotenv/config"

const context = ModelContext.create("pr-1")

const environment = new AgenticEnvironment()
const lotus = new ReactiveAgent(environment, context, capitalOfFranceTool)
const logger = new TranscriptLogger()
const human = new BaseParticipant()

lotus.join(environment)
logger.join(environment)
human.join(environment)

sendMessage(environment, "What is the capital of France?", human)
