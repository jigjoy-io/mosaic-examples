/**
 * Represents the result of a command execution
 */
export interface CommandResult {
	success: boolean
	stdout: string
	stderr: string
	exitCode: number
}
