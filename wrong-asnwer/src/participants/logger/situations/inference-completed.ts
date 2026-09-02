import {
	InferenceOutput,
	ReasoningItem,
	SituationContext,
	SituationHandler,
	SituationProcessor,
	SituationSpecification,
} from "@mozaik-ai/core"

export class InferenceCompletedSpecification extends SituationSpecification {
	isSatisfiedBy(context: SituationContext): boolean {
		return context.event.type === "inference.completed"
	}
}

export class ReasoningRenderer implements SituationProcessor {
	apply(context: SituationContext): void {
		const output = context.event.payload as InferenceOutput
		const reasoningItems = output.items.filter((item): item is ReasoningItem => item.type === "reasoning")

		for (const item of reasoningItems) {
			console.log("[reasoning]", item.summary.map((summary) => summary.text).join("\n"))
		}
	}
}

export const inferenceCompletedHandler: SituationHandler = {
	specification: new InferenceCompletedSpecification(),
	processor: new ReasoningRenderer(),
}
