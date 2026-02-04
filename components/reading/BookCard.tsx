import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Book {
  slug: string
  title: string
  author: string
  finishedDate?: string
  rating?: number
  pages?: number
}

interface BookCardProps {
  book: Book
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <Link href={`/reading/${book.slug}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <CardTitle className="line-clamp-2">{book.title}</CardTitle>
          <CardDescription>{book.author}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            {book.finishedDate && (
              <p>완독: {new Date(book.finishedDate).toLocaleDateString('ko-KR')}</p>
            )}
            {book.rating !== undefined && (
              <div className="flex items-center gap-1">
                <span>평점:</span>
                <span className="text-yellow-500">{'⭐'.repeat(book.rating)}</span>
              </div>
            )}
            {book.pages && <p>{book.pages}페이지</p>}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
