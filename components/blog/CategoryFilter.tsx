'use client'

import { Badge } from '@/components/ui/badge'

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
      <Badge
        variant={currentCategory === null ? 'default' : 'outline'}
        className="cursor-pointer"
        onClick={() => onCategoryChange(null)}
      >
        전체
      </Badge>
      {categories.map((category) => (
        <Badge
          key={category}
          variant={currentCategory === category ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </Badge>
      ))}
    </div>
  )
}
