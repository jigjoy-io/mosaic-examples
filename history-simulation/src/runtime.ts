import { defineRuntime, RuntimeState } from "@mozaik-ai/core"

export class Conversation {
	private constructor(
		private turns: number,
		private inFlight: number,
		private readonly maxTurns: number,
	) {}

	getTurns(): number {
		return this.turns
	}

	getMaxTurns(): number {
		return this.maxTurns
	}

	canStartTurn(): boolean {
		return this.turns + this.inFlight < this.maxTurns
	}

	startTurn(): boolean {
		if (!this.canStartTurn()) {
			return false
		}

		this.inFlight++
		return true
	}

	endTurn(): number {
		if (this.inFlight > 0) {
			this.inFlight--
		}

		this.turns++
		return this.turns
	}

	isComplete(): boolean {
		return this.turns >= this.maxTurns
	}

	static init(maxTurns: number): Conversation {
		return new Conversation(0, 0, maxTurns)
	}
}

export class EnvironmentState extends RuntimeState {
	constructor(public readonly conversation: Conversation) {
		super()
	}
}

export const { initializeRuntime, resolveRuntime, resolveParticipant, join, leave, sendMessage, sendEvent, runLoop } =
	defineRuntime<EnvironmentState>()
