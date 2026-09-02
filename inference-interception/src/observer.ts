import {
	ModelMessageItem,
	SituationContext,
	SituationHandler,
	SituationProcessor,
	SituationSpecification,
	createHuman,
} from "@mozaik-ai/core"
import { resolveParticipant } from "./runtime"

type ResponsesStreamChunk = {
	type?: string
}

export class InferenceStreamSpecification extends SituationSpecification {
	isSatisfiedBy(context: SituationContext): boolean {
		return context.event.type === "inference.stream"
	}
}

export class StreamEventRenderer implements SituationProcessor {
	apply(context: SituationContext): void {
		const chunk = context.event.payload as ResponsesStreamChunk
		const source = resolveParticipant(context.event.producerId).getManifest().name

		console.log("[event]", source, chunk.type ?? context.event.type)
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
		const source = resolveParticipant(context.event.producerId).getManifest().name

		console.log("[model_message]", source, answer.content.text)
	}
}

export class InterceptionEventSpecification extends SituationSpecification {
	isSatisfiedBy(context: SituationContext): boolean {
		return context.event.type === "interception.started" || context.event.type === "interception.finished"
	}
}

export class InterceptionEventRenderer implements SituationProcessor {
	apply(context: SituationContext): void {
		const transition = context.event.payload as { nextStateId?: string }
		const source = resolveParticipant(context.event.producerId).getManifest().name

		console.log("[interception]", source, context.event.type, transition.nextStateId ?? "")
	}
}

const streamHandler: SituationHandler = {
	specification: new InferenceStreamSpecification(),
	processor: new StreamEventRenderer(),
}

const answerHandler: SituationHandler = {
	specification: new ModelAnswerSpecification(),
	processor: new ModelAnswerRenderer(),
}

const interceptionHandler: SituationHandler = {
	specification: new InterceptionEventSpecification(),
	processor: new InterceptionEventRenderer(),
}

export const observer = createHuman({
	name: "Runtime Observer",
	capabilities: [],
	handlers: [streamHandler, answerHandler, interceptionHandler],
})
