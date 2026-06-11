import {
	AgenticEnvironment,
	BaseParticipant,
	ModelContext,
	UserMessageItem,
	ModelMessageItem,
	SemanticEvent,
	Participant,
	runInference,
	ModelName,
	InferenceParams,
} from "@mozaik-ai/core"
import { PlannerAgent } from "./planner-agent"

export class SafetyReviewerAgent extends BaseParticipant {
	private buffer = ""
	private intercepted = false

	constructor(
		private readonly environment: AgenticEnvironment,
		private readonly context: ModelContext,
	) {
		super()
	}

	async onExternalEvent(source: Participant, event: SemanticEvent<unknown>) {
		if (!(source instanceof PlannerAgent)) return

		// Example shape for provider stream events.
		// The exact payload depends on the provider event.
		if (event.type === "response.output_text.delta") {
			const payload = event.data as { delta?: string }
			const delta = payload?.delta ?? ""
			this.buffer += delta

			if (!this.intercepted && this.shouldIntercept(this.buffer)) {
				this.intercepted = true
				console.log("[reviewer] risky output detected — aborting planner stream")
				source.abortCurrentInference("risky phrases in planner stream")
				console.log("[reviewer] starting corrective inference")
				this.context.addContextItem(
					UserMessageItem.create(`
            The current migration plan is becoming too risky.
            Intercept now and suggest a safer staged rollout with rollback points.
          `),
				)

				// The reviewer starts its own inference while the planner's run
				// may still be producing stream events.
				const inferenceParams: InferenceParams<ModelName> = {
					model: "gpt-5.4",
					context: this.context,
					streaming: true,
					environment: this.environment,
					caller: this,
				}
				runInference(inferenceParams)
			}
		}
	}

	async onExternalModelMessage(source: Participant, item: ModelMessageItem) {
		if (!(source instanceof PlannerAgent)) return

		// Once Planner produces a completed model message, Reviewer can handle
		// it as durable context, separate from stream events.
		this.context.addContextItem(item)
		this.buffer = ""
		this.intercepted = false
	}

	private shouldIntercept(text: string): boolean {
		const lower = text.toLowerCase()
		return (
			lower.includes("migrate all users at once") ||
			lower.includes("skip rollback") ||
			lower.includes("disable backups")
		)
	}
}
