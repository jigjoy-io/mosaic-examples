import "dotenv/config"
import { agent } from "./agent"
import { EnvironmentState, initializeRuntime, join, sendMessage } from "./runtime"
import { user } from "./user"

initializeRuntime({ state: new EnvironmentState() })

join(user)
join(agent)

sendMessage(
	"Analyze this directory and write a detailed description of the project in a file called purpose.md.",
	user.getId(),
)
