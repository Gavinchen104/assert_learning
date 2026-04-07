import { useQuery } from '@tanstack/solid-query'
import { For, Show } from 'solid-js'
import type { ReviewGuidelines } from '../types/review'

async function fetchGuidelines(): Promise<ReviewGuidelines> {
  const res = await fetch('/review-guidelines.json')
  if (!res.ok) throw new Error(`Failed to load guidelines (${res.status})`)
  return res.json() as Promise<ReviewGuidelines>
}

export function Guidelines() {
  const q = useQuery(() => ({
    queryKey: ['review-guidelines'],
    queryFn: fetchGuidelines,
    staleTime: 1000 * 60 * 30,
  }))

  return (
    <div class="space-y-8">
      <header class="space-y-2">
        <h1 class="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
          Review guidelines
        </h1>
        <p class="max-w-2xl text-zinc-400">
          Loaded with TanStack Query from{' '}
          <code class="rounded-md bg-zinc-800 px-1.5 py-0.5 font-mono text-sm text-zinc-300">
            /review-guidelines.json
          </code>
          . Replace that file to match your team’s norms.
        </p>
      </header>

      <Show when={q.isPending}>
        <p class="text-sm text-zinc-500">Loading guidelines…</p>
      </Show>

      <Show when={q.isError}>
        <div
          class="rounded-2xl border border-rose-500/30 bg-rose-950/40 px-4 py-3 text-sm text-rose-200"
          role="alert"
        >
          {q.error instanceof Error ? q.error.message : 'Could not load guidelines.'}
        </div>
      </Show>

      <Show when={q.data}>
        {(data) => (
          <div class="space-y-6">
            <h2 class="text-lg font-semibold text-zinc-100">{data().title}</h2>
            <ul class="space-y-6">
              <For each={data().sections}>
                {(section) => (
                  <li class="rounded-2xl border border-zinc-800 bg-zinc-900/35 p-5 sm:p-6">
                    <h3 class="text-base font-semibold text-zinc-100">{section.heading}</h3>
                    <ul class="mt-4 list-disc space-y-2 pl-5 text-sm text-zinc-300">
                      <For each={section.bullets}>{(b) => <li>{b}</li>}</For>
                    </ul>
                  </li>
                )}
              </For>
            </ul>
          </div>
        )}
      </Show>
    </div>
  )
}
