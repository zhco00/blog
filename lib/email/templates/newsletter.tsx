import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components'

interface Post {
  title: string
  summary: string
  url: string
  category: string
  aiGenerated: boolean
}

interface NewsletterEmailProps {
  posts: Post[]
  type: 'daily' | 'weekly'
  unsubscribeUrl: string
}

export default function NewsletterEmail({
  posts,
  type,
  unsubscribeUrl,
}: NewsletterEmailProps) {
  const title = type === 'daily' ? '오늘의 AI 블로그' : '이번 주 AI 블로그'
  const previewText = `${title} - ${posts.length}개의 새 포스트`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>{title}</Heading>
          <Text style={subheading}>
            {type === 'daily' ? '오늘' : '이번 주'} 새로 올라온 포스트를
            확인해보세요!
          </Text>

          <Hr style={hr} />

          {posts.map((post, index) => (
            <Section key={index} style={postSection}>
              <div style={categoryBadge}>
                {post.category}
                {post.aiGenerated && (
                  <span style={aiBadge}> AI</span>
                )}
              </div>
              <Link href={post.url} style={postTitle}>
                {post.title}
              </Link>
              <Text style={postSummary}>{post.summary}</Text>
            </Section>
          ))}

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              이 메일은 AI 블로그 뉴스레터입니다.
            </Text>
            <Link href={unsubscribeUrl} style={unsubscribeLink}>
              구독 취소하기
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
}

const heading = {
  color: '#1a1a1a',
  fontSize: '28px',
  fontWeight: '700',
  textAlign: 'center' as const,
  margin: '0 0 10px',
}

const subheading = {
  color: '#666666',
  fontSize: '16px',
  textAlign: 'center' as const,
  margin: '0 0 30px',
}

const hr = {
  borderColor: '#e6e6e6',
  margin: '20px 0',
}

const postSection = {
  marginBottom: '24px',
}

const categoryBadge = {
  display: 'inline-block',
  backgroundColor: '#f0f0f0',
  color: '#666666',
  fontSize: '12px',
  padding: '4px 8px',
  borderRadius: '4px',
  marginBottom: '8px',
}

const aiBadge = {
  backgroundColor: '#e0e7ff',
  color: '#4f46e5',
  marginLeft: '4px',
  padding: '2px 6px',
  borderRadius: '4px',
}

const postTitle = {
  color: '#1a1a1a',
  fontSize: '18px',
  fontWeight: '600',
  textDecoration: 'none',
  display: 'block',
  marginBottom: '8px',
}

const postSummary = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0',
}

const footer = {
  textAlign: 'center' as const,
  marginTop: '30px',
}

const footerText = {
  color: '#999999',
  fontSize: '12px',
  margin: '0 0 10px',
}

const unsubscribeLink = {
  color: '#666666',
  fontSize: '12px',
  textDecoration: 'underline',
}
