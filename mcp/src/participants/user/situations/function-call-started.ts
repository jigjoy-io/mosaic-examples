import {
	FunctionCallItem,
	SituationContext,
	SituationHandler,
	SituationProcessor,
	SituationSpecification,
} from "@mozaik-ai/core"

export class FunctionCallStartedSpecification extends SituationSpecification {
	isSatisfiedBy(context: SituationContext): boolean {
		return context.event.type === "function_call.started"
	}
}

export class FunctionCallStartedRenderer implements SituationProcessor {
	apply(context: SituationContext): void {
		const { call } = context.event.payload as { call: FunctionCallItem }

		console.log("Tool call:", call.name, call.args)
	}
}

export const functionCallStartedHandler: SituationHandler = {
	specification: new FunctionCallStartedSpecification(),
	processor: new FunctionCallStartedRenderer(),
}
