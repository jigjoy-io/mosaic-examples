import {
	AgenticEnvironment,
	ModelContext,
	UserMessageItem,
	ModelMessageItem,
	Participant,
	BaseParticipant,
	runInference,
} from "@mozaik-ai/core"

export class PlannerAgent extends BaseParticipant {
	private inferenceAbort?: AbortController

	constructor(
		private readonly environment: AgenticEnvironment,
		private readonly context: ModelContext,
	) {
		super()
	}

	/** Stops the in-flight planner stream; consumed by SafetyReviewerAgent on intercept. */
	abortCurrentInference(reason?: string) {
		if (!this.inferenceAbort) return
		console.log("[planner] aborting stream", reason ? `— ${reason}` : "")
		this.inferenceAbort.abort()
		this.inferenceAbort = undefined
	}

	private startInference() {
		this.inferenceAbort?.abort()
		this.inferenceAbort = new AbortController()
		// Pass signal through to InferenceRunner — streaming stops when aborted.
		
		const inferenceParams = {
			model: "gpt-5-4",
			context: this.context,
			streaming: true,
			environment: this.environment,
			caller: this,
			signal: this.inferenceAbort.signal,
		}
		runInference(inferenceParams)
	}

	async onMessage(message: string) {
		this.context.addContextItem(UserMessageItem.create(message))

		// Non-blocking inference.
		// While this is running, other participants can still receive events.
		this.startInference()
	}

	async onExternalModelMessage(source: Participant, item: ModelMessageItem) {
		// If another agent sends a completed correction or intervention,
		// Planner can incorporate it into its own context.
		this.context.addContextItem(item)

		// Optionally re-run with the new information.
		this.startInference()
	}

}
