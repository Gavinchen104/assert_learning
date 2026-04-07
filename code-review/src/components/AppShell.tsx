import { Link, Outlet, useRouterState } from '@tanstack/solid-router'
import type { ParentComponent } from 'solid-js'

const links = [
  { to: '/', label: 'Home' },
  { to: '/review', label: 'Checklist' },
  { to: '/diff', label: 'Diff notes' },
  { to: '/guidelines', label: 'Guidelines' },
] as const

export const AppShell: ParentComponent = () => {
  const loc = useRouterState({ select: (s) => s.location.pathname })

  return (
    <div class="min-h-dvh flex flex-col">
      <header class="border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-10">
        <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            to="/"
            class="group flex items-center gap-2 text-left font-semibold tracking-tight text-zinc-100"
          >
            <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600/20 text-sm text-violet-300 ring-1 ring-violet-500/30">
              RD
            </span>
            <span class="hidden sm:inline">
              Review Desk
              <span class="block text-xs font-normal text-zinc-500 group-hover:text-zinc-400">
                Structured code reviews
              </span>
            </span>
          </Link>
          <nav class="flex flex-wrap items-center gap-1 sm:gap-2" aria-label="Primary">
            {links.map((l) => (
              <Link
                to={l.to}
                class="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
                activeProps={{
                  class: 'bg-zinc-800 text-zinc-50',
                }}
                inactiveProps={{
                  class: 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200',
                }}
                activeOptions={{ exact: l.to === '/' }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main class="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <Outlet />
      </main>
      <footer class="border-t border-zinc-800/80 py-6 text-center text-xs text-zinc-500">
        Local-only: checklist state is saved in your browser (
        <span class="font-mono text-zinc-400">{loc()}</span>
        )
      </footer>
    </div>
  )
}
