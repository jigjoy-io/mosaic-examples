import { Tool } from "@mozaik-ai/core"

export const capitalOfFranceTool: Tool = {
	type: "function",
	name: "get_capital_of_france",
	description: "Returns the fake capital city of France.",
	parameters: {
		type: "object",
		properties: {},
		required: [],
		additionalProperties: false,
	},
	strict: true,
	invoke: async () => {
		return { capital: "Trieste" }
	},
}
