import { SituationContext, SituationHandler, SituationProcessor, SituationSpecification } from "@mozaik-ai/core"
import { resolveParticipant } from "../../../runtime"

export class InterceptionEventSpecification extends SituationSpecification {
	isSatisfiedBy(context: SituationContext): boolean {
		return context.event.type === "interception.started" || context.event.type === "interception.finished"
	}
}

export class InterceptionEventRenderer implements SituationProcessor {
	apply(context: SituationContext): void {
		const transition = context.event.payload as { nextStateId?: string }
		const source = resolveParticipant(context.event.producerId).getManifest().name

		console.log("[interception]", source, context.event.type, transition.nextStateId ?? "")
	}
}

export const interceptionEventHandler: SituationHandler = {
	specification: new InterceptionEventSpecification(),
	processor: new InterceptionEventRenderer(),
}
