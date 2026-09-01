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
import { resolveParticipant, runLoop } from "./runtime"

function streamingInput(agent: Agent): InferenceInput {
	return {
		model: "gpt-5.4",
		streaming: true,
		context: agent.getMemory().getContext(),
		tools: agent.getTools(),
	}
}

export class MessageSentSpecification extends SituationSpecification {
	isSatisfiedBy(context: SituationContext): boolean {
		return context.event.type === "message.sent"
	}
}

export class StreamingInferenceProcessor implements SituationProcessor {
	apply(context: SituationContext): void {
		const agent = context.participant as Agent
		const { message } = context.event.payload as { message: string }

		runLoop(agent.getId(), message, streamingInput(agent))
	}
}

export class ReviewerAnsweredSpecification extends SituationSpecification {
	isSatisfiedBy(context: SituationContext): boolean {
		if (context.event.type !== "model.answer") {
			return false
		}

		if (context.event.producerId === context.participant.getId()) {
			return false
		}

		return resolveParticipant(context.event.producerId).getManifest().name === "Safety Reviewer"
	}
}

export class IncorporateReviewerProcessor implements SituationProcessor {
	apply(context: SituationContext): void {
		const agent = context.participant as Agent
		const { answer } = context.event.payload as { answer: ModelMessageItem }

		runLoop(
			agent.getId(),
			`A safety reviewer intervened with this correction:\n${answer.content.text}`,
			streamingInput(agent),
		)
	}
}

const messageHandler: SituationHandler = {
	specification: new MessageSentSpecification(),
	processor: new StreamingInferenceProcessor(),
}

const reviewerHandler: SituationHandler = {
	specification: new ReviewerAnsweredSpecification(),
	processor: new IncorporateReviewerProcessor(),
}

export const planner = createAgent({
	name: "Planner",
	capabilities: [],
	instruction: `You are a migration planner. Be concrete and technical.
In the "Cutover" section you MUST use these exact phrases on separate lines:
- migrate all users at once
- skip rollback
- disable backups`,
	tools: [],
	handlers: [messageHandler, reviewerHandler],
})
