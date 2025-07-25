import { prisma } from '@/lib/db'
import { CreateSummaryRequest, Summary, SummaryFilters } from '@/types'

export class SummaryService {
  static async getAllSummaries(filters?: SummaryFilters): Promise<Summary[]> {
    const where: any = {}

    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {}
      if (filters.startDate) where.createdAt.gte = filters.startDate
      if (filters.endDate) where.createdAt.lte = filters.endDate
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { summaryText: { contains: filters.search, mode: 'insensitive' } },
        { url: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    return prisma.summary.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })
  }

  static async createSummary(data: CreateSummaryRequest): Promise<Summary> {
    return prisma.summary.create({
      data: {
        title: data.title,
        url: data.url,
        summaryText: data.summaryText,
      },
    })
  }

  static async getSummaryById(id: string): Promise<Summary | null> {
    return prisma.summary.findUnique({
      where: { id },
    })
  }

  static async deleteSummary(id: string): Promise<Summary> {
    return prisma.summary.delete({
      where: { id },
    })
  }
} 