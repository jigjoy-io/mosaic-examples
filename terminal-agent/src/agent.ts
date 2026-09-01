import {
	Agent,
	createAgent,
	InferenceInput,
	SituationContext,
	SituationHandler,
	SituationProcessor,
	SituationSpecification,
} from "@mozaik-ai/core"
import { runLoop } from "./runtime"
import { terminalTools } from "./tools"

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
			model: "gpt-5.4",
			reasoningEffort: "high",
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

export const agent = createAgent({
	name: "Terminal Agent",
	capabilities: [],
	instruction: `You are a terminal agent.

You can run commands in the terminal to help the user with their request.
Do not ask any questions to the user. Just run the commands and return the result.

Tools:
- run_command: Run a command in the terminal. You can use this tool to run any command in the terminal.`,
	tools: terminalTools,
	handlers: [situationHandler],
})
