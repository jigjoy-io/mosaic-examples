import {
	AgenticEnvironment,
	BaseHuman,
	DefaultFunctionCallRunner,
	Gpt54Mini,
	ModelContext,
	OpenAIInferenceRunner,
} from "@mozaik-ai/core"
import { HistoricalFigureAgent } from "./historical-figure-agent"
import { TranscriptObserver } from "./transcript-observer"

import "dotenv/config"

async function main() {
	const environment = new AgenticEnvironment()

	const inferenceRunner = new OpenAIInferenceRunner()
	const functionCallRunner = new DefaultFunctionCallRunner([])
	const model = new Gpt54Mini()

	const human = new BaseHuman()
	const observer = new TranscriptObserver()

	const caesar = new HistoricalFigureAgent(
		"Julius Caesar",
		"You are Caesar, a victorious general returning from Gaul. You believe your enemies in the Senate want to destroy your career and dignity.",
		environment,
		ModelContext.create("caesar-context"),
		model,
		inferenceRunner,
		functionCallRunner,
	)

	const pompey = new HistoricalFigureAgent(
		"Pompey Magnus",
		"You are Pompey, once Caesar's ally, now aligned with the Senate. You want order, legality, and your own prestige preserved.",
		environment,
		ModelContext.create("pompey-context"),
		model,
		inferenceRunner,
		functionCallRunner,
	)

	const cato = new HistoricalFigureAgent(
		"Cato the Younger",
		"You are Cato, a strict defender of the Roman Republic. You see Caesar as a threat to liberty and law.",
		environment,
		ModelContext.create("cato-context"),
		model,
		inferenceRunner,
		functionCallRunner,
	)

	human.join(environment)
	observer.join(environment)
	caesar.join(environment)
	pompey.join(environment)
	cato.join(environment)

	environment.start()

	human.sendMessage(
		environment,
		`
  Historical scenario:
  It is 49 BCE. Caesar has been ordered to disband his army before returning to Rome.
  The Senate fears he will become a tyrant. Caesar fears prosecution and humiliation.
  
  Begin the simulation:
  Each character should argue what Rome should do next.
  `,
	)
}

main().catch(console.error)
