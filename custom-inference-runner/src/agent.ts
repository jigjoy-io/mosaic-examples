import {
	Agent,
	createAgent,
	InferenceInput,
	SituationSpecification,
	SituationHandler,
	SituationProcessor,
	SituationContext,
} from "@mozaik-ai/core"
import { runLoop } from "./runtime"

export class MessageSentSpecification extends SituationSpecification {
	isSatisfiedBy(context: SituationContext): boolean {
		return context.event.type === "message.sent"
	}
}

export class InferenceProcessor implements SituationProcessor {
	apply(context: SituationContext): void {
		const { event, participant } = context

		const agent = participant as Agent
		const { message } = event.payload as { message: string }

		const inferenceInput: InferenceInput = {
			model: "grok",
			context: agent.getMemory().getContext(),
			tools: agent.getTools(),
		}

		runLoop(agent.getId(), message, inferenceInput)
	}
}

const situationHandler: SituationHandler = {
	specification: new MessageSentSpecification(),
	processor: new InferenceProcessor(),
}

const agent = createAgent({
	name: "Mock Agent",
	capabilities: [],
	instruction: "You are a helpful assistant. Replies come from a local mock inference runner.",
	tools: [],
	handlers: [situationHandler],
})

export { agent }
