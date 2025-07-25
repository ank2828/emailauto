import { NextRequest, NextResponse } from 'next/server'

interface EmailSummaryResponse {
  summaries: {
    id: string
    subject: string
    sender: string
    summary: string
    timestamp: string
    url?: string
  }[]
}

export async function POST(request: NextRequest) {
  try {
    // Your production n8n webhook URL
    const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'https://thunderbird-labs.app.n8n.cloud/webhook/a1689cc2-ecbd-4367-880f-b6d7083e93d0'
    
    // Call your n8n webhook
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any authentication headers your n8n webhook needs
        ...(process.env.N8N_WEBHOOK_SECRET && {
          'Authorization': `Bearer ${process.env.N8N_WEBHOOK_SECRET}`
        })
      },
      body: JSON.stringify({
        action: 'summarize_latest_emails',
        timestamp: new Date().toISOString()
      })
    })
    
    if (!response.ok) {
      throw new Error(`n8n webhook responded with status: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Transform the n8n response to match our expected format
    // Adjust this based on the actual structure your n8n webhook returns
    const transformedData: EmailSummaryResponse = {
      summaries: Array.isArray(data) ? data.map((item: any, index: number) => ({
        id: item.id || `email-${index}`,
        subject: item.subject || item.title || 'No Subject',
        sender: item.sender || item.from || 'Unknown Sender',
        summary: item.summary || item.content || item.body || 'No summary available',
        timestamp: item.timestamp || item.date || new Date().toLocaleDateString(),
        url: item.url || item.link
      })) : data.summaries || []
    }
    
    return NextResponse.json(transformedData)
    
  } catch (error) {
    console.error('Error calling n8n webhook:', error)
    
    // Return mock data for development/testing
    const mockData: EmailSummaryResponse = {
      summaries: [
        {
          id: 'mock-1',
          subject: 'Important Meeting Tomorrow',
          sender: 'john@company.com',
          summary: 'Team meeting scheduled for 2 PM tomorrow to discuss Q4 planning. Please prepare your department updates and budget proposals.',
          timestamp: '2 hours ago',
          url: 'https://mail.google.com/mail/u/0/#inbox/123'
        },
        {
          id: 'mock-2',
          subject: 'Project Update - API Integration',
          sender: 'sarah@dev-team.com',
          summary: 'The new API integration is complete and ready for testing. All endpoints are documented and the staging environment is live.',
          timestamp: '4 hours ago'
        },
        {
          id: 'mock-3',
          subject: 'Invoice #2024-001 Due',
          sender: 'billing@service.com',
          summary: 'Monthly subscription invoice is due in 3 days. Auto-payment is set up but please verify your payment method is current.',
          timestamp: '1 day ago',
          url: 'https://billing.service.com/invoice/2024-001'
        }
      ]
    }
    
    // In development, return mock data. In production, return error
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json(mockData)
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch email summaries' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
} 