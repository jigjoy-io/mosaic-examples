import { AgenticEnvironment, DeveloperMessageItem, ModelContext } from "@mozaik-ai/core"
import "dotenv/config"
import { PlannerAgent } from "./planner-agent"
import { SafetyReviewerAgent } from "./safety-reviewer-agent"
import { RuntimeObserver } from "./runtime-observer"

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

const planner = new PlannerAgent(environment, plannerContext)

const reviewer = new SafetyReviewerAgent(environment, reviewerContext)

const observer = new RuntimeObserver()

planner.join(environment)
reviewer.join(environment)
observer.join(environment)

console.log("Environment started — streaming planner inference…")

planner.onMessage(`
  Create a production migration plan for moving billing data
  from the legacy system to the new service.
`)
