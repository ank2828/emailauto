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

// Helper function to create proper timestamp - prioritize Supabase created_at
const getTimestamp = (item: any) => {
  // Prioritize Supabase created_at field and common email timestamp fields
  return item.created_at || 
         item.createdAt || 
         item.timestamp || 
         item.date || 
         item.time || 
         item.receivedDate || 
         item.sent_at ||
         item.sentAt ||
         item.email_date ||
         item.emailDate ||
         new Date().toISOString()
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

    // Handle empty responses
    const responseText = await response.text()
    console.log('📦 Raw webhook response text:', responseText)
    
    if (!responseText || responseText.trim() === '') {
      console.log('📭 Empty response from webhook - no emails to summarize')
      return NextResponse.json({ summaries: [] })
    }
    
    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.log('❌ JSON parse error:', parseError)
      console.log('📭 Invalid JSON response - treating as no emails to summarize')
      return NextResponse.json({ summaries: [] })
    }
    
    console.log('📦 Parsed webhook response:', JSON.stringify(data, null, 2))
    
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
      if (data.length === 0) {
        console.log('📭 Empty array - no emails to summarize')
        return NextResponse.json({ summaries: [] })
      }
      console.log('📧 Processing array of emails')
      transformedData = {
        summaries: data.map((item: any, index: number) => ({
          id: item.id || item.messageId || `email-${index}-${Date.now()}`,
          subject: item.subject || item.title || item.Subject || 'No Subject',
          sender: item.sender || item.from || item.From || item.fromEmail || 'Unknown Sender',
          summary: item.summary || item.content || item.body || item.Summary || item.emailSummary || 'No summary available',
          timestamp: getTimestamp(item),
          url: item.url || item.link || item.emailUrl
        }))
      }
    } else if (data.summaries && Array.isArray(data.summaries)) {
      // If response has a 'summaries' property
      if (data.summaries.length === 0) {
        console.log('📭 Empty summaries array - no emails to summarize')
        return NextResponse.json({ summaries: [] })
      }
      console.log('📧 Processing summaries array')
      transformedData = {
        summaries: data.summaries.map((item: any, index: number) => ({
          id: item.id || item.messageId || `email-${index}-${Date.now()}`,
          subject: item.subject || item.title || item.Subject || 'No Subject',
          sender: item.sender || item.from || item.From || item.fromEmail || 'Unknown Sender',
          summary: item.summary || item.content || item.body || item.Summary || item.emailSummary || 'No summary available',
          timestamp: getTimestamp(item),
          url: item.url || item.link || item.emailUrl
        }))
      }
    } else if (data.emails && Array.isArray(data.emails)) {
      // If response has an 'emails' property
      if (data.emails.length === 0) {
        console.log('📭 Empty emails array - no emails to summarize')
        return NextResponse.json({ summaries: [] })
      }
      console.log('📧 Processing emails array')
      transformedData = {
        summaries: data.emails.map((item: any, index: number) => ({
          id: item.id || item.messageId || `email-${index}-${Date.now()}`,
          subject: item.subject || item.title || item.Subject || 'No Subject',
          sender: item.sender || item.from || item.From || item.fromEmail || 'Unknown Sender',
          summary: item.summary || item.content || item.body || item.Summary || item.emailSummary || 'No summary available',
          timestamp: getTimestamp(item),
          url: item.url || item.link || item.emailUrl
        }))
      }
    } else if (data.data && Array.isArray(data.data)) {
      // If response has a 'data' property
      if (data.data.length === 0) {
        console.log('📭 Empty data array - no emails to summarize')
        return NextResponse.json({ summaries: [] })
      }
      console.log('📧 Processing data array')
      transformedData = {
        summaries: data.data.map((item: any, index: number) => ({
          id: item.id || item.messageId || `email-${index}-${Date.now()}`,
          subject: item.subject || item.title || item.Subject || 'No Subject',
          sender: item.sender || item.from || item.From || item.fromEmail || 'Unknown Sender',
          summary: item.summary || item.content || item.body || item.Summary || item.emailSummary || 'No summary available',
          timestamp: getTimestamp(item),
          url: item.url || item.link || item.emailUrl
        }))
      }
    } else if (data.items && Array.isArray(data.items)) {
      // If response has an 'items' property
      if (data.items.length === 0) {
        console.log('📭 Empty items array - no emails to summarize')
        return NextResponse.json({ summaries: [] })
      }
      console.log('📧 Processing items array')
      transformedData = {
        summaries: data.items.map((item: any, index: number) => ({
          id: item.id || item.messageId || `email-${index}-${Date.now()}`,
          subject: item.subject || item.title || item.Subject || 'No Subject',
          sender: item.sender || item.from || item.From || item.fromEmail || 'Unknown Sender',
          summary: item.summary || item.content || item.body || item.Summary || item.emailSummary || 'No summary available',
          timestamp: getTimestamp(item),
          url: item.url || item.link || item.emailUrl
        }))
      }
    } else if (data.results && Array.isArray(data.results)) {
      // If response has a 'results' property
      if (data.results.length === 0) {
        console.log('📭 Empty results array - no emails to summarize')
        return NextResponse.json({ summaries: [] })
      }
      console.log('📧 Processing results array')
      transformedData = {
        summaries: data.results.map((item: any, index: number) => ({
          id: item.id || item.messageId || `email-${index}-${Date.now()}`,
          subject: item.subject || item.title || item.Subject || 'No Subject',
          sender: item.sender || item.from || item.From || item.fromEmail || 'Unknown Sender',
          summary: item.summary || item.content || item.body || item.Summary || item.emailSummary || 'No summary available',
          timestamp: getTimestamp(item),
          url: item.url || item.link || item.emailUrl
        }))
      }
    } else if (data.messages && Array.isArray(data.messages)) {
      // If response has a 'messages' property
      if (data.messages.length === 0) {
        console.log('📭 Empty messages array - no emails to summarize')
        return NextResponse.json({ summaries: [] })
      }
      console.log('📧 Processing messages array')
      transformedData = {
        summaries: data.messages.map((item: any, index: number) => ({
          id: item.id || item.messageId || `email-${index}-${Date.now()}`,
          subject: item.subject || item.title || item.Subject || 'No Subject',
          sender: item.sender || item.from || item.From || item.fromEmail || 'Unknown Sender',
          summary: item.summary || item.content || item.body || item.Summary || item.emailSummary || 'No summary available',
          timestamp: getTimestamp(item),
          url: item.url || item.link || item.emailUrl
        }))
      }
    } else if (data && typeof data === 'object' && data.from && data.subject) {
      // If it's a single email object, wrap it in an array
      console.log('📧 Processing single email object')
      transformedData = {
        summaries: [{
          id: data.id || data.messageId || `email-single-${Date.now()}`,
          subject: data.subject || data.title || data.Subject || 'No Subject',
          sender: data.sender || data.from || data.From || data.fromEmail || 'Unknown Sender',
          summary: data.summary || data.content || data.body || data.Summary || data.emailSummary || 'No summary available',
          timestamp: getTimestamp(data),
          url: data.url || data.link || data.emailUrl
        }]
      }
    } else {
      // If we can't recognize the format, assume no emails
      console.log('📭 Unrecognized response format - treating as no emails to summarize')
      return NextResponse.json({ summaries: [] })
    }
    
    console.log('✅ Transformed data:', JSON.stringify(transformedData, null, 2))
    console.log(`📊 Found ${transformedData.summaries.length} email summaries`)
    
    return NextResponse.json(transformedData)
    
  } catch (error) {
    console.error('❌ Error calling n8n webhook:', error)
    
    // Return empty array instead of mock data
    console.log('📭 Returning empty array due to error')
    return NextResponse.json({ summaries: [] })
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
} 