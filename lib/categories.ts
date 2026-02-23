const CATEGORY_LABELS: Record<string, string> = {
  ai: 'AI 칼럼',
  tech: '기술',
  reading: '독서',
  manual: '일상',
}

const CATEGORY_COLORS: Record<string, string> = {
  ai: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300',
  tech: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  reading: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  manual: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
}

const DEFAULT_COLOR = 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'

export function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] || category
}

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || DEFAULT_COLOR
}
