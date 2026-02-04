import { allReadings } from '@/.content-collections/generated'
import BookCard from '@/components/reading/BookCard'

export const metadata = {
  title: '독서 기록',
  description: '읽은 책과 독서 기록',
}

export default function ReadingPage() {
  const sortedReadings = allReadings.sort((a, b) => {
    if (!a.finishedDate) return 1
    if (!b.finishedDate) return -1
    return new Date(b.finishedDate).getTime() - new Date(a.finishedDate).getTime()
  })

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">독서 기록</h1>
      <p className="text-muted-foreground mb-8">
        제가 읽은 책들과 그 인사이트를 기록합니다.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedReadings.map((book) => (
          <BookCard key={book.slug} book={book} />
        ))}
      </div>

      {sortedReadings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">아직 기록된 책이 없습니다.</p>
        </div>
      )}
    </div>
  )
}
