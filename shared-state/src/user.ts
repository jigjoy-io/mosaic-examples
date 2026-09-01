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

export class ModelAnswerProcessor implements SituationProcessor {
	apply(context: SituationContext): void {
		const { answer } = context.event.payload as { answer: ModelMessageItem }

		console.log("Model answer: ", answer)
	}
}

const situationHandler: SituationHandler = {
	specification: new ModelAnswerSpecification(),
	processor: new ModelAnswerProcessor(),
}

const user = createHuman({
	name: "Miodrag",
	capabilities: ["make_investment_decision"],
	handlers: [situationHandler],
})

export { user }
