'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDateTime } from '@/lib/utils'
import { Summary } from '@/types'
import { ExternalLink, Calendar } from 'lucide-react'

interface SummaryCardProps {
  summary: Summary
  index: number
}

export function SummaryCard({ summary, index }: SummaryCardProps) {
  const handleOpenUrl = () => {
    window.open(summary.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="w-full"
    >
      <Card className="h-full transition-shadow hover:shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg line-clamp-2 flex-1">
              {summary.title}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleOpenUrl}
              className="flex-shrink-0"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="flex items-center gap-2 text-xs">
            <Calendar className="h-3 w-3" />
            {formatDateTime(summary.createdAt)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">
            {summary.summaryText}
          </p>
          <div className="mt-4 pt-3 border-t">
            <p className="text-xs text-muted-foreground truncate">
              {summary.url}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
} 