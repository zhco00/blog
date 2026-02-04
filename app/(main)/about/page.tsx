export const metadata = {
  title: '소개',
  description: 'AI 자동화 블로그 소개',
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">소개</h1>

      <div className="prose prose-lg max-w-none">
        <h2>AI 자동화 블로그란?</h2>
        <p>
          개인 블로그와 AI 자동 콘텐츠를 결합한 차세대 플랫폼입니다. 수동으로 작성하는 포스트와
          AI가 자동으로 생성하는 콘텐츠를 함께 제공합니다.
        </p>

        <h2>주요 기능</h2>
        <ul>
          <li>
            <strong>수동 포스팅</strong>: 독서 기록, 개인 이야기 등 직접 작성한 콘텐츠
          </li>
          <li>
            <strong>AI 자동 포스팅</strong>: 매일 개발 팁, 주간 GitHub 트렌딩 분석 등
          </li>
          <li>
            <strong>인터랙티브 AI 기능</strong>: 3줄 요약, 관련 포스트 추천 (추후 구현)
          </li>
        </ul>

        <h2>기술 스택</h2>
        <ul>
          <li>Next.js 15 (App Router)</li>
          <li>React 19</li>
          <li>TypeScript</li>
          <li>Tailwind CSS</li>
          <li>Content Collections (MDX)</li>
          <li>Anthropic Claude API</li>
        </ul>

        <h2>연락처</h2>
        <p>
          궁금한 점이 있으시면 언제든지 연락주세요.
        </p>
      </div>
    </div>
  )
}
