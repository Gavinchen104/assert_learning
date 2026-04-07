import type { ChecklistItem } from '../types/review'

const mk = (
  id: string,
  label: string,
  category: ChecklistItem['category'],
): ChecklistItem => ({
  id,
  label,
  category,
  done: false,
  note: '',
})

/** Starter checklist — edit in the UI and persist to local storage. */
export function createDefaultChecklist(): ChecklistItem[] {
  return [
    mk('c1', 'Change matches stated intent and ticket scope', 'correctness'),
    mk('c2', 'Error paths and edge cases considered', 'correctness'),
    mk('s1', 'No secrets, tokens, or PII in code or logs', 'security'),
    mk('s2', 'Auth / permissions enforced for new surfaces', 'security'),
    mk('p1', 'Hot paths avoid unnecessary work (I/O, allocations)', 'performance'),
    mk('p2', 'N+1 queries, large payloads, and caching considered', 'performance'),
    mk('m1', 'Naming, structure, and boundaries are clear', 'maintainability'),
    mk('m2', 'Complex logic has comments or is split for readability', 'maintainability'),
    mk('t1', 'Tests updated or added where behavior changed', 'tests'),
    mk('t2', 'Flaky patterns avoided; async tested realistically', 'tests'),
    mk('d1', 'Public API / user-facing copy documented if needed', 'documentation'),
    mk('d2', 'Breaking changes called out with migration notes', 'documentation'),
  ]
}
