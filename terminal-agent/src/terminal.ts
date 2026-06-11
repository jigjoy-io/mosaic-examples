import { CommandResult } from "./command-result"
import { spawn } from "child_process"

export class Terminal {
	/**
	 * Runs a command in the terminal
	 * @param command - The command to run
	 * @param cwd - The current working directory
	 * @param contextMessage - The context message to display
	 * @returns A promise that resolves to the command result
	 */
	runCommand(command: string, cwd: string, contextMessage?: string): Promise<CommandResult> {
		return new Promise((resolve) => {
			const [cmd, ...args] = command.split(" ")
			const process = spawn(cmd, args, { cwd, stdio: "pipe", shell: true })

			let stdout = contextMessage ? `${contextMessage}\n` : ""
			let stderr = ""

			process.stdout?.on("data", (data: any) => {
				const output = data.toString()
				stdout += output
			})

			process.stderr?.on("data", (data: any) => {
				const errorOutput = data.toString()
				stderr += errorOutput
			})

			process.on("error", (error: any) => {
				stderr += `\nProcess error: ${error.message}`
			})

			process.on("close", (code: any) => {
				const success = code === 0
				const finalMessage = success
					? `✅ Command "${command}" executed successfully.`
					: `❌ Command "${command}" failed with exit code ${code}.`

				if (success) {
					stdout += `\n${finalMessage}`
				} else {
					stderr += `\n${finalMessage}`
				}

				resolve({
					success,
					stdout: stdout.trim(),
					stderr: stderr.trim(),
					exitCode: code ?? -1,
				})
			})
		})
	}
}
