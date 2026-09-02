import {
	Agent,
	SituationContext,
	SituationHandler,
	SituationProcessor,
	SituationSpecification,
} from "@mozaik-ai/core"
import { resolveRuntime } from "../../../runtime"
import { startAgentTurn } from "../helpers"

export class MessageSentSpecification extends SituationSpecification {
	isSatisfiedBy(context: SituationContext): boolean {
		return context.event.type === "message.sent" && resolveRuntime().state.conversation.canStartTurn()
	}
}

export class DebateInferenceProcessor implements SituationProcessor {
	apply(context: SituationContext): void {
		const agent = context.participant as Agent
		const { message } = context.event.payload as { message: string }

		startAgentTurn(agent, message)
	}
}

export const messageSentHandler: SituationHandler = {
	specification: new MessageSentSpecification(),
	processor: new DebateInferenceProcessor(),
}
