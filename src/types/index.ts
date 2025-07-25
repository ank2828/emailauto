export interface EmailSummary {
  id: string
  subject: string
  sender: string
  summary: string
  timestamp: string
  url?: string
}

export interface EmailSummaryResponse {
  summaries: EmailSummary[]
} 