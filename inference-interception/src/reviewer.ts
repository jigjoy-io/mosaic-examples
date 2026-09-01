import {
	Agent,
	createAgent,
	ModelMessageItem,
	SituationContext,
	SituationHandler,
	SituationProcessor,
	SituationSpecification,
	UserMessageItem,
} from "@mozaik-ai/core"
import { planner } from "./planner"
import { runLoop } from "./runtime"

type ResponsesStreamChunk = {
	type?: string
	delta?: string
}

export class PlannerStreamSpecification extends SituationSpecification {
	isSatisfiedBy(context: SituationContext): boolean {
		return context.event.type === "inference.stream" && context.event.producerId === planner.getId()
	}
}

export class InterceptProcessor implements SituationProcessor {
	private buffer = ""
	private intercepted = false

	apply(context: SituationContext): void {
		const chunk = context.event.payload as ResponsesStreamChunk

		if (chunk.type === "response.output_text.delta" && chunk.delta) {
			this.buffer += chunk.delta

			if (!this.intercepted && this.shouldIntercept(this.buffer)) {
				this.intercepted = true
				console.log("[reviewer] risky output detected — starting corrective inference")

				const reviewer = context.participant as Agent

				runLoop(
					reviewer.getId(),
					`
            The current migration plan is becoming too risky.
            Intercept now and suggest a safer staged rollout with rollback points.

            Partial planner output so far:
            ${this.buffer}
          `,
					{
						model: "gpt-5.4",
						streaming: true,
						context: reviewer.getMemory().getContext(),
						tools: reviewer.getTools(),
					},
				)
			}
		}
	}

	reset(): void {
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

export class PlannerAnsweredSpecification extends SituationSpecification {
	isSatisfiedBy(context: SituationContext): boolean {
		return context.event.type === "model.answer" && context.event.producerId === planner.getId()
	}
}

export class ResetAfterPlannerProcessor implements SituationProcessor {
	constructor(private readonly intercept: InterceptProcessor) {}

	apply(context: SituationContext): void {
		const reviewer = context.participant as Agent
		const { answer } = context.event.payload as { answer: ModelMessageItem }

		reviewer.getMemory().getContext().addItem(UserMessageItem.create(`Planner said: ${answer.content.text}`))
		this.intercept.reset()
	}
}

const interceptProcessor = new InterceptProcessor()

const streamHandler: SituationHandler = {
	specification: new PlannerStreamSpecification(),
	processor: interceptProcessor,
}

const plannerAnswerHandler: SituationHandler = {
	specification: new PlannerAnsweredSpecification(),
	processor: new ResetAfterPlannerProcessor(interceptProcessor),
}

export const reviewer = createAgent({
	name: "Safety Reviewer",
	capabilities: [],
	instruction:
		"You are a safety reviewer. When asked to intervene, produce a short, safer alternative rollout with explicit rollback points. Keep responses brief.",
	tools: [],
	handlers: [streamHandler, plannerAnswerHandler],
})
