import "dotenv/config"
import { agent } from "./participants/agent"
import { EnvironmentState, initializeRuntime, join, sendMessage } from "./runtime"
import { user } from "./participants/user"

initializeRuntime({ state: new EnvironmentState() })

join(user)
join(agent)

sendMessage("Give me a brief investment view on Apple.", user.getId())
