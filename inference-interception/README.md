# Inference Interception

Demonstrates `runLoop`'s optional `InterceptionHandler`: the planner streams a migration plan, and a safety handler intercepts the `model_message` transition when risky cutover phrases appear. Instead of publishing that answer, the loop is rewritten to `context_update` with a correction, then inference runs again.

- **Planner** — streaming `runLoop` with `SafetyInterceptionHandler`
- **SafetyInterceptionHandler** — `isSatisfiedBy` / `handle` on loop transitions
- **Runtime Observer** — logs stream events, interception events, and completed model messages

Requires `@mozaik-ai/core` **4.0.0-beta.11+**.

## Example output

![Console output: planner stream, safety interception, and corrective inference](./public/inference-interception.png)

When you run the example, the planner streams `[event]` deltas until the interceptor matches risky phrases, emits `interception.started` / `interception.finished`, and the planner infers a safer staged rollout. Only the corrected plan is published as `model.answer`.

## Run

From this folder (with `OPENAI_API_KEY` in `.env`):

```bash
npm start
```

Watch the console for `[event]` lines (streaming deltas), `[reviewer] risky output intercepted` / `[interception]` when the handler rewrites the loop, then a second inference and `[model_message]`.

## Layout

| File | Role |
|------|------|
| `src/main.ts` | Wires runtime, participants, and the initial prompt |
| `src/planner.ts` | Planner agent; passes `InterceptionHandler` into `runLoop` |
| `src/reviewer.ts` | `SafetyInterceptionHandler` for risky `model_message` transitions |
| `src/observer.ts` | Logs stream, interception, and model-answer events |
| `src/user.ts` | Operator who sends the migration prompt |
