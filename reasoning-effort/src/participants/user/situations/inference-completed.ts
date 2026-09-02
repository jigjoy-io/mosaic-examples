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

		console.log(`Received ${reasoningItems.length} reasoning item(s).`)

		for (const item of reasoningItems) {
			for (const summary of item.summary) {
				console.log("Reasoning summary:", summary.text)
			}
		}
	}
}

export const inferenceCompletedHandler: SituationHandler = {
	specification: new InferenceCompletedSpecification(),
	processor: new ReasoningRenderer(),
}
