import { NextRequest, NextResponse } from 'next/server'
import { SummaryService } from '@/services/summaryService'
import { CreateSummaryRequest, SummaryFilters } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters: SummaryFilters = {}
    
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const search = searchParams.get('search')
    
    if (startDate) filters.startDate = new Date(startDate)
    if (endDate) filters.endDate = new Date(endDate)
    if (search) filters.search = search
    
    const summaries = await SummaryService.getAllSummaries(filters)
    
    return NextResponse.json({ summaries })
  } catch (error) {
    console.error('Error fetching summaries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch summaries' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateSummaryRequest = await request.json()
    
    if (!body.title || !body.url || !body.summaryText) {
      return NextResponse.json(
        { error: 'Missing required fields: title, url, summaryText' },
        { status: 400 }
      )
    }
    
    const summary = await SummaryService.createSummary(body)
    
    return NextResponse.json({ summary }, { status: 201 })
  } catch (error) {
    console.error('Error creating summary:', error)
    return NextResponse.json(
      { error: 'Failed to create summary' },
      { status: 500 }
    )
  }
} 