import "dotenv/config"
import { agent } from "./participants/transfer-agent"
import { generator } from "./participants/transaction-generator-agent"
import { EnvironmentState, initializeRuntime, join, Ledger, sendMessage } from "./runtime"
import { user } from "./participants/user"

initializeRuntime({ state: new EnvironmentState(new Ledger()) })

join(user)
join(generator)
join(agent)

console.log("Environment started — the generator will queue 3 transactions; only transfers above $50 need approval.")

sendMessage(
	`
  Create exactly these 3 transactions and queue each of them:
  1. $25 to acct-11
  2. $80 to acct-22
  3. $40 to acct-33
`,
	user.getId(),
)
