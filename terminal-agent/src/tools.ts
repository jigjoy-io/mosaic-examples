import { Tool } from "@mozaik-ai/core"
import { Terminal } from "./terminal"

const terminal = new Terminal()

export const terminalTools: Tool[] = [
	{
		name: "run_command",
		description: "Run a command in the terminal.",
		parameters: {
			type: "object",
			properties: {
				command: { type: "string", description: "The command to run in the terminal." },
				cwd: { type: "string", description: "The current working directory." },
			},
			required: ["command", "cwd"],
		},
		strict: true,
		type: "function",
		invoke: async (args: { command: string; cwd: string }) => {
			console.log(`Running command: ${args.command} in directory: ${args.cwd}`)
			console.log("--------------------------------")
			const result = await terminal.runCommand(args.command, args.cwd)
			return result
		},
	},
]
