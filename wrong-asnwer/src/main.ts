import "dotenv/config"
import { agent } from "./participants/agent"
import { logger } from "./participants/logger"
import { EnvironmentState, initializeRuntime, join, sendMessage } from "./runtime"
import { user } from "./participants/user"

initializeRuntime({ state: new EnvironmentState() })

join(user)
join(logger)
join(agent)

sendMessage("What is the capital of France?", user.getId())
