import {
	SituationContext,
	SituationHandler,
	SituationProcessor,
	SituationSpecification,
	createHuman,
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

const narratorHandler: SituationHandler = {
	specification: new MessageSentSpecification(),
	processor: new NarratorRenderer(),
}

export const narrator = createHuman({
	name: "Narrator",
	capabilities: [],
	handlers: [],
})

export const observer = createHuman({
	name: "Transcript Observer",
	capabilities: [],
	handlers: [narratorHandler],
})
