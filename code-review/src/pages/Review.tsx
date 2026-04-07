import { createEffect, For } from 'solid-js'
import { createStore, reconcile, unwrap } from 'solid-js/store'
import { debounce } from '../lib/debounce'
import { loadSession, resetSession, saveSession } from '../lib/review-session'
import type { ReviewCategory, ReviewSession } from '../types/review'

const categoryLabel: Record<ReviewCategory, string> = {
  correctness: 'Correctness',
  security: 'Security',
  performance: 'Performance',
  maintainability: 'Maintainability',
  tests: 'Tests',
  documentation: 'Docs',
}

const categoryStyle: Record<ReviewCategory, string> = {
  correctness: 'bg-sky-500/15 text-sky-200 ring-sky-500/25',
  security: 'bg-rose-500/15 text-rose-200 ring-rose-500/25',
  performance: 'bg-amber-500/15 text-amber-200 ring-amber-500/25',
  maintainability: 'bg-emerald-500/15 text-emerald-200 ring-emerald-500/25',
  tests: 'bg-violet-500/15 text-violet-200 ring-violet-500/25',
  documentation: 'bg-zinc-500/15 text-zinc-200 ring-zinc-500/25',
}

const persist = debounce((s: ReviewSession) => saveSession(s), 350)

export function Review() {
  const [session, setSession] = createStore<ReviewSession>(loadSession())

  createEffect(() => {
    void session.title
    void session.prUrl
    void session.summaryNote
    void session.updatedAt
    for (const item of session.items) {
      void item.done
      void item.note
    }
    persist(unwrap(session) as ReviewSession)
  })

  return (
    <div class="space-y-8">
      <header class="space-y-2">
        <h1 class="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
          Review checklist
        </h1>
        <p class="max-w-2xl text-zinc-400">
          Work through each item, add quick notes, and ship feedback that is specific and
          actionable.
        </p>
      </header>

      <section class="grid gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:grid-cols-2 sm:p-6">
        <label class="block space-y-2">
          <span class="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Review title
          </span>
          <input
            type="text"
            placeholder="e.g. auth middleware for API v2"
            class="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-violet-500/60 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            value={session.title}
            onInput={(e) => setSession('title', e.currentTarget.value)}
          />
        </label>
        <label class="block space-y-2">
          <span class="text-xs font-medium uppercase tracking-wide text-zinc-500">
            PR / branch link
          </span>
          <input
            type="url"
            placeholder="https://github.com/org/repo/pull/123"
            class="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-violet-500/60 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            value={session.prUrl}
            onInput={(e) => setSession('prUrl', e.currentTarget.value)}
          />
        </label>
        <label class="block space-y-2 sm:col-span-2">
          <span class="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Overall summary (optional)
          </span>
          <textarea
            rows={3}
            placeholder="High-level takeaway for the author…"
            class="w-full resize-y rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-violet-500/60 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            value={session.summaryNote}
            onInput={(e) => setSession('summaryNote', e.currentTarget.value)}
          />
        </label>
      </section>

      <div class="flex flex-wrap items-center justify-between gap-3">
        <p class="text-sm text-zinc-500">
          {session.items.filter((i) => i.done).length} / {session.items.length} complete
        </p>
        <button
          type="button"
          class="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm font-medium text-zinc-300 transition hover:border-rose-500/50 hover:bg-rose-950/40 hover:text-rose-200"
          onClick={() => setSession(reconcile(resetSession()))}
        >
          Reset checklist
        </button>
      </div>

      <ul class="space-y-3">
        <For each={session.items}>
          {(item, index) => (
            <li
              class="rounded-2xl border border-zinc-800 bg-zinc-900/35 p-4 sm:p-5"
              data-category={item.category}
            >
              <div class="flex flex-col gap-4 sm:flex-row sm:items-start">
                <label class="flex cursor-pointer items-start gap-3 sm:min-w-0 sm:flex-1">
                  <input
                    type="checkbox"
                    class="mt-1 h-4 w-4 shrink-0 rounded border-zinc-600 bg-zinc-950 text-violet-600 focus:ring-violet-500/40"
                    checked={item.done}
                    onChange={(e) =>
                      setSession('items', index(), 'done', e.currentTarget.checked)
                    }
                  />
                  <span class="min-w-0">
                    <span class="block text-sm font-medium leading-snug text-zinc-100">
                      {item.label}
                    </span>
                    <span
                      class={`mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${categoryStyle[item.category]}`}
                    >
                      {categoryLabel[item.category]}
                    </span>
                  </span>
                </label>
                <div class="w-full sm:max-w-md">
                  <label class="block space-y-1.5">
                    <span class="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                      Note
                    </span>
                    <input
                      type="text"
                      placeholder="Finding or question…"
                      class="w-full rounded-lg border border-zinc-800 bg-zinc-950/80 px-2.5 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30"
                      value={item.note}
                      onInput={(e) =>
                        setSession('items', index(), 'note', e.currentTarget.value)
                      }
                    />
                  </label>
                </div>
              </div>
            </li>
          )}
        </For>
      </ul>
    </div>
  )
}
