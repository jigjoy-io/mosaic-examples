import {
	Agent,
	ModelMessageItem,
	SituationContext,
	SituationHandler,
	SituationProcessor,
	SituationSpecification,
} from "@mozaik-ai/core"
import { resolveRuntime } from "../../../runtime"
import { closeConversation } from "../helpers"

export class OwnAnswerSpecification extends SituationSpecification {
	isSatisfiedBy(context: SituationContext): boolean {
		return context.event.type === "model.answer" && context.event.producerId === context.participant.getId()
	}
}

export class RecordOwnAnswerProcessor implements SituationProcessor {
	apply(context: SituationContext): void {
		const agent = context.participant as Agent
		const { answer } = context.event.payload as { answer: ModelMessageItem }
		const conversation = resolveRuntime().state.conversation
		const turn = conversation.endTurn()

		agent.getMemory().getContext().addItem(answer)
		console.log(`\n${agent.getManifest().name} [${turn}/${conversation.getMaxTurns()}]: ${answer.content.text}`)

		if (conversation.isComplete()) {
			closeConversation()
		}
	}
}

export const ownAnswerHandler: SituationHandler = {
	specification: new OwnAnswerSpecification(),
	processor: new RecordOwnAnswerProcessor(),
}
