import {
	ModelMessageItem,
	SemanticEvent,
	UserMessageItem,
	InferenceInput,
	InferenceOutput,
	InferenceRunner,
} from "@mozaik-ai/core"

export class MockInferenceRunner implements InferenceRunner {
	async run(input: InferenceInput): Promise<InferenceOutput> {
		const lastUserMessage = [...input.context.getItems()]
			.reverse()
			.find((item) => item instanceof UserMessageItem)

		const text = lastUserMessage
			? `Mock reply (no provider called). You said: "${lastUserMessage.content.text}"`
			: "Mock reply (no provider called). There was no user message in context."

		return {
			items: [ModelMessageItem.rehydrate({ text })],
			tokenUsage: undefined,
			rowResponse: { mock: true, model: input.model },
		}
	}

	async *stream(input: InferenceInput): AsyncGenerator<SemanticEvent> {
		yield SemanticEvent.create("inference.output", input.model, await this.run(input))
	}
}
