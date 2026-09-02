import { Tool } from "@mozaik-ai/core"
import { resolveRuntime } from "../../runtime"

export const queueTransaction: Tool = {
	type: "function",
	name: "queue_transaction",
	description: "Queue a payment transaction onto the shared ledger for the transfer agent to execute.",
	strict: false,
	parameters: {
		type: "object",
		properties: {
			amount: {
				type: "number",
				description: "Amount to transfer in USD.",
			},
			toAccount: {
				type: "string",
				description: "Destination account identifier, for example acct-11.",
			},
		},
		required: ["amount", "toAccount"],
		additionalProperties: false,
	},
	invoke: async ({ amount, toAccount }: { amount: number; toAccount: string }) => {
		resolveRuntime().state.ledger.enqueue({ amount, toAccount })
		console.log(`[ledger] queued $${amount} to ${toAccount}`)

		return {
			status: "queued",
			amount,
			toAccount,
		}
	},
}
