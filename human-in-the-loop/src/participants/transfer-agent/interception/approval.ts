import {
	FunctionCallItem,
	FunctionCallOutputItem,
	type ExecutableLoopStateId,
	type InferenceInput,
	type InterceptionHandler,
	type LoopTransition,
} from "@mozaik-ai/core"
import { createInterface } from "node:readline/promises"

type ExecutableTransition = LoopTransition<ExecutableLoopStateId>

export const APPROVAL_THRESHOLD_USD = 50

function prompt(question: string): Promise<string> {
	const rl = createInterface({ input: process.stdin, output: process.stdout })

	return rl.question(question).finally(() => rl.close())
}

function readAmount(call: FunctionCallItem): number | undefined {
	try {
		const raw = typeof call.args === "string" ? JSON.parse(call.args) : call.args
		const amount = Number((raw as { amount?: unknown })?.amount)

		return Number.isFinite(amount) ? amount : undefined
	} catch {
		return undefined
	}
}

export class ApprovalInterceptionHandler implements InterceptionHandler {
	isSatisfiedBy(transition: ExecutableTransition): boolean {
		if (transition.nextStateId !== "function_call") {
			return false
		}

		const { call } = transition.input as { call: FunctionCallItem }

		if (call.name !== "transfer_funds") {
			return false
		}

		const amount = readAmount(call)
		return amount !== undefined && amount > APPROVAL_THRESHOLD_USD
	}

	async handle(transition: ExecutableTransition): Promise<ExecutableTransition> {
		const { call, inferenceInput } = transition.input as {
			call: FunctionCallItem
			inferenceInput: InferenceInput
		}
		const amount = readAmount(call)

		console.log("\n[approver] pending function call")
		console.log(`  name: ${call.name}`)
		console.log(`  args: ${call.args}`)
		console.log(`  reason: amount $${amount} is greater than $${APPROVAL_THRESHOLD_USD}`)

		const approved = await this.askApproval()

		if (approved) {
			console.log("[approver] accepted — executing function call")
			return transition
		}

		const rejectionText = await this.askRejectionText()
		const output = FunctionCallOutputItem.create(call.callId, rejectionText)

		inferenceInput.context.addContextItems([call, output])
		console.log("[approver] rejected — skipping execution and returning user output to the model")

		return {
			nextStateId: "inference",
			input: inferenceInput,
		}
	}

	private async askApproval(): Promise<boolean> {
		while (true) {
			const answer = (await prompt("Approve this function call? [y/n] ")).trim().toLowerCase()

			if (answer === "y" || answer === "yes") {
				return true
			}

			if (answer === "n" || answer === "no") {
				return false
			}

			console.log("Please enter y or n.")
		}
	}

	private async askRejectionText(): Promise<string> {
		while (true) {
			const text = (await prompt("Rejection message (becomes function_call_output): ")).trim()

			if (text.length > 0) {
				return text
			}

			console.log("Please enter a rejection message.")
		}
	}
}
