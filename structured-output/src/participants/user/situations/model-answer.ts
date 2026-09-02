import {
	ModelMessageItem,
	SituationContext,
	SituationHandler,
	SituationProcessor,
	SituationSpecification,
} from "@mozaik-ai/core"

export class ModelAnswerSpecification extends SituationSpecification {
	isSatisfiedBy(context: SituationContext): boolean {
		return context.event.type === "model.answer"
	}
}

export class StructuredAnswerRenderer implements SituationProcessor {
	apply(context: SituationContext): void {
		const { answer } = context.event.payload as { answer: ModelMessageItem }
		const raw = answer.content.text

		try {
			console.log("Structured answer:", JSON.parse(raw))
		} catch {
			console.log("Unparsed answer:", raw)
		}
	}
}

export const modelAnswerHandler: SituationHandler = {
	specification: new ModelAnswerSpecification(),
	processor: new StructuredAnswerRenderer(),
}
