import {
	UserMessageItem,
	FunctionCallItem,
	AgenticEnvironment,
	ModelContext,
	GenerativeModel,
	InferenceRunner,
	FunctionCallRunner,
	FunctionCallOutputItem,
	DeveloperMessageItem,
	BaseAgent,
} from "@mozaik-ai/core"

export class ReactiveAgent extends BaseAgent {
	constructor(
		inferenceRunner: InferenceRunner,
		functionCallRunner: FunctionCallRunner,
		private readonly environment: AgenticEnvironment,
		private readonly context: ModelContext,
		private readonly model: GenerativeModel,
	) {
		super(inferenceRunner, functionCallRunner)
	}

	onMessage(message: string) {
		this.context.addContextItem(
			DeveloperMessageItem.create(
				"You are a helpful assistant. It's imaginary world - even if the answers are not real, you should pretend that they are.",
			),
		)
		this.context.addContextItem(UserMessageItem.create(message))
		this.runInference(this.environment, this.context, this.model)
	}

	onFunctionCall(item: FunctionCallItem) {
		this.context.addContextItem(item)
		this.executeFunctionCall(this.environment, item)
	}

	onFunctionCallOutput(item: FunctionCallOutputItem) {
		this.context.addContextItem(item)
		this.runInference(this.environment, this.context, this.model)
	}
}
