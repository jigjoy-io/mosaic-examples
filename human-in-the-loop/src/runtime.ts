import { defineRuntime, RuntimeState } from "@mozaik-ai/core"

export type Transaction = {
	amount: number
	toAccount: string
}

export class Ledger {
	private readonly pending: Transaction[] = []

	enqueue(transaction: Transaction): void {
		this.pending.push(transaction)
	}

	hasPending(): boolean {
		return this.pending.length > 0
	}

	drain(): Transaction[] {
		return this.pending.splice(0, this.pending.length)
	}
}

export class EnvironmentState extends RuntimeState {
	constructor(public readonly ledger: Ledger) {
		super()
	}
}

export const { initializeRuntime, resolveRuntime, resolveParticipant, join, leave, sendMessage, sendEvent, runLoop } =
	defineRuntime<EnvironmentState>()
