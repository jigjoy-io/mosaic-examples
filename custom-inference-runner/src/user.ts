import {
	SituationContext,
	SituationSpecification,
	SituationHandler,
	SituationProcessor,
	createHuman,
	ModelMessageItem,
} from "@mozaik-ai/core"

export class ModelAnswerSpecification extends SituationSpecification {
	isSatisfiedBy(context: SituationContext): boolean {
		return context.event.type === "model.answer"
	}
}

export class ModelAnswerRenderer implements SituationProcessor {
	apply(context: SituationContext): void {
		const { answer } = context.event.payload as { answer: ModelMessageItem }

		console.log("Model answer:", answer.content.text)
	}
}

const answerHandler: SituationHandler = {
	specification: new ModelAnswerSpecification(),
	processor: new ModelAnswerRenderer(),
}

const user = createHuman({
	name: "Miodrag",
	capabilities: ["make_investment_decision"],
	handlers: [answerHandler],
})

export { user }
