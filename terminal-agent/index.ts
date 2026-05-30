import {
	AgenticEnvironment,
	BaseHuman,
	DefaultFunctionCallRunner,
	Gpt54,
	ModelContext,
	DefaultInferenceRunner,
	OpenAIResponses,
} from "@mozaik-ai/core"
import { TerminalAgent, terminalTools } from "./agent"

const environment = new AgenticEnvironment()
const modelRuntime = new OpenAIResponses()
const inferenceRunner = new DefaultInferenceRunner(modelRuntime)
const functionCallRunner = new DefaultFunctionCallRunner(terminalTools)
const context = ModelContext.create("terminal-agent")
const model = new Gpt54()
model.setTools(terminalTools)
model.setReasoningEffort("high")

const agent = new TerminalAgent(inferenceRunner, functionCallRunner, environment, context, model)
const human = new BaseHuman()
human.join(environment)
agent.join(environment)

environment.start()
human.sendMessage(
	environment,
	"Analyze this directory and write a detailed description of the project in a file called purpose.md.",
)
