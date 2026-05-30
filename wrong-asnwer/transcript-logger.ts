import {
	BaseObserver,
	FunctionCallItem,
	FunctionCallOutputItem,
	ModelMessageItem,
	Participant,
	ReasoningItem,
} from "@mozaik-ai/core"

export class TranscriptLogger extends BaseObserver {
	onMessage(message: string) {
		console.log(`[${message}]`)
	}

	onFunctionCall(item: FunctionCallItem) {
		console.log(`[${item.constructor.name}]`, item.toJSON())
	}

	onFunctionCallOutput(item: FunctionCallOutputItem) {
		console.log(`[${item.constructor.name}]`, item.toJSON())
	}

	onReasoning(item: ReasoningItem) {
		console.log(`[${item.constructor.name}]`, item.toJSON())
	}

	onModelMessage(item: ModelMessageItem) {
		console.log(`[${item.constructor.name}]`, item.toJSON())
	}

	onExternalFunctionCall(source: Participant, item: FunctionCallItem) {
		console.log(`[${source.constructor.name}]`, item.toJSON())
	}

	onExternalFunctionCallOutput(source: Participant, item: FunctionCallOutputItem) {
		console.log(`[${source.constructor.name}]`, item.toJSON())
	}

	onExternalReasoning(source: Participant, item: ReasoningItem) {
		console.log(`[${source.constructor.name}]`, item.toJSON())
	}

	onExternalModelMessage(source: Participant, item: ModelMessageItem) {
		console.log(`[${source.constructor.name}]`, item.toJSON())
	}
}
