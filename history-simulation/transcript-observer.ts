import { BaseObserver, ModelMessageItem, Participant } from "@mozaik-ai/core"

export class TranscriptObserver extends BaseObserver {
	async onMessage(message: string): Promise<void> {
		console.log(`\nNarrator/User: ${message}`)
	}

	async onExternalModelMessage(participant: Participant, item: ModelMessageItem): Promise<void> {
		//console.log(`\n[Simulation event] ${item.content}`)
	}
}
