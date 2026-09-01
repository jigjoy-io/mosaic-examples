import "dotenv/config"
import { agent } from "./agent"
import { EnvironmentState, initializeRuntime, join, sendMessage } from "./runtime"
import { logger, user } from "./user"

initializeRuntime({ state: new EnvironmentState() })

join(user)
join(logger)
join(agent)

sendMessage("What is the capital of France?", user.getId())
