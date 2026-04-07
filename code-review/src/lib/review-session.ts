import { createDefaultChecklist } from './default-checklist'
import type { ReviewSession } from '../types/review'

const STORAGE_KEY = 'review-desk-session-v1'

function randomId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`
}

export function loadSession(): ReviewSession {
  if (typeof localStorage === 'undefined') {
    return emptySession()
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptySession()
    const parsed = JSON.parse(raw) as ReviewSession
    if (!parsed?.items?.length) return emptySession()
    return parsed
  } catch {
    return emptySession()
  }
}

export function saveSession(session: ReviewSession): void {
  if (typeof localStorage === 'undefined') return
  const next: ReviewSession = {
    ...session,
    updatedAt: new Date().toISOString(),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

export function emptySession(): ReviewSession {
  return {
    id: randomId(),
    title: '',
    prUrl: '',
    summaryNote: '',
    items: createDefaultChecklist(),
    updatedAt: new Date().toISOString(),
  }
}

export function resetSession(): ReviewSession {
  const s = emptySession()
  saveSession(s)
  return s
}
