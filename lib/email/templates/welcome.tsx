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

interface WelcomeEmailProps {
  blogUrl: string
  unsubscribeUrl: string
}

export default function WelcomeEmail({
  blogUrl,
  unsubscribeUrl,
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>AI 블로그 뉴스레터 구독을 환영합니다!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>환영합니다! 🎉</Heading>

          <Text style={paragraph}>
            AI 블로그 뉴스레터 구독을 신청해 주셔서 감사합니다.
          </Text>

          <Text style={paragraph}>
            앞으로 다음과 같은 콘텐츠를 받아보실 수 있습니다:
          </Text>

          <Section style={listSection}>
            <Text style={listItem}>📝 개발 팁 & 트릭</Text>
            <Text style={listItem}>🔥 GitHub 트렌딩 프로젝트</Text>
            <Text style={listItem}>💡 Stack Overflow 인기 Q&A</Text>
            <Text style={listItem}>📚 독서 기록 & 리뷰</Text>
          </Section>

          <Section style={buttonSection}>
            <Link href={blogUrl} style={button}>
              블로그 방문하기
            </Link>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              언제든지 아래 링크를 통해 구독을 취소하실 수 있습니다.
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
  fontSize: '32px',
  fontWeight: '700',
  textAlign: 'center' as const,
  margin: '0 0 30px',
}

const paragraph = {
  color: '#444444',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px',
}

const listSection = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
}

const listItem = {
  color: '#444444',
  fontSize: '15px',
  margin: '8px 0',
}

const buttonSection = {
  textAlign: 'center' as const,
  margin: '30px 0',
}

const button = {
  backgroundColor: '#4f46e5',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  padding: '12px 24px',
  display: 'inline-block',
}

const hr = {
  borderColor: '#e6e6e6',
  margin: '30px 0 20px',
}

const footer = {
  textAlign: 'center' as const,
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
