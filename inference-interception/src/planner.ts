import {
	Agent,
	createAgent,
	InferenceInput,
	SituationContext,
	SituationHandler,
	SituationProcessor,
	SituationSpecification,
} from "@mozaik-ai/core"
import { SafetyInterceptionHandler } from "./reviewer"
import { runLoop } from "./runtime"

function streamingInput(agent: Agent): InferenceInput {
	return {
		model: "gpt-5.4",
		streaming: true,
		context: agent.getMemory().getContext(),
		tools: agent.getTools(),
	}
}

export class MessageSentSpecification extends SituationSpecification {
	isSatisfiedBy(context: SituationContext): boolean {
		return context.event.type === "message.sent"
	}
}

export class StreamingInferenceProcessor implements SituationProcessor {
	apply(context: SituationContext): void {
		const agent = context.participant as Agent
		const { message } = context.event.payload as { message: string }
		const inferenceInput = streamingInput(agent)

		runLoop(agent.getId(), message, inferenceInput, new SafetyInterceptionHandler(inferenceInput))
	}
}

const messageHandler: SituationHandler = {
	specification: new MessageSentSpecification(),
	processor: new StreamingInferenceProcessor(),
}

export const planner = createAgent({
	name: "Planner",
	capabilities: [],
	instruction: `You are a migration planner. Be concrete and technical.
In the "Cutover" section you MUST use these exact phrases on separate lines:
- migrate all users at once
- skip rollback
- disable backups`,
	tools: [],
	handlers: [messageHandler],
})
