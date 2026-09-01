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
import { getStockQuote } from "./tools"

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
	name: "Market Agent",
	capabilities: [],
	instruction:
		"You are a market assistant. When the user asks for a stock price, always call get_stock_quote. Never invent prices.",
	tools: [getStockQuote],
	handlers: [situationHandler],
})

export { agent }
