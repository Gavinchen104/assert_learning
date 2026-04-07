export type ReviewCategory =
  | 'correctness'
  | 'security'
  | 'performance'
  | 'maintainability'
  | 'tests'
  | 'documentation'

export interface ChecklistItem {
  id: string
  label: string
  category: ReviewCategory
  done: boolean
  note: string
}

export interface ReviewSession {
  id: string
  title: string
  prUrl: string
  summaryNote: string
  items: ChecklistItem[]
  updatedAt: string
}

export interface GuidelineSection {
  id: string
  heading: string
  bullets: string[]
}

export interface ReviewGuidelines {
  version: number
  title: string
  sections: GuidelineSection[]
}
