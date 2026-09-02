import {
	SituationContext,
	SituationHandler,
	SituationProcessor,
	SituationSpecification,
} from "@mozaik-ai/core"

export class MessageSentSpecification extends SituationSpecification {
	isSatisfiedBy(context: SituationContext): boolean {
		return context.event.type === "message.sent"
	}
}

export class NarratorRenderer implements SituationProcessor {
	apply(context: SituationContext): void {
		const { message } = context.event.payload as { message: string }

		console.log(`\nNarrator/User: ${message}`)
	}
}

export const messageSentHandler: SituationHandler = {
	specification: new MessageSentSpecification(),
	processor: new NarratorRenderer(),
}
