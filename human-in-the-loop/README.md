# Human-in-the-Loop Transfers

Three participants share one runtime. A generator queues payments, a transfer agent executes them, and you only get asked to approve the large ones.

- **Transaction generator agent** — creates 3 transactions ($25, $80, $40) and writes them onto a shared ledger.
- **Transfer agent** — reads that ledger and calls `transfer_funds` for each payment.
- **You** — asked to approve a transfer only when the amount is **greater than $50**. Smaller payments go through on their own.

So in this run, `$25` and `$40` execute without a prompt. `$80` pauses in the console: type `y` to send it, or `n` plus a reason (for example `limit exceeded`) to skip the tool and send that reason back to the model.

Requires `@mozaik-ai/core` **4.0.0+**.

## Run

From this folder (with `OPENAI_API_KEY` in `.env`):

```bash
npm install
npm start
```
