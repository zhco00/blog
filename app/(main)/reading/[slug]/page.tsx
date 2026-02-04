import { notFound } from 'next/navigation'
import { allReadings } from '@/.content-collections/generated'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const book = allReadings.find((r) => r.slug === slug)

  if (!book) {
    return {
      title: 'Book Not Found',
    }
  }

  return {
    title: `${book.title} - ${book.author}`,
    description: book.title,
  }
}

export async function generateStaticParams() {
  return allReadings.map((book) => ({
    slug: book.slug,
  }))
}

export default async function ReadingDetailPage({ params }: PageProps) {
  const { slug } = await params
  const book = allReadings.find((r) => r.slug === slug)

  if (!book) {
    notFound()
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* 메타데이터 */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{book.title}</h1>
        <p className="text-xl text-muted-foreground mb-4">{book.author}</p>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {book.finishedDate && (
            <p>완독: {new Date(book.finishedDate).toLocaleDateString('ko-KR')}</p>
          )}
          {book.rating !== undefined && (
            <p className="flex items-center gap-1">
              평점: <span className="text-yellow-500">{'⭐'.repeat(book.rating)}</span>
            </p>
          )}
          {book.pages && <p>{book.pages}페이지</p>}
        </div>
      </div>

      {/* MDX 콘텐츠 */}
      <div
        className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-primary prose-code:text-primary prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: MDX content is safe
        dangerouslySetInnerHTML={{ __html: book.body }}
      />

      {/* 목록으로 돌아가기 */}
      <div className="mt-12 pt-8 border-t">
        <Link href="/reading">
          <Button variant="ghost">← 독서 목록으로 돌아가기</Button>
        </Link>
      </div>
    </article>
  )
}
