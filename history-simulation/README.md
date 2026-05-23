# History Simulation

A multi-agent historical debate built on Mozaik's `AgenticEnvironment`. Three AI agents—Julius Caesar, Pompey Magnus, and Cato the Younger—argue over Rome's fate in 49 BCE while a human narrator sets the scene and a transcript observer logs the conversation.

Each agent maintains its own `ModelContext`, reacts to messages from other participants, and speaks in first person with historically plausible, debate-style replies.

## Run

From the repository root (with `OPENAI_API_KEY` in `.env`):

```bash
npx tsx history-simulation/main.ts
```

The simulation starts automatically: the narrator posts the scenario, then the three figures take turns responding as the debate unfolds. Output is printed to the console.

## Example output

```
Narrator/User:
  Historical scenario:
  It is 49 BCE. Caesar has been ordered to disband his army before returning to Rome.
  The Senate fears he will become a tyrant. Caesar fears prosecution and humiliation.

  Begin the simulation:
  Each character should argue what Rome should do next.

Julius Caesar: "I am Caesar, and I do not come to Rome as a suppliant to my enemies.

I have served the Republic in Gaul; I have brought victory, wealth, and security to Rome. Yet the Senate demands that I lay down my command while my rivals keep theirs. That is not law—it is a trap.

Let the Senate do justice: let Pompeius lay down his armies as I do, and let both sides return as citizens under equal law. If they seek only my ruin, then they drive me to defend my dignitas by every means Rome has left me."

Pompey Magnus: "I am Gnaeus Pompeius Magnus. Rome stands at the edge of ruin if law yields to arms.

Caesar must dismiss his legions and return as a private citizen, or answer to the Republic as every man must. I do not seek civil war; I seek obedience to the Senate and the safety of the state.

Let Caesar trust Rome. Let him come unarmed. If he is innocent, the courts will prove it. If he is guilty, the Republic must not fear to judge him.

Order first. Glory after."

Cato the Younger: "I am Cato. Rome must not bargain with armed ambition.

Caesar has his command. Let him dismiss his legions, lay down his imperium, and return as a citizen to answer the law. If he refuses, then let the Senate declare him an enemy of the Republic.

Liberty is not preserved by yielding to the man who threatens it. It is preserved by firmness."
```

Each run produces different dialogue. Agents continue to react to one another until you stop the process.

## Layout

| File | Role |
|------|------|
| `main.ts` | Wires the environment, models, human narrator, observer, and three historical agents |
| `history-simulation.ts` | `HistoricalFigureAgent` — role-prompted agent that reacts to messages and other participants |
| `transcript-observer.ts` | Logs narrator messages to the console |
