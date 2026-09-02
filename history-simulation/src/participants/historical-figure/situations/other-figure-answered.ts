import {
	Agent,
	ModelMessageItem,
	SituationContext,
	SituationHandler,
	SituationProcessor,
	SituationSpecification,
} from "@mozaik-ai/core"
import { resolveParticipant, resolveRuntime } from "../../../runtime"
import { startAgentTurn } from "../helpers"

export class OtherFigureAnsweredSpecification extends SituationSpecification {
	isSatisfiedBy(context: SituationContext): boolean {
		if (context.event.type !== "model.answer") {
			return false
		}

		if (context.event.producerId === context.participant.getId()) {
			return false
		}

		return resolveRuntime().state.conversation.canStartTurn()
	}
}

export class ReactToOtherFigureProcessor implements SituationProcessor {
	apply(context: SituationContext): void {
		const agent = context.participant as Agent
		const { answer } = context.event.payload as { answer: ModelMessageItem }
		const speaker = resolveParticipant(context.event.producerId).getManifest().name

		startAgentTurn(agent, `${speaker} said: ${answer.content.text}`)
	}
}

export const otherFigureAnsweredHandler: SituationHandler = {
	specification: new OtherFigureAnsweredSpecification(),
	processor: new ReactToOtherFigureProcessor(),
}
