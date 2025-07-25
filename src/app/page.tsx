'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { motion } from 'framer-motion'
import { SummaryCard } from '@/components/SummaryCard'
import { SummaryFilters } from '@/components/SummaryFilters'
import { Button } from '@/components/ui/button'
import { Summary, SummaryFilters as Filters } from '@/types'
import { RefreshCw, FileText } from 'lucide-react'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function buildQueryString(filters: Filters): string {
  const params = new URLSearchParams()
  
  if (filters.startDate) {
    params.append('startDate', filters.startDate.toISOString())
  }
  if (filters.endDate) {
    params.append('endDate', filters.endDate.toISOString())
  }
  if (filters.search) {
    params.append('search', filters.search)
  }
  
  return params.toString()
}

export default function Dashboard() {
  const [filters, setFilters] = useState<Filters>({})
  
  const queryString = buildQueryString(filters)
  const apiUrl = `/api/summaries${queryString ? `?${queryString}` : ''}`
  
  const { data, error, isLoading, mutate } = useSWR(apiUrl, fetcher)
  
  const summaries: Summary[] = data?.summaries || []

  const handleRefresh = () => {
    mutate()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">
                Summary Dashboard
              </h1>
            </div>
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          <p className="text-muted-foreground">
            Manage and view your content summaries
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <SummaryFilters
                filters={filters}
                onFiltersChange={setFilters}
                resultsCount={summaries.length}
              />
            </motion.div>
          </div>

          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-muted rounded-lg h-48"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-destructive text-lg mb-2">
                  Failed to load summaries
                </p>
                <p className="text-muted-foreground mb-4">
                  Please try refreshing the page
                </p>
                <Button onClick={handleRefresh}>
                  Try Again
                </Button>
              </motion.div>
            ) : summaries.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">
                  No summaries found
                </p>
                <p className="text-muted-foreground">
                  {Object.keys(filters).length > 0
                    ? 'Try adjusting your filters or create your first summary.'
                    : 'Summaries will appear here when added via webhook or API.'}
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {summaries.map((summary, index) => (
                  <SummaryCard
                    key={summary.id}
                    summary={summary}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 