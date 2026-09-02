import "dotenv/config"
import { caesar, pompey, cato } from "./participants/historical-figure"
import { narrator } from "./participants/narrator"
import { observer } from "./participants/observer"
import { Conversation, EnvironmentState, initializeRuntime, join, sendMessage } from "./runtime"

initializeRuntime({ state: new EnvironmentState(Conversation.init(5)) })

join(narrator)
join(observer)
join(caesar)
join(pompey)
join(cato)

sendMessage(
	`
  Historical scenario:
  It is 49 BCE. Caesar has been ordered to disband his army before returning to Rome.
  The Senate fears he will become a tyrant. Caesar fears prosecution and humiliation.
  
  Begin the simulation:
  Each character should argue what Rome should do next.
  `,
	narrator.getId(),
)
