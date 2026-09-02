import { SituationContext, SituationHandler, SituationProcessor, SituationSpecification } from "@mozaik-ai/core"
import { resolveParticipant } from "../../../runtime"

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

export const inferenceStreamHandler: SituationHandler = {
	specification: new InferenceStreamSpecification(),
	processor: new StreamEventRenderer(),
}
