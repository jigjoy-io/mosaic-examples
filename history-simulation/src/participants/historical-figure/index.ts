import { createAgent, SituationHandler } from "@mozaik-ai/core"
import { messageSentHandler } from "./situations/message-sent"
import { otherFigureAnsweredHandler } from "./situations/other-figure-answered"
import { ownAnswerHandler } from "./situations/own-answer"

const situationHandlers: SituationHandler[] = [messageSentHandler, otherFigureAnsweredHandler, ownAnswerHandler]

function createHistoricalFigure(figureName: string, rolePrompt: string) {
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
