"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { 
  searchHabits, 
  CATEGORIES,
  type HabitSuggestion 
} from "@/lib/habitSuggestions"

interface HabitSearchProps {
  onSelect: (habit: HabitSuggestion) => void
  placeholder?: string
}

export function HabitSearch({ onSelect, placeholder = "Search for habits..." }: HabitSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<HabitSuggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (query.trim()) {
      const matchedResults = searchHabits(query)
      setResults(matchedResults)
      setIsOpen(matchedResults.length > 0)
      setHighlightedIndex(-1)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }, [query])

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Arrow down
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlightedIndex(prev => 
        prev < results.length - 1 ? prev + 1 : prev
      )
    }
    
    // Arrow up
    if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0)
    }
    
    // Enter
    if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault()
      handleSelect(results[highlightedIndex])
    }
    
    // Escape
    if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  const handleSelect = (habit: HabitSuggestion) => {
    onSelect(habit)
    setQuery("")
    setIsOpen(false)
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          className="w-full pr-8"
        />
        {query ? (
          <X
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600"
            onClick={() => setQuery("")}
          />
        ) : (
          <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        )}
      </div>

      {isOpen && (
        <div 
          ref={resultsRef}
          className="absolute z-10 w-full mt-1 max-h-60 overflow-auto rounded-md bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="p-2 text-xs text-gray-500 dark:text-gray-400">
            {results.length} matching habits
          </div>
          
          {results.map((habit, index) => {
            const category = CATEGORIES[habit.category]
            const isHighlighted = index === highlightedIndex
            
            return (
              <div
                key={habit.name}
                onClick={() => handleSelect(habit)}
                className={`p-2 cursor-pointer flex flex-col gap-1 ${
                  isHighlighted ? 'bg-gray-100 dark:bg-gray-700' : ''
                } hover:bg-gray-100 dark:hover:bg-gray-700`}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {category.emoji} {habit.name}
                  </span>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                
                {habit.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {habit.description}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-1 mt-1">
                  <Badge className={`${category.color} bg-opacity-20`}>
                    {category.label}
                  </Badge>
                  
                  {habit.difficulty && (
                    <Badge variant="outline" className="text-xs">
                      {habit.difficulty === 'easy' && '⭐ Easy'}
                      {habit.difficulty === 'medium' && '⭐⭐ Medium'}
                      {habit.difficulty === 'hard' && '⭐⭐⭐ Hard'}
                    </Badge>
                  )}
                </div>
                
                {habit.replacementFor && (
                  <div className="text-xs text-emerald-600 dark:text-emerald-400">
                    Replacement for: {habit.replacementFor}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
