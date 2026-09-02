import {
	Agent,
	InferenceInput,
	SituationContext,
	SituationHandler,
	SituationProcessor,
	SituationSpecification,
} from "@mozaik-ai/core"
import { ApprovalInterceptionHandler } from "../interception/approval"
import { resolveRuntime, runLoop } from "../../../runtime"

export class TransactionsReadySpecification extends SituationSpecification {
	isSatisfiedBy(context: SituationContext): boolean {
		if (context.event.type !== "model.answer") {
			return false
		}

		if (context.event.producerId === context.participant.getId()) {
			return false
		}

		return resolveRuntime().state.ledger.hasPending()
	}
}

export class TransferProcessor implements SituationProcessor {
	apply(context: SituationContext): void {
		const agent = context.participant as Agent
		const pending = resolveRuntime().state.ledger.drain()

		if (pending.length === 0) {
			return
		}

		const list = pending
			.map((transaction, index) => `${index + 1}. $${transaction.amount} to ${transaction.toAccount}`)
			.join("\n")

		const inferenceInput: InferenceInput = {
			model: "gpt-5.4",
			context: agent.getMemory().getContext(),
			tools: agent.getTools(),
		}

		runLoop(
			agent.getId(),
			`Execute these transfers:\n${list}`,
			inferenceInput,
			new ApprovalInterceptionHandler(),
		)
	}
}

export const transactionsReadyHandler: SituationHandler = {
	specification: new TransactionsReadySpecification(),
	processor: new TransferProcessor(),
}
