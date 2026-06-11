import {
	AgenticEnvironment,
	BaseParticipant,
	ModelContext,
	UserMessageItem,
	ModelMessageItem,
	ReasoningItem,
	Participant,
	runInference,
} from "@mozaik-ai/core"

export class HistoricalFigureAgent extends BaseParticipant {
	constructor(
		private readonly figureName: string,
		private readonly rolePrompt: string,
		private readonly environment: AgenticEnvironment,
		private readonly context: ModelContext,
	) {
		super()

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

		const inferenceParams = {
			model: "gpt-5-4",
			context: this.context,
			environment: this.environment,
			caller: this,
		}
		runInference(inferenceParams)
	}

	override onExternalModelMessage(source: Participant, item: ModelMessageItem) {
		this.context.addContextItem(UserMessageItem.create(`Another participant said: ${item.content}`))

		const inferenceParams = {
			model: "gpt-5-4",
			context: this.context,
			environment: this.environment,
			caller: this,
		}
		runInference(inferenceParams)
	}

	override onReasoning(item: ReasoningItem) {
		this.context.addContextItem(item)
	}

	override onModelMessage(item: ModelMessageItem) {
		this.context.addContextItem(item)
		console.log(`\n${this.figureName}: ${JSON.stringify(item.content.text)}`)
	}
}
