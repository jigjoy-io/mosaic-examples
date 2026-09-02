import "dotenv/config"
import { agent } from "./participants/agent"
import { EnvironmentState, FreemiumAccount, initializeRuntime, join, sendMessage } from "./runtime"
import { user } from "./participants/user"

const freemiumAccount = FreemiumAccount.init(3)
const config = {
	state: new EnvironmentState(freemiumAccount),
}

initializeRuntime(config)

join(user)
join(agent)

sendMessage("Can you tell me more about yourself?", user.getId())
