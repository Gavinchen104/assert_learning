import { createMemo, createSignal, For, Show } from 'solid-js'

const DIFF_KEY = 'review-desk-diff-v1'
const NOTES_KEY = 'review-desk-diff-notes-v1'

function loadPair(): [string, string] {
  if (typeof localStorage === 'undefined') return ['', '']
  try {
    return [
      localStorage.getItem(DIFF_KEY) ?? '',
      localStorage.getItem(NOTES_KEY) ?? '',
    ]
  } catch {
    return ['', '']
  }
}

export function Diff() {
  const initial = loadPair()
  const [diff, setDiff] = createSignal(initial[0])
  const [notes, setNotes] = createSignal(initial[1])

  const lines = createMemo(() => {
    const d = diff()
    if (!d) return []
    return d.split(/\n/)
  })

  const persist = () => {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(DIFF_KEY, diff())
    localStorage.setItem(NOTES_KEY, notes())
  }

  const lineCount = createMemo(() => lines().length)
  const charCount = createMemo(() => diff().length)

  return (
    <div class="space-y-8">
      <header class="space-y-2">
        <h1 class="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
          Diff workspace
        </h1>
        <p class="max-w-2xl text-zinc-400">
          Paste a unified diff or a slice of a file. Scan line-by-line and capture notes for
          the author—great for nits that do not belong on a single checklist row.
        </p>
      </header>

      <div class="grid gap-6 lg:grid-cols-2 lg:items-start">
        <section class="space-y-3">
          <div class="flex flex-wrap items-baseline justify-between gap-2">
            <h2 class="text-sm font-semibold text-zinc-200">Patch / snippet</h2>
            <p class="text-xs text-zinc-500">
              {lineCount()} lines · {charCount()} chars
            </p>
          </div>
          <textarea
            class="min-h-[320px] w-full resize-y rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 font-mono text-[13px] leading-relaxed text-zinc-200 placeholder:text-zinc-600 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/25"
            placeholder="Paste diff output or selected lines here…"
            spellcheck={false}
            value={diff()}
            onInput={(e) => {
              setDiff(e.currentTarget.value)
              persist()
            }}
          />
        </section>

        <section class="space-y-3 lg:sticky lg:top-24">
          <h2 class="text-sm font-semibold text-zinc-200">Review notes</h2>
          <textarea
            class="min-h-[200px] w-full resize-y rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 text-sm leading-relaxed text-zinc-200 placeholder:text-zinc-600 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/25"
            placeholder="Summarize blocking issues, questions, and optional improvements…"
            value={notes()}
            onInput={(e) => {
              setNotes(e.currentTarget.value)
              persist()
            }}
          />
          <p class="text-xs text-zinc-500">
            Stored locally with the diff in this browser. Copy into your review tool when
            ready.
          </p>
        </section>
      </div>

      <section class="space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <h2 class="text-sm font-semibold text-zinc-200">Line view</h2>
          <Show when={lines().length > 0}>
            <span class="text-xs text-zinc-500">Scroll for context</span>
          </Show>
        </div>
        <div class="max-h-[480px] overflow-auto rounded-2xl border border-zinc-800 bg-zinc-950/60">
          <Show
            when={lines().length > 0}
            fallback={
              <p class="p-6 text-sm text-zinc-500">
                Nothing to show yet—add a diff on the left to see numbered lines.
              </p>
            }
          >
            <table class="w-full border-collapse text-left font-mono text-[12px]">
              <tbody>
                <For each={lines()}>
                  {(line, i) => (
                    <tr class="border-b border-zinc-800/60 hover:bg-zinc-900/50">
                      <td class="w-12 select-none px-3 py-1 text-right text-zinc-600">
                        {i() + 1}
                      </td>
                      <td
                        class={`whitespace-pre-wrap px-2 py-1 ${
                          line.startsWith('+') && !line.startsWith('+++')
                            ? 'text-emerald-300/95'
                            : line.startsWith('-') && !line.startsWith('---')
                              ? 'text-rose-300/95'
                            : line.startsWith('@@')
                              ? 'text-amber-200/90'
                              : 'text-zinc-300'
                        }`}
                      >
                        {line || ' '}
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </Show>
        </div>
      </section>
    </div>
  )
}
