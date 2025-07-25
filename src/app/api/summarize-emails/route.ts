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
    
    console.log('🚀 Calling n8n webhook:', N8N_WEBHOOK_URL)
    
    // Call your n8n webhook with GET request (since it's a GET webhook)
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any authentication headers your n8n webhook needs
        ...(process.env.N8N_WEBHOOK_SECRET && {
          'Authorization': `Bearer ${process.env.N8N_WEBHOOK_SECRET}`
        })
      }
    })
    
    console.log('📡 Webhook response status:', response.status)
    
    if (!response.ok) {
      throw new Error(`n8n webhook responded with status: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('📦 Raw webhook response:', JSON.stringify(data, null, 2))
    
    // DEBUG: Check for various nested structures
    console.log('🔍 Debugging response structure:')
    console.log('- Is array?', Array.isArray(data))
    console.log('- Has summaries?', data.summaries ? 'YES' : 'NO')
    console.log('- Has emails?', data.emails ? 'YES' : 'NO')
    console.log('- Has data?', data.data ? 'YES' : 'NO')
    console.log('- Has items?', data.items ? 'YES' : 'NO')
    console.log('- Has results?', data.results ? 'YES' : 'NO')
    console.log('- Has messages?', data.messages ? 'YES' : 'NO')
    console.log('- All keys:', Object.keys(data))
    
    // Transform the n8n response to match our expected format
    let transformedData: EmailSummaryResponse
    
    if (Array.isArray(data)) {
      // If response is directly an array of emails
      console.log('📧 Processing array of emails')
      transformedData = {
        summaries: data.map((item: any, index: number) => ({
          id: item.id || item.messageId || `email-${index}-${Date.now()}`,
          subject: item.subject || item.title || item.Subject || 'No Subject',
          sender: item.sender || item.from || item.From || item.fromEmail || 'Unknown Sender',
          summary: item.summary || item.content || item.body || item.Summary || item.emailSummary || 'No summary available',
          timestamp: item.timestamp || item.date || item.time || item.receivedDate || new Date().toLocaleDateString(),
          url: item.url || item.link || item.emailUrl
        }))
      }
    } else if (data.summaries && Array.isArray(data.summaries)) {
      // If response has a 'summaries' property
      console.log('📧 Processing summaries array')
      transformedData = {
        summaries: data.summaries.map((item: any, index: number) => ({
          id: item.id || item.messageId || `email-${index}-${Date.now()}`,
          subject: item.subject || item.title || item.Subject || 'No Subject',
          sender: item.sender || item.from || item.From || item.fromEmail || 'Unknown Sender',
          summary: item.summary || item.content || item.body || item.Summary || item.emailSummary || 'No summary available',
          timestamp: item.timestamp || item.date || item.time || item.receivedDate || new Date().toLocaleDateString(),
          url: item.url || item.link || item.emailUrl
        }))
      }
    } else if (data.emails && Array.isArray(data.emails)) {
      // If response has an 'emails' property
      console.log('📧 Processing emails array')
      transformedData = {
        summaries: data.emails.map((item: any, index: number) => ({
          id: item.id || item.messageId || `email-${index}-${Date.now()}`,
          subject: item.subject || item.title || item.Subject || 'No Subject',
          sender: item.sender || item.from || item.From || item.fromEmail || 'Unknown Sender',
          summary: item.summary || item.content || item.body || item.Summary || item.emailSummary || 'No summary available',
          timestamp: item.timestamp || item.date || item.time || item.receivedDate || new Date().toLocaleDateString(),
          url: item.url || item.link || item.emailUrl
        }))
      }
    } else if (data.data && Array.isArray(data.data)) {
      // If response has a 'data' property
      console.log('📧 Processing data array')
      transformedData = {
        summaries: data.data.map((item: any, index: number) => ({
          id: item.id || item.messageId || `email-${index}-${Date.now()}`,
          subject: item.subject || item.title || item.Subject || 'No Subject',
          sender: item.sender || item.from || item.From || item.fromEmail || 'Unknown Sender',
          summary: item.summary || item.content || item.body || item.Summary || item.emailSummary || 'No summary available',
          timestamp: item.timestamp || item.date || item.time || item.receivedDate || new Date().toLocaleDateString(),
          url: item.url || item.link || item.emailUrl
        }))
      }
    } else if (data.items && Array.isArray(data.items)) {
      // If response has an 'items' property
      console.log('📧 Processing items array')
      transformedData = {
        summaries: data.items.map((item: any, index: number) => ({
          id: item.id || item.messageId || `email-${index}-${Date.now()}`,
          subject: item.subject || item.title || item.Subject || 'No Subject',
          sender: item.sender || item.from || item.From || item.fromEmail || 'Unknown Sender',
          summary: item.summary || item.content || item.body || item.Summary || item.emailSummary || 'No summary available',
          timestamp: item.timestamp || item.date || item.time || item.receivedDate || new Date().toLocaleDateString(),
          url: item.url || item.link || item.emailUrl
        }))
      }
    } else if (data.results && Array.isArray(data.results)) {
      // If response has a 'results' property
      console.log('📧 Processing results array')
      transformedData = {
        summaries: data.results.map((item: any, index: number) => ({
          id: item.id || item.messageId || `email-${index}-${Date.now()}`,
          subject: item.subject || item.title || item.Subject || 'No Subject',
          sender: item.sender || item.from || item.From || item.fromEmail || 'Unknown Sender',
          summary: item.summary || item.content || item.body || item.Summary || item.emailSummary || 'No summary available',
          timestamp: item.timestamp || item.date || item.time || item.receivedDate || new Date().toLocaleDateString(),
          url: item.url || item.link || item.emailUrl
        }))
      }
    } else if (data.messages && Array.isArray(data.messages)) {
      // If response has a 'messages' property
      console.log('📧 Processing messages array')
      transformedData = {
        summaries: data.messages.map((item: any, index: number) => ({
          id: item.id || item.messageId || `email-${index}-${Date.now()}`,
          subject: item.subject || item.title || item.Subject || 'No Subject',
          sender: item.sender || item.from || item.From || item.fromEmail || 'Unknown Sender',
          summary: item.summary || item.content || item.body || item.Summary || item.emailSummary || 'No summary available',
          timestamp: item.timestamp || item.date || item.time || item.receivedDate || new Date().toLocaleDateString(),
          url: item.url || item.link || item.emailUrl
        }))
      }
    } else {
      // If it's a single email object, wrap it in an array
      console.log('📧 Processing single email object')
      console.log('⚠️  WARNING: Only found 1 email! Check your n8n workflow configuration.')
      transformedData = {
        summaries: [{
          id: data.id || data.messageId || `email-single-${Date.now()}`,
          subject: data.subject || data.title || data.Subject || 'No Subject',
          sender: data.sender || data.from || data.From || data.fromEmail || 'Unknown Sender',
          summary: data.summary || data.content || data.body || data.Summary || data.emailSummary || 'No summary available',
          timestamp: data.timestamp || data.date || data.time || data.receivedDate || new Date().toLocaleDateString(),
          url: data.url || data.link || data.emailUrl
        }]
      }
    }
    
    console.log('✅ Transformed data:', JSON.stringify(transformedData, null, 2))
    console.log(`📊 Found ${transformedData.summaries.length} email summaries`)
    
    return NextResponse.json(transformedData)
    
  } catch (error) {
    console.error('❌ Error calling n8n webhook:', error)
    
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
    
    console.log('🔄 Returning mock data due to error')
    return NextResponse.json(mockData)
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
} 