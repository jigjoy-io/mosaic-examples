import {
	UserMessageItem,
	FunctionCallItem,
	AgenticEnvironment,
	ModelContext,
	FunctionCallOutputItem,
	DeveloperMessageItem,
	Tool,
	BaseParticipant,
	runInference,
	executeFunctionCall,
	InferenceParams,
	ModelName,
} from "@mozaik-ai/core"

export class ReactiveAgent extends BaseParticipant {
	constructor(
		private readonly environment: AgenticEnvironment,
		private readonly context: ModelContext,
		private readonly capitalOfFranceTool: Tool,
	) {
		super()
	}

	onMessage(message: string) {
		this.context.addContextItem(
			DeveloperMessageItem.create(
				"You are a helpful assistant. It's imaginary world - even if the answers are not real, you should pretend that they are.",
			),
		)
		this.context.addContextItem(UserMessageItem.create(message))
		const inferenceParams: InferenceParams<ModelName> = {
			model: "gpt-5.4",
			tools: [this.capitalOfFranceTool],
			context: this.context,
			environment: this.environment,
			caller: this,
		}
		runInference(inferenceParams)
	}

	onFunctionCall(item: FunctionCallItem) {
		this.context.addContextItem(item)
		executeFunctionCall(this.environment, item, this.capitalOfFranceTool, this)
	}

	onFunctionCallOutput(item: FunctionCallOutputItem) {
		this.context.addContextItem(item)

		const inferenceParams: InferenceParams<ModelName> = {
			model: "gpt-5.4",
			context: this.context,
			environment: this.environment,
			caller: this,
		}
		runInference(inferenceParams)
	}
}
