import {
	Agent,
	InferenceInput,
	SituationContext,
	SituationHandler,
	SituationProcessor,
	SituationSpecification,
} from "@mozaik-ai/core"
import { resolveRuntime, runLoop } from "../../../runtime"

export class FremiumSpecification extends SituationSpecification {
	isSatisfiedBy(situationContext: SituationContext): boolean {
		const { event } = situationContext

		if (event.type !== "message.sent") {
			return false
		}

		const runtime = resolveRuntime()

		const numberOfTry = runtime.state.freemiumAccount.getNumberOfTry()
		const maxNumberOfTry = runtime.state.freemiumAccount.getMaxNumberOfTry()

		if (numberOfTry >= maxNumberOfTry) {
			throw new Error("Freemium account limit reached")
		}

		return true
	}
}

export class MessageProcessor implements SituationProcessor {
	apply(context: SituationContext) {
		const { event, participant } = context

		const { message } = event.payload as { message: string }

		const agent = participant as Agent

		const inferenceInput: InferenceInput = {
			model: "gpt-5.4",
			context: agent.getMemory().getContext(),
			tools: agent.getTools(),
		}
		runLoop(participant.getId(), message, inferenceInput)
	}
}

export const messageSentHandler: SituationHandler = {
	specification: new FremiumSpecification(),
	processor: new MessageProcessor(),
}
