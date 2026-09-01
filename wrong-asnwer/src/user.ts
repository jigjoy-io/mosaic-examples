import {
	SituationContext,
	SituationSpecification,
	SituationHandler,
	SituationProcessor,
	createHuman,
	FunctionCallItem,
	FunctionCallOutputItem,
	InferenceOutput,
	ModelMessageItem,
	ReasoningItem,
} from "@mozaik-ai/core"

export class MessageSentSpecification extends SituationSpecification {
	isSatisfiedBy(context: SituationContext): boolean {
		return context.event.type === "message.sent"
	}
}

export class MessageSentRenderer implements SituationProcessor {
	apply(context: SituationContext): void {
		const { message } = context.event.payload as { message: string }

		console.log("[message.sent]", message)
	}
}

export class FunctionCallStartedSpecification extends SituationSpecification {
	isSatisfiedBy(context: SituationContext): boolean {
		return context.event.type === "function_call.started"
	}
}

export class FunctionCallStartedRenderer implements SituationProcessor {
	apply(context: SituationContext): void {
		const { call } = context.event.payload as { call: FunctionCallItem }

		console.log("[function_call.started]", call.name, call.args)
	}
}

export class FunctionCallCompletedSpecification extends SituationSpecification {
	isSatisfiedBy(context: SituationContext): boolean {
		return context.event.type === "function_call.completed"
	}
}

export class FunctionCallCompletedRenderer implements SituationProcessor {
	apply(context: SituationContext): void {
		const output = context.event.payload as FunctionCallOutputItem

		console.log("[function_call.completed]", output.output.text)
	}
}

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

export class ModelAnswerSpecification extends SituationSpecification {
	isSatisfiedBy(context: SituationContext): boolean {
		return context.event.type === "model.answer"
	}
}

export class ModelAnswerRenderer implements SituationProcessor {
	apply(context: SituationContext): void {
		const { answer } = context.event.payload as { answer: ModelMessageItem }

		console.log("[model.answer]", answer.content.text)
	}
}

const messageHandler: SituationHandler = {
	specification: new MessageSentSpecification(),
	processor: new MessageSentRenderer(),
}

const toolCallStartedHandler: SituationHandler = {
	specification: new FunctionCallStartedSpecification(),
	processor: new FunctionCallStartedRenderer(),
}

const toolCallCompletedHandler: SituationHandler = {
	specification: new FunctionCallCompletedSpecification(),
	processor: new FunctionCallCompletedRenderer(),
}

const reasoningHandler: SituationHandler = {
	specification: new InferenceCompletedSpecification(),
	processor: new ReasoningRenderer(),
}

const answerHandler: SituationHandler = {
	specification: new ModelAnswerSpecification(),
	processor: new ModelAnswerRenderer(),
}

export const logger = createHuman({
	name: "Transcript Logger",
	capabilities: [],
	handlers: [messageHandler, toolCallStartedHandler, toolCallCompletedHandler, reasoningHandler, answerHandler],
})

export const user = createHuman({
	name: "Miodrag",
	capabilities: [],
	handlers: [],
})
