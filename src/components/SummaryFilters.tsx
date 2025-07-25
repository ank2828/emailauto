'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SummaryFilters as Filters } from '@/types'
import { Search, Calendar, X } from 'lucide-react'

interface SummaryFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  resultsCount: number
}

export function SummaryFilters({ filters, onFiltersChange, resultsCount }: SummaryFiltersProps) {
  const [localSearch, setLocalSearch] = useState(filters.search || '')

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFiltersChange({ ...filters, search: localSearch || undefined })
  }

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value ? new Date(value) : undefined,
    })
  }

  const clearFilters = () => {
    setLocalSearch('')
    onFiltersChange({})
  }

  const hasActiveFilters = filters.search || filters.startDate || filters.endDate

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm">Filters</h3>
            <span className="text-xs text-muted-foreground">
              {resultsCount} {resultsCount === 1 ? 'result' : 'results'}
            </span>
          </div>
          
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search summaries..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button type="submit" variant="secondary">
              Search
            </Button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Start Date
              </label>
              <Input
                type="date"
                value={filters.startDate ? filters.startDate.toISOString().split('T')[0] : ''}
                onChange={(e) => handleDateChange('startDate', e.target.value)}
                className="text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                End Date
              </label>
              <Input
                type="date"
                value={filters.endDate ? filters.endDate.toISOString().split('T')[0] : ''}
                onChange={(e) => handleDateChange('endDate', e.target.value)}
                className="text-sm"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="self-start"
            >
              <X className="h-3 w-3 mr-1" />
              Clear Filters
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 