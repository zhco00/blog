'use client'

import { getCategoryColor, getCategoryLabel } from '@/lib/categories'

interface CategoryFilterProps {
  categories: string[]
  currentCategory: string | null
  onCategoryChange: (category: string | null) => void
}

export default function CategoryFilter({
  categories,
  currentCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onCategoryChange(null)}
        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${
          currentCategory === null
            ? 'bg-foreground text-background'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
        }`}
      >
        전체
      </button>
      {categories.map((category) => {
        const isActive = currentCategory === category
        const colorClass = getCategoryColor(category)
        return (
          <button
            type="button"
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              isActive
                ? colorClass
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {getCategoryLabel(category)}
          </button>
        )
      })}
    </div>
  )
}
