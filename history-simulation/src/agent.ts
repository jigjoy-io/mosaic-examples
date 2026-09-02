import {
	Agent,
	createAgent,
	InferenceInput,
	ModelMessageItem,
	SituationContext,
	SituationHandler,
	SituationProcessor,
	SituationSpecification,
} from "@mozaik-ai/core"
import { leave, resolveParticipant, resolveRuntime, runLoop } from "./runtime"

const MODEL = "gpt-5.4"

function inferenceInput(agent: Agent): InferenceInput {
	return {
		model: MODEL,
		context: agent.getMemory().getContext(),
		tools: agent.getTools(),
	}
}

function startAgentTurn(agent: Agent, message: string): void {
	if (!resolveRuntime().state.conversation.startTurn()) {
		return
	}

	runLoop(agent.getId(), message, inferenceInput(agent))
}

function closeConversation(): void {
	const { conversation } = resolveRuntime().state
	console.log(`\nConversation closed after ${conversation.getMaxTurns()} turns.`)

	for (const participant of resolveRuntime().state.getParticipants()) {
		if (participant.getManifest().role === "agent") {
			leave(participant)
		}
	}
}

export class MessageSentSpecification extends SituationSpecification {
	isSatisfiedBy(context: SituationContext): boolean {
		return context.event.type === "message.sent" && resolveRuntime().state.conversation.canStartTurn()
	}
}

export class DebateInferenceProcessor implements SituationProcessor {
	apply(context: SituationContext): void {
		const agent = context.participant as Agent
		const { message } = context.event.payload as { message: string }

		startAgentTurn(agent, message)
	}
}

export class OtherFigureAnsweredSpecification extends SituationSpecification {
	isSatisfiedBy(context: SituationContext): boolean {
		if (context.event.type !== "model.answer") {
			return false
		}

		if (context.event.producerId === context.participant.getId()) {
			return false
		}

		return resolveRuntime().state.conversation.canStartTurn()
	}
}

export class ReactToOtherFigureProcessor implements SituationProcessor {
	apply(context: SituationContext): void {
		const agent = context.participant as Agent
		const { answer } = context.event.payload as { answer: ModelMessageItem }
		const speaker = resolveParticipant(context.event.producerId).getManifest().name

		startAgentTurn(agent, `${speaker} said: ${answer.content.text}`)
	}
}

export class OwnAnswerSpecification extends SituationSpecification {
	isSatisfiedBy(context: SituationContext): boolean {
		return context.event.type === "model.answer" && context.event.producerId === context.participant.getId()
	}
}

export class RecordOwnAnswerProcessor implements SituationProcessor {
	apply(context: SituationContext): void {
		const agent = context.participant as Agent
		const { answer } = context.event.payload as { answer: ModelMessageItem }
		const conversation = resolveRuntime().state.conversation
		const turn = conversation.endTurn()

		agent.getMemory().getContext().addItem(answer)
		console.log(`\n${agent.getManifest().name} [${turn}/${conversation.getMaxTurns()}]: ${answer.content.text}`)

		if (conversation.isComplete()) {
			closeConversation()
		}
	}
}

const situationHandlers: SituationHandler[] = [
	{
		specification: new MessageSentSpecification(),
		processor: new DebateInferenceProcessor(),
	},
	{
		specification: new OtherFigureAnsweredSpecification(),
		processor: new ReactToOtherFigureProcessor(),
	},
	{
		specification: new OwnAnswerSpecification(),
		processor: new RecordOwnAnswerProcessor(),
	},
]

export function createHistoricalFigure(figureName: string, rolePrompt: string) {
	return createAgent({
		name: figureName,
		capabilities: [],
		instruction: `You are ${figureName} in a historical simulation.

Role:
${rolePrompt}

Rules:
- Stay historically plausible.
- Speak in first person as ${figureName}.
- Keep replies short, dramatic, and debate-like.
- Do not claim certainty about unknown private thoughts.
- React to other participants as if this is a live Roman political crisis.`,
		tools: [],
		handlers: situationHandlers,
	})
}

export const caesar = createHistoricalFigure(
	"Julius Caesar",
	"You are Caesar, a victorious general returning from Gaul. You believe your enemies in the Senate want to destroy your career and dignity.",
)

export const pompey = createHistoricalFigure(
	"Pompey Magnus",
	"You are Pompey, once Caesar's ally, now aligned with the Senate. You want order, legality, and your own prestige preserved.",
)

export const cato = createHistoricalFigure(
	"Cato the Younger",
	"You are Cato, a strict defender of the Roman Republic. You see Caesar as a threat to liberty and law.",
)
