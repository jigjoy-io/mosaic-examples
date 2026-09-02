import "dotenv/config"
import { observer } from "./observer"
import { planner } from "./planner"
import { EnvironmentState, initializeRuntime, join, sendMessage } from "./runtime"
import { user } from "./user"

initializeRuntime({ state: new EnvironmentState() })

join(user)
join(observer)
join(planner)

console.log("Environment started — streaming planner inference…")

sendMessage(
	`
  Create a production migration plan for moving billing data
  from the legacy system to the new service.
`,
	user.getId(),
)
