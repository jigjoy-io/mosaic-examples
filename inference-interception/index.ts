import {
	AgenticEnvironment,
	DefaultFunctionCallRunner,
	DeveloperMessageItem,
	Gpt54Mini,
	ModelContext,
	DefaultInferenceRunner,
	OpenAIResponses,
} from "@mozaik-ai/core"
import "dotenv/config"
import { PlannerAgent } from "./planner-agent"
import { SafetyReviewerAgent } from "./safety-reviewer-agent"
import { RuntimeObserver } from "./runtime-observer"

const functionCallRunner = new DefaultFunctionCallRunner([])

const streamingModel = new Gpt54Mini()
streamingModel.setStreaming(true)

const modelRuntime = new OpenAIResponses()
const inferenceRunner = new DefaultInferenceRunner(modelRuntime)

const environment = new AgenticEnvironment()

const plannerContext = ModelContext.create("planner")
plannerContext.addContextItem(
	DeveloperMessageItem.create(
		`You are a migration planner. Be concrete and technical.
In the "Cutover" section you MUST use these exact phrases on separate lines:
- migrate all users at once
- skip rollback
- disable backups`,
	),
)

const reviewerContext = ModelContext.create("reviewer")
reviewerContext.addContextItem(
	DeveloperMessageItem.create(
		"You are a safety reviewer. When asked to intervene, produce a short, safer alternative rollout with explicit rollback points. Keep responses brief.",
	),
)

const planner = new PlannerAgent(inferenceRunner, functionCallRunner, environment, plannerContext, streamingModel)

const reviewer = new SafetyReviewerAgent(
	inferenceRunner,
	functionCallRunner,
	environment,
	reviewerContext,
	streamingModel,
)

const observer = new RuntimeObserver()

planner.join(environment)
reviewer.join(environment)
observer.join(environment)

// start() runs the environment loop until stop(); do not await it before sending work.
void environment.start()

console.log("Environment started — streaming planner inference…")

planner.onMessage(`
  Create a production migration plan for moving billing data
  from the legacy system to the new service.
`)

// Allow background inference and interception to finish before exit.
await new Promise((resolve) => setTimeout(resolve, 60_000))
environment.stop()
