import {
	AgenticEnvironment,
	BaseAgent,
	ModelContext,
	UserMessageItem,
	ModelMessageItem,
	FunctionCallItem,
	FunctionCallOutputItem,
	ReasoningItem,
	type InferenceRunner,
	type FunctionCallRunner,
	type GenerativeModel,
	Participant,
} from "@mozaik-ai/core"

export class HistoricalFigureAgent extends BaseAgent {
	constructor(
		private readonly figureName: string,
		private readonly rolePrompt: string,
		private readonly environment: AgenticEnvironment,
		private readonly context: ModelContext,
		private readonly model: GenerativeModel,
		inferenceRunner: InferenceRunner,
		functionCallRunner: FunctionCallRunner,
	) {
		super(inferenceRunner, functionCallRunner)

		this.context.addContextItem(
			UserMessageItem.create(`
  You are ${figureName} in a historical simulation.
  
  Role:
  ${rolePrompt}
  
  Rules:
  - Stay historically plausible.
  - Speak in first person as ${figureName}.
  - Keep replies short, dramatic, and debate-like.
  - Do not claim certainty about unknown private thoughts.
  - React to other participants as if this is a live Roman political crisis.
  `),
		)
	}

	override onMessage(message: string) {
		this.context.addContextItem(UserMessageItem.create(message))
		this.runInference(this.environment, this.context, this.model)
	}

	override onExternalModelMessage(source: Participant, item: ModelMessageItem) {
		this.context.addContextItem(UserMessageItem.create(`Another participant said: ${item.content}`))

		this.runInference(this.environment, this.context, this.model)
	}

	override onFunctionCall(item: FunctionCallItem) {
		this.context.addContextItem(item)
		this.executeFunctionCall(this.environment, item)
	}

	override onFunctionCallOutput(item: FunctionCallOutputItem) {
		this.context.addContextItem(item)
		this.runInference(this.environment, this.context, this.model)
	}

	override onReasoning(item: ReasoningItem) {
		this.context.addContextItem(item)
	}

	override onModelMessage(item: ModelMessageItem) {
		this.context.addContextItem(item)
		console.log(`\n${this.figureName}: ${JSON.stringify(item.content.text)}`)
	}
}
