import { Link } from '@tanstack/solid-router'
import { createMemo } from 'solid-js'
import { loadSession } from '../lib/review-session'

export function Home() {
  const session = createMemo(() => loadSession())
  const done = createMemo(() => session().items.filter((i) => i.done).length)
  const total = createMemo(() => session().items.length)
  const pct = createMemo(() =>
    total() ? Math.round((done() / total()) * 100) : 0,
  )

  return (
    <div class="space-y-10">
      <section class="space-y-4">
        <p class="text-sm font-medium uppercase tracking-wider text-violet-400/90">
          Code review helper
        </p>
        <h1 class="text-balance text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
          Keep reviews consistent, kind, and thorough
        </h1>
        <p class="max-w-2xl text-lg text-zinc-400">
          Use a saved checklist, jot notes on a diff, and pull in shared guidelines—all in
          the browser. Nothing leaves your machine unless you copy it out.
        </p>
      </section>

      <div class="grid gap-4 sm:grid-cols-3">
        <Link
          to="/review"
          class="group rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 text-left ring-1 ring-zinc-800/60 transition hover:border-violet-500/40 hover:ring-violet-500/20"
        >
          <h2 class="text-base font-semibold text-zinc-100">Checklist</h2>
          <p class="mt-2 text-sm text-zinc-400">
            Track correctness, security, tests, and more with per-item notes.
          </p>
          <p class="mt-4 text-xs font-medium text-violet-400 group-hover:text-violet-300">
            Open checklist →
          </p>
        </Link>
        <Link
          to="/diff"
          class="group rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 text-left ring-1 ring-zinc-800/60 transition hover:border-violet-500/40 hover:ring-violet-500/20"
        >
          <h2 class="text-base font-semibold text-zinc-100">Diff notes</h2>
          <p class="mt-2 text-sm text-zinc-400">
            Paste a snippet, scan line-by-line, and capture findings beside the change.
          </p>
          <p class="mt-4 text-xs font-medium text-violet-400 group-hover:text-violet-300">
            Open diff workspace →
          </p>
        </Link>
        <Link
          to="/guidelines"
          class="group rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 text-left ring-1 ring-zinc-800/60 transition hover:border-violet-500/40 hover:ring-violet-500/20"
        >
          <h2 class="text-base font-semibold text-zinc-100">Guidelines</h2>
          <p class="mt-2 text-sm text-zinc-400">
            Team prompts loaded from a JSON file—swap for your own in{' '}
            <code class="rounded bg-zinc-800 px-1 py-0.5 font-mono text-[11px] text-zinc-300">
              public/
            </code>
            .
          </p>
          <p class="mt-4 text-xs font-medium text-violet-400 group-hover:text-violet-300">
            View guidelines →
          </p>
        </Link>
      </div>

      <section class="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 sm:p-8">
        <div class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 class="text-lg font-semibold text-zinc-100">Saved session</h2>
            <p class="mt-1 text-sm text-zinc-500">
              Checklist progress persists in local storage on this device.
            </p>
          </div>
          <div class="text-right">
            <p class="text-3xl font-semibold tabular-nums text-zinc-50">{pct()}%</p>
            <p class="text-sm text-zinc-500">
              {done()} of {total()} items checked
            </p>
          </div>
        </div>
        <div
          class="mt-6 h-2 overflow-hidden rounded-full bg-zinc-800"
          role="progressbar"
          aria-valuenow={pct()}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            class="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 transition-[width]"
            style={{ width: `${pct()}%` }}
          />
        </div>
        {session().title ? (
          <p class="mt-4 text-sm text-zinc-400">
            Current focus:{' '}
            <span class="font-medium text-zinc-200">{session().title}</span>
          </p>
        ) : (
          <p class="mt-4 text-sm text-zinc-500">
            No title set yet—open the checklist to describe this review.
          </p>
        )}
      </section>
    </div>
  )
}
