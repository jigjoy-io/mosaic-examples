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

export class MessageSentRenderer implements SituationProcessor {
	apply(context: SituationContext): void {
		const { message } = context.event.payload as { message: string }

		console.log("[message.sent]", message)
	}
}

export const messageSentHandler: SituationHandler = {
	specification: new MessageSentSpecification(),
	processor: new MessageSentRenderer(),
}
