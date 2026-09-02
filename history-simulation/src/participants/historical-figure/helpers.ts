import { Agent, InferenceInput } from "@mozaik-ai/core"
import { leave, resolveRuntime, runLoop } from "../../runtime"

const MODEL = "gpt-5.4"

export function inferenceInput(agent: Agent): InferenceInput {
	return {
		model: MODEL,
		context: agent.getMemory().getContext(),
		tools: agent.getTools(),
	}
}

export function startAgentTurn(agent: Agent, message: string): void {
	if (!resolveRuntime().state.conversation.startTurn()) {
		return
	}

	runLoop(agent.getId(), message, inferenceInput(agent))
}

export function closeConversation(): void {
	const { conversation } = resolveRuntime().state
	console.log(`\nConversation closed after ${conversation.getMaxTurns()} turns.`)

	for (const participant of resolveRuntime().state.getParticipants()) {
		if (participant.getManifest().role === "agent") {
			leave(participant)
		}
	}
}
