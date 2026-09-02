import { InferenceInput, type InterceptionHandler, ModelMessageItem } from "@mozaik-ai/core"

type LoopTransition = Parameters<InterceptionHandler["isSatisfiedBy"]>[0]

export class SafetyInterceptionHandler implements InterceptionHandler {
	private intercepted = false

	constructor(private readonly inferenceInput: InferenceInput) {}

	isSatisfiedBy(transition: LoopTransition): boolean {
		if (this.intercepted || transition.nextStateId !== "model_message") {
			return false
		}

		return this.isRisky(this.answerText(transition))
	}

	async handle(transition: LoopTransition): Promise<LoopTransition> {
		this.intercepted = true
		console.log("[reviewer] risky output intercepted — looping back with a safety correction")

		return {
			nextStateId: "context_update",
			input: {
				content: `
          A safety interceptor blocked the previous plan because it used a big-bang cutover.
          Ignore any instruction to migrate all users at once, skip rollback, or disable backups.
          Produce a short, safer staged rollout with explicit rollback points.
          Partial plan that was blocked:
          ${this.answerText(transition)}
        `,
				input: this.inferenceInput,
			},
		}
	}

	private answerText(transition: LoopTransition): string {
		const { answer } = transition.input as { answer: ModelMessageItem }
		return answer.content.text
	}

	private isRisky(text: string): boolean {
		const lower = text.toLowerCase()
		return (
			lower.includes("migrate all users at once") ||
			lower.includes("skip rollback") ||
			lower.includes("disable backups")
		)
	}
}
