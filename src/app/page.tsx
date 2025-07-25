'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Sparkles, RefreshCw, Clock, ExternalLink } from 'lucide-react'

interface EmailSummary {
  id: string
  subject: string
  sender: string
  summary: string
  timestamp: string
  url?: string
}

export default function EmailHub() {
  const [emailSummaries, setEmailSummaries] = useState<EmailSummary[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSummarizeEmails = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Call your n8n webhook - replace with your actual webhook URL
      const response = await fetch('/api/summarize-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch email summaries')
      }
      
      const data = await response.json()
      setEmailSummaries(data.summaries || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Mail className="h-16 w-16 text-blue-600" />
              <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-purple-500" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Welcome to Your
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Personal Email Hub
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform your inbox chaos into clear, actionable insights. 
            Get AI-powered summaries of your latest emails in seconds.
          </p>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={handleSummarizeEmails}
              disabled={isLoading}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Your Emails...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Summarize Latest Emails
                </>
              )}
            </Button>
          </motion.div>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Email Summaries */}
        {emailSummaries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Your Email Summaries
              </h2>
              <p className="text-gray-600">
                {emailSummaries.length} {emailSummaries.length === 1 ? 'email' : 'emails'} summarized
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {emailSummaries.map((email, index) => (
                <motion.div
                  key={email.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="h-full bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
                          {email.subject}
                        </CardTitle>
                        {email.url && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.open(email.url, '_blank')}
                            className="flex-shrink-0 h-8 w-8"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <CardDescription className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{email.sender}</span>
                      </CardDescription>
                      
                      <CardDescription className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {email.timestamp}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-sm text-gray-700 leading-relaxed line-clamp-4">
                        {email.summary}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {emailSummaries.length === 0 && !isLoading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center py-12"
          >
            <Mail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              Click the button above to get started with your email summaries!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
} 