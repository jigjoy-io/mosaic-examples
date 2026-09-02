import { Tool } from "@mozaik-ai/core"

export const transferFunds: Tool = {
	type: "function",
	name: "transfer_funds",
	description:
		"Transfer money from the operating account to a destination account. Transfers above $50 require human approval.",
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
				description: "Destination account identifier, for example acct-42.",
			},
		},
		required: ["amount", "toAccount"],
		additionalProperties: false,
	},
	invoke: async ({ amount, toAccount }: { amount: number; toAccount: string }) => {
		return {
			status: "completed",
			amount,
			toAccount,
			transferId: `txn-${Date.now()}`,
		}
	},
}
