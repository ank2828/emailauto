import { NextRequest, NextResponse } from 'next/server'
import { SummaryService } from '@/services/summaryService'
import { WebhookPayload } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body: WebhookPayload = await request.json()
    
    // Verify webhook secret
    const webhookSecret = process.env.WEBHOOK_SECRET
    if (!webhookSecret || body.secret !== webhookSecret) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Validate required fields
    if (!body.title || !body.url || !body.summaryText) {
      return NextResponse.json(
        { error: 'Missing required fields: title, url, summaryText' },
        { status: 400 }
      )
    }
    
    // Create summary (excluding the secret from the data)
    const summary = await SummaryService.createSummary({
      title: body.title,
      url: body.url,
      summaryText: body.summaryText,
    })
    
    return NextResponse.json({ 
      success: true, 
      summary: {
        id: summary.id,
        title: summary.title,
        url: summary.url,
        createdAt: summary.createdAt,
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Only allow POST requests
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
} 