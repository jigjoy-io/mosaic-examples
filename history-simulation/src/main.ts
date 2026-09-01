import "dotenv/config"
import { caesar, cato, pompey } from "./agent"
import { EnvironmentState, initializeRuntime, join, sendMessage } from "./runtime"
import { narrator, observer } from "./user"

initializeRuntime({ state: new EnvironmentState() })

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
