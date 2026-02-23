import Link from 'next/link'

const CATEGORIES = [
  { key: 'ai', label: 'AI 칼럼' },
  { key: 'tech', label: '기술' },
  { key: 'reading', label: '독서' },
  { key: 'manual', label: '일상' },
]

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50 dark:bg-background mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold mb-2">AI 블로그</h3>
            <p className="text-sm text-muted-foreground">
              AI가 매일 새로운 인사이트를 전합니다
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-2">카테고리</h3>
            <ul className="space-y-1 text-sm">
              {CATEGORIES.map((cat) => (
                <li key={cat.key}>
                  <Link
                    href={`/blog?category=${cat.key}`}
                    className="text-muted-foreground hover:text-primary"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © 2026 AI 블로그. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
