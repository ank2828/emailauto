export interface Summary {
  id: string
  title: string
  url: string
  summaryText: string
  createdAt: Date
  updatedAt: Date
  userId?: string | null
}

export interface CreateSummaryRequest {
  title: string
  url: string
  summaryText: string
}

export interface WebhookPayload {
  title: string
  url: string
  summaryText: string
  secret: string
}

export interface SummaryFilters {
  startDate?: Date
  endDate?: Date
  search?: string
} 