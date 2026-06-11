import {
	AgenticEnvironment,
	BaseParticipant,
	ModelContext,
    sendMessage,
} from "@mozaik-ai/core"
import { TerminalAgent, terminalTools } from "./agent"

const environment = new AgenticEnvironment()
const context = ModelContext.create("terminal-agent")

const agent = new TerminalAgent(environment, context, terminalTools)
const human = new BaseParticipant()
human.join(environment)
agent.join(environment)

sendMessage(
	environment,
	"Analyze this directory and write a detailed description of the project in a file called purpose.md.",
    human,
)
