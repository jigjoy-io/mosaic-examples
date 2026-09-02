import {
	FunctionCallOutputItem,
	SituationContext,
	SituationHandler,
	SituationProcessor,
	SituationSpecification,
} from "@mozaik-ai/core"

export class FunctionCallCompletedSpecification extends SituationSpecification {
	isSatisfiedBy(context: SituationContext): boolean {
		return context.event.type === "function_call.completed"
	}
}

export class FunctionCallCompletedRenderer implements SituationProcessor {
	apply(context: SituationContext): void {
		const output = context.event.payload as FunctionCallOutputItem

		console.log("Tool result:", output.output.text)
	}
}

export const functionCallCompletedHandler: SituationHandler = {
	specification: new FunctionCallCompletedSpecification(),
	processor: new FunctionCallCompletedRenderer(),
}
