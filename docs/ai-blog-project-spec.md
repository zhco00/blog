# AI 자동화 블로그 프로젝트 전체 정리 (CLI용)

## 프로젝트 개요

### 목적
- **주 목적**: 개인 기록 블로그 + AI 기술 체험/학습
- 개인 블로그 + AI 자동화 콘텐츠 플랫폼
- 구글 애드센스 수익화 옵션 (추후 고려)
- 수동 포스팅(독서, 개인 이야기) + AI 자동 포스팅(기술 트렌드 등) 혼합

### 핵심 차별점
- AI가 매일/매주 자동으로 콘텐츠 생성
- 인터랙티브 AI 기능 (코드 리뷰, 챗봇 등)
- 완전 자동화된 배포 시스템

---

## 핵심 기능

### 1. 콘텐츠 카테고리
```
[독서 기록] (수동 작성)
[내 이야기/일상] (수동 작성)
[AI 자동 포스팅]
   - 매일: 5분 개발 팁
   - 주간: GitHub 트렌딩 저장소 분석
   - 주간: Stack Overflow Q&A 정리 (CC BY-SA 4.0, 출처/원본링크/작성자 명시 필수)
   - 기술 릴리즈 노트 분석 (Next.js, React 등)
   - 월간: 내 독서/업무 데이터 인사이트
```

### 2. 블로그 기본 기능
- 메인 페이지 (최신 포스트 미리보기)
- 포스트 목록 (필터링, 검색, 카테고리)
- 포스트 상세 (조회수, 좋아요, 공유)
- 댓글 시스템
- SEO 최적화 (메타태그, sitemap, robots.txt)
- 반응형 디자인
- 구글 애드센스 통합

### 3. 포스팅 방식
**초간단 모달 방식 (헤더에 숨김 버튼)**
```
헤더의 숨겨진 글쓰기 버튼 클릭
  ↓
비밀번호 입력
  ↓
에디터 화면 (제목, 카테고리, 태그, 마크다운 작성)
  ↓
발행 버튼 → 자동으로 MDX 생성 + Git Push
  ↓
Vercel 자동 배포 (1-2분)
```

### 4. AI 인터랙티브 기능
- **3줄 요약**: 긴 포스트 자동 요약
- **관련 포스트 추천**: AI가 유사 포스트 찾아줌

> 참고: AI 기능별 토큰 한도를 설정하여 비용 관리

### 5. 자동화 시스템
- **매일 오전 9시**: 개발 팁 자동 생성
- **매주 월요일**: GitHub 트렌딩 분석
- **매일**: 간단한 뉴스레터 발송 (구독자용)
- **매주 일요일**: 주간 종합 뉴스레터 발송
- **수시**: 기술 릴리즈 감지 시 자동 포스트

> 참고: 월간 통계 포스트는 데이터 축적 후 추후 추가 예정

---

## 기술 스택

### Frontend & Framework
```
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Hooks
```

### Content Management
```
- Contentlayer (MDX 처리 + 타입 안전성)
- Gray Matter (프론트매터 파싱)
- MDX (마크다운 + React 컴포넌트)
- @uiw/react-md-editor (에디터)
```

### Database
```
- Vercel Postgres (또는 Supabase)
  → 댓글, 구독자, 조회수, AI 로그 저장
```

### AI & Automation
```
- Anthropic Claude API (Sonnet 4)
- GitHub Actions (Cron Jobs)
- Rate Limiting (IP 기반 + 기능별 토큰 한도)
- AI 발행 알림 (Discord Webhook / Slack / Email 중 택1)
```

### Deployment & Hosting
```
- Vercel (자동 배포 + 무료 호스팅)
- GitHub (코드 저장 + CI/CD 트리거)
```

### Email
```
- Resend (뉴스레터 발송)
```

### Analytics & Ads
```
- Google Analytics 4
- Google AdSense
- Vercel Analytics
```

---

## 폴더 구조

```
my-ai-blog/
├── app/
│   ├── (main)/
│   │   ├── page.tsx                     # 메인 페이지
│   │   ├── blog/
│   │   │   ├── page.tsx                 # 포스트 목록
│   │   │   ├── [slug]/page.tsx          # 포스트 상세
│   │   │   └── category/[cat]/page.tsx  # 카테고리별
│   │   ├── reading/
│   │   │   ├── page.tsx                 # 독서 목록
│   │   │   └── [slug]/page.tsx          # 책 리뷰 상세
│   │   ├── ai-lab/                      # AI 실험 로그
│   │   ├── about/                       # 소개
│   │   └── layout.tsx
│   │
│   ├── admin/                           # 관리자 페이지
│   │   ├── layout.tsx                   # 관리자 레이아웃
│   │   ├── login/page.tsx               # 로그인
│   │   ├── dashboard/page.tsx           # 대시보드
│   │   ├── posts/
│   │   │   ├── page.tsx                 # 포스트 관리
│   │   │   └── [slug]/edit/page.tsx     # 포스트 수정
│   │   ├── comments/page.tsx            # 댓글 관리
│   │   ├── subscribers/page.tsx         # 구독자 관리
│   │   ├── analytics/page.tsx           # 상세 통계
│   │   └── ai-logs/page.tsx             # AI 로그
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   ├── verify/route.ts          # 비밀번호 확인
│   │   │   ├── login/route.ts           # 관리자 로그인
│   │   │   └── logout/route.ts          # 로그아웃
│   │   ├── posts/
│   │   │   ├── route.ts                 # 포스트 목록
│   │   │   ├── [slug]/route.ts          # CRUD
│   │   │   └── create/route.ts          # 포스트 생성
│   │   ├── admin/
│   │   │   ├── stats/route.ts           # 통계
│   │   │   ├── comments/
│   │   │   │   ├── route.ts             # 댓글 목록
│   │   │   │   └── [id]/route.ts        # 댓글 삭제/승인
│   │   │   ├── posts/route.ts           # 포스트 관리
│   │   │   ├── subscribers/route.ts     # 구독자 관리
│   │   │   └── ai-logs/route.ts         # AI 로그
│   │   ├── ai/
│   │   │   ├── summarize/route.ts       # 요약
│   │   │   └── related/route.ts         # 관련 포스트 추천
│   │   ├── analytics/
│   │   │   ├── view/[slug]/route.ts     # 조회수
│   │   │   └── like/[slug]/route.ts     # 좋아요
│   │   ├── newsletter/
│   │   │   ├── subscribe/route.ts
│   │   │   ├── send-daily/route.ts      # 매일 발송
│   │   │   └── send-weekly/route.ts     # 주간 발송
│   │   └── upload/route.ts              # 이미지 업로드
│   │
│   └── layout.tsx
│
├── content/
│   ├── posts/
│   │   ├── manual/                      # 수동 작성
│   │   │   └── 2024-01-15-my-story.mdx
│   │   └── ai-generated/                # AI 자동 생성
│   │       ├── daily-tips/
│   │       │   └── 2024-01-15-tip.mdx
│   │       ├── github-trends/
│   │       │   └── 2024-w03-trends.mdx
│   │       └── tech-news/
│   │
│   ├── reading/                         # 독서 기록
│   │   └── 2024-atomic-habits.mdx
│   │
│   └── ai-lab/                          # AI 실험
│       └── prompt-engineering.mdx
│
├── scripts/
│   ├── auto-generators/
│   │   ├── daily-tip.ts                 # 매일 팁
│   │   ├── github-trends.ts             # 주간 트렌드
│   │   ├── tech-releases.ts             # 릴리즈 노트
│   │   └── stackoverflow-qa.ts          # SO Q&A
│   │
│   ├── analyzers/
│   │   ├── blog-stats.ts                # 블로그 통계 (관리자용)
│   │   └── content-updater.ts           # 콘텐츠 업데이트 제안
│   │   # reading-insights.ts            # 독서 분석 (추후 추가)
│   │
│   └── newsletter/
│       ├── send-daily.ts                # 매일 뉴스레터
│       └── send-weekly.ts               # 주간 뉴스레터
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx                   # 숨김 버튼 포함
│   │   └── Footer.tsx
│   │
│   ├── admin/                           # 관리자 컴포넌트
│   │   ├── AdminSidebar.tsx             # 사이드바
│   │   ├── StatCard.tsx                 # 통계 카드
│   │   ├── CommentCard.tsx              # 댓글 카드
│   │   ├── ViewsChart.tsx               # 조회수 차트
│   │   └── PostsChart.tsx               # 포스트 차트
│   │
│   ├── home/
│   │   ├── Hero.tsx                     # 메인 히어로 섹션
│   │   ├── FeaturedPosts.tsx            # 추천 포스트
│   │   └── CategorySection.tsx          # 카테고리별 최신글
│   │
│   ├── blog/
│   │   ├── PostCard.tsx
│   │   ├── PostContent.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── SearchBar.tsx
│   │   ├── ViewCounter.tsx
│   │   ├── LikeButton.tsx
│   │   ├── ShareButtons.tsx
│   │   └── Comments.tsx
│   │
│   ├── editor/
│   │   └── EditorModal.tsx              # 포스팅 모달
│   │
│   ├── ai-features/
│   │   ├── SummaryButton.tsx
│   │   └── RelatedPosts.tsx
│   │
│   ├── reading/
│   │   ├── BookCard.tsx
│   │   └── ReadingStats.tsx
│   │
│   ├── ads/
│   │   └── AdSense.tsx
│   │
│   └── mdx/
│       └── MdxComponents.tsx
│
├── lib/
│   ├── ai/
│   │   ├── claude.ts                    # Claude API wrapper
│   │   └── prompts/
│   │       ├── daily-tip.ts
│   │       ├── github-analysis.ts
│   │       ├── summarize.ts
│   │       └── related-posts.ts
│   │
│   ├── content/
│   │   ├── mdx.ts
│   │   └── parser.ts
│   │
│   ├── db/
│   │   ├── schema.ts
│   │   ├── queries.ts
│   │   └── client.ts
│   │
│   └── utils/
│       ├── email.ts
│       ├── analytics.ts
│       ├── date.ts
│       ├── rateLimit.ts
│       └── notify.ts                    # AI 발행 알림
│
├── .github/
│   └── workflows/
│       ├── daily-tip.yml                # 매일 9시
│       ├── github-trends.yml            # 매주 월요일
│       ├── daily-newsletter.yml         # 매일 아침
│       └── weekly-newsletter.yml        # 매주 일요일
│       # monthly-insights.yml           # 추후 추가 예정
│
├── public/
│   ├── images/
│   ├── icons/
│   └── ai-generated/
│
├── .env.local
├── contentlayer.config.ts
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 데이터베이스 스키마

```sql
-- 뉴스레터 구독자
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE,
  daily_newsletter BOOLEAN DEFAULT TRUE,
  weekly_newsletter BOOLEAN DEFAULT TRUE
);

-- 포스트 분석
CREATE TABLE post_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  views INT DEFAULT 0,
  likes INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 댓글
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_slug VARCHAR(255) NOT NULL,
  author_name VARCHAR(100),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- AI 생성 로그
CREATE TABLE ai_generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50) NOT NULL,
  prompt TEXT,
  content TEXT,
  tokens_used INT,
  created_at TIMESTAMP DEFAULT NOW(),
  published BOOLEAN DEFAULT FALSE,
  post_slug VARCHAR(255)
);

-- 독서 진행
CREATE TABLE reading_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_slug VARCHAR(255) UNIQUE NOT NULL,
  total_pages INT,
  current_page INT,
  status VARCHAR(20),
  started_at TIMESTAMP,
  finished_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 핵심 구현 코드

### 1. Contentlayer 설정

```typescript
// contentlayer.config.ts
import { defineDocumentType, makeSource } from 'contentlayer/source-files'

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `posts/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    category: { 
      type: 'enum', 
      options: ['manual', 'tech', 'reading', 'ai-daily-tip', 'ai-github', 'ai-news'],
      required: true 
    },
    tags: { type: 'list', of: { type: 'string' }, default: [] },
    summary: { type: 'string' },
    aiGenerated: { type: 'boolean', default: false },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.split('/').pop()
    },
    url: {
      type: 'string',
      resolve: (doc) => `/blog/${doc._raw.flattenedPath.split('/').pop()}`
    }
  }
}))

export const Reading = defineDocumentType(() => ({
  name: 'Reading',
  filePathPattern: `reading/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    author: { type: 'string', required: true },
    finishedDate: { type: 'date' },
    rating: { type: 'number' },
    pages: { type: 'number' },
  }
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Post, Reading]
})
```

### 2. 메인 페이지

```typescript
// app/(main)/page.tsx
import { allPosts } from 'contentlayer/generated'
import PostCard from '@/components/blog/PostCard'
import Hero from '@/components/home/Hero'
import FeaturedPosts from '@/components/home/FeaturedPosts'

export default function HomePage() {
  const latestPosts = allPosts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6)
  
  const featuredPosts = latestPosts.slice(0, 3)

  return (
    <div>
      <Hero />
      
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">추천 포스트</h2>
        <FeaturedPosts posts={featuredPosts} />
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">최신 포스트</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestPosts.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </section>
    </div>
  )
}
```

### 3. 헤더 (숨김 버튼 포함)

```typescript
// components/layout/Header.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import EditorModal from '@/components/editor/EditorModal'

export default function Header() {
  const [showEditor, setShowEditor] = useState(false)

  return (
    <>
      <header className="border-b">
        <nav className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            내 블로그
          </Link>
          
          <div className="flex gap-6 items-center">
            <Link href="/blog">블로그</Link>
            <Link href="/reading">독서</Link>
            <Link href="/about">소개</Link>
            
            {/* 숨김 글쓰기 버튼 - 작고 눈에 안띄게 */}
            <button 
              onClick={() => setShowEditor(true)}
              className="text-gray-300 hover:text-gray-600 text-xs opacity-30 hover:opacity-100 transition-opacity"
              aria-label="Write"
            >
              W
            </button>
          </div>
        </nav>
      </header>

      {showEditor && <EditorModal onClose={() => setShowEditor(false)} />}
    </>
  )
}
```

### 4. 에디터 모달

```typescript
// components/editor/EditorModal.tsx
'use client'

import { useState } from 'react'
import MDEditor from '@uiw/react-md-editor'

export default function EditorModal({ onClose }: { onClose: () => void }) {
  const [isAuthed, setIsAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    category: 'manual',
    tags: '',
    summary: '',
    content: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    })
    if (res.ok) setIsAuthed(true)
    else alert('비밀번호가 틀렸습니다')
  }

  const handlePublish = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/posts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          password,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        })
      })
      if (res.ok) {
        const { slug } = await res.json()
        alert('발행 완료! 1-2분 후 배포됩니다.')
        window.location.href = `/blog/${slug}`
      }
    } catch (error) {
      alert('발행 실패')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
        {!isAuthed ? (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">글쓰기</h2>
            <form onSubmit={handleAuth} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="비밀번호"
                className="w-full px-4 py-2 border rounded-lg"
                autoFocus
              />
              <div className="flex gap-2">
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg">
                  확인
                </button>
                <button type="button" onClick={onClose} className="px-6 py-2 border rounded-lg">
                  취소
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">새 포스트</h2>
              <button onClick={onClose} className="text-gray-500 text-2xl">X</button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="제목"
                className="w-full px-4 py-2 border rounded-lg text-xl font-bold"
              />

              <div className="flex gap-4">
                <select
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="px-4 py-2 border rounded-lg"
                >
                  <option value="manual">일반</option>
                  <option value="tech">기술</option>
                  <option value="reading">독서</option>
                  <option value="life">일상</option>
                </select>

                <input
                  type="text"
                  value={formData.tags}
                  onChange={e => setFormData({...formData, tags: e.target.value})}
                  placeholder="태그 (쉼표로 구분)"
                  className="flex-1 px-4 py-2 border rounded-lg"
                />
              </div>

              <textarea
                value={formData.summary}
                onChange={e => setFormData({...formData, summary: e.target.value})}
                placeholder="요약 (선택사항)"
                className="w-full px-4 py-2 border rounded-lg h-20"
              />

              <MDEditor
                value={formData.content}
                onChange={value => setFormData({...formData, content: value || ''})}
                height={400}
                preview="live"
              />

              <div className="flex gap-2 justify-end">
                <button onClick={onClose} className="px-6 py-2 border rounded-lg">
                  취소
                </button>
                <button
                  onClick={handlePublish}
                  disabled={isSubmitting || !formData.title || !formData.content}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                >
                  {isSubmitting ? '발행 중...' : '발행하기'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

### 5. 포스트 생성 API

```typescript
// app/api/posts/create/route.ts
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST(request: Request) {
  try {
    const { title, category, tags, summary, content, password } = await request.json()
    
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const date = new Date().toISOString()
    const slug = `${date.split('T')[0]}-${title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]+/g, '-')
      .slice(0, 50)}`
    
    const mdxContent = `---
title: "${title}"
date: "${date}"
category: "${category}"
tags: [${tags.map((t: string) => `"${t}"`).join(', ')}]
${summary ? `summary: "${summary}"` : ''}
aiGenerated: false
---

${content}
`
    
    const filePath = path.join(process.cwd(), 'content/posts/manual', `${slug}.mdx`)
    fs.writeFileSync(filePath, mdxContent, 'utf-8')
    
    await execAsync(`
      cd ${process.cwd()}
      git add content/posts/manual/${slug}.mdx
      git commit -m "New post: ${title}"
      git push origin main
    `)
    
    return NextResponse.json({ success: true, slug })
    
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
```

### 6. AI 자동 생성 스크립트 (매일 팁)

```typescript
// scripts/auto-generators/daily-tip.ts
import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!
})

async function generateDailyTip() {
  const today = new Date().toISOString().split('T')[0]
  
  console.log(`Generating daily tip for ${today}...`)
  
  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1500,
    messages: [{
      role: "user",
      content: `당신은 경력 5년차 풀스택 개발자입니다.

오늘(${today})의 실용적인 개발 팁 하나를 작성해주세요.

요구사항:
- Next.js, React, TypeScript, Node.js 중 하나 주제
- 5분 안에 읽을 수 있는 길이 (500-800자)
- 실제 코드 예시 포함
- 바로 적용 가능한 실용적인 내용
- 친근하고 대화하는 톤
- 마크다운 형식

다음 형식으로만 작성 (프론트매터 제외):
[제목]

[본문 - 설명과 코드 예시 포함]
`
    }]
  })
  
  const content = message.content[0].text
  
  const titleMatch = content.match(/^#\s+(.+)$/m) || content.match(/^(.+)$/m)
  const title = titleMatch ? titleMatch[1].replace(/^#+\s*/, '') : `${today} 개발 팁`
  
  const mdxContent = `---
title: "${title}"
date: "${new Date().toISOString()}"
category: "ai-daily-tip"
tags: ["tip", "development"]
aiGenerated: true
---

${content}
`
  
  const filename = `${today}-daily-tip.mdx`
  const filepath = path.join(process.cwd(), 'content/posts/ai-generated/daily-tips', filename)
  
  fs.mkdirSync(path.dirname(filepath), { recursive: true })
  fs.writeFileSync(filepath, mdxContent, 'utf-8')
  
  console.log(`Created: ${filename}`)
  
  await execAsync(`
    cd ${process.cwd()}
    git add content/posts/ai-generated/daily-tips/${filename}
    git commit -m "AI Daily tip: ${title}"
    git push origin main
  `)
  
  console.log('Pushed to GitHub')
}

generateDailyTip().catch(console.error)
```

### 7. GitHub Actions - 매일 자동 실행

```yaml
# .github/workflows/daily-tip.yml
name: Daily Development Tip

on:
  schedule:
    - cron: '0 0 * * *'
  workflow_dispatch:

jobs:
  generate-tip:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm install
      
      - name: Generate daily tip
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: npm run generate:daily-tip
      
      - name: Configure Git
        run: |
          git config --global user.name "AI Bot"
          git config --global user.email "bot@yourblog.com"
```

### 8. GitHub Actions - 매일 뉴스레터

```yaml
# .github/workflows/daily-newsletter.yml
name: Daily Newsletter

on:
  schedule:
    - cron: '0 1 * * *'
  workflow_dispatch:

jobs:
  send-newsletter:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm install
      
      - name: Send daily newsletter
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          RESEND_API_KEY: ${{ secrets.RESEND_API_KEY }}
        run: npm run newsletter:daily
```

### 9. GitHub Actions - 주간 뉴스레터

```yaml
# .github/workflows/weekly-newsletter.yml
name: Weekly Newsletter

on:
  schedule:
    - cron: '0 1 * * 0'
  workflow_dispatch:

jobs:
  send-newsletter:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm install
      
      - name: Send weekly newsletter
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          RESEND_API_KEY: ${{ secrets.RESEND_API_KEY }}
        run: npm run newsletter:weekly
```

### 10. Rate Limiting (AI 비용 관리)

```typescript
// lib/rateLimit.ts
const rateLimiter = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  identifier: string,
  limit: number = parseInt(process.env.AI_RATE_LIMIT_PER_HOUR || '20'),
  windowMs: number = 60 * 60 * 1000 // 1시간
): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const record = rateLimiter.get(identifier)

  if (!record || now > record.resetTime) {
    rateLimiter.set(identifier, { count: 1, resetTime: now + windowMs })
    return { allowed: true, remaining: limit - 1 }
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0 }
  }

  record.count++
  return { allowed: true, remaining: limit - record.count }
}

// 사용 예시: app/api/ai/summarize/route.ts
export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const { allowed, remaining } = checkRateLimit(ip)

  if (!allowed) {
    return Response.json(
      { error: '요청 한도 초과. 1시간 후 다시 시도해주세요.' },
      { status: 429, headers: { 'X-RateLimit-Remaining': '0' } }
    )
  }

  // AI 요약 로직...
}
```

### 11. AI 발행 알림

```typescript
// lib/utils/notify.ts
export async function notifyAIPublish(post: {
  title: string
  slug: string
  type: string
}) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL
    || process.env.SLACK_WEBHOOK_URL

  if (!webhookUrl) return

  const message = {
    content: `🤖 AI 포스트 발행됨\n**${post.title}**\n타입: ${post.type}\n링크: https://yourblog.com/blog/${post.slug}`
  }

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message)
  })
}

// 사용 예시: scripts/auto-generators/daily-tip.ts 끝부분
await notifyAIPublish({
  title,
  slug: filename.replace('.mdx', ''),
  type: 'daily-tip'
})
```

### 12. 구글 애드센스 통합

```typescript
// app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ID"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

```typescript
// components/ads/AdSense.tsx
'use client'

import { useEffect } from 'react'

export default function AdSense() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, [])

  return (
    <div className="my-8">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-YOUR_ID"
        data-ad-slot="YOUR_SLOT_ID"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
```

---

## 배포 및 자동화 플로우

### 배포 시스템
```
로컬/에디터에서 작성 → MDX 파일 생성 → Git Push → Vercel 자동 감지 → 빌드 & 배포 (1-2분)
```

### AI 자동화 플로우
```
GitHub Actions Cron → API/데이터 수집 → Claude API 호출 → MDX 파일 생성 → Git Push → Vercel 자동 배포
```

### 자동화 스케줄
```
매일 09:00 KST → 개발 팁 생성
매일 10:00 KST → 일일 뉴스레터 발송
매주 월요일 → GitHub 트렌딩 분석
매주 목요일 → Stack Overflow Q&A (출처 명시 포함)
매주 일요일 → 주간 종합 뉴스레터 발송
# 매월 1일 → 월간 인사이트 리포트 (추후 추가)
```

---

## 환경변수 설정

```bash
# .env.local

ADMIN_PASSWORD=your_secret_password_123
JWT_SECRET=your_jwt_secret_key_at_least_32_characters_long
ANTHROPIC_API_KEY=sk-ant-...
DATABASE_URL=postgresql://...
RESEND_API_KEY=re_...
NEXT_PUBLIC_ADSENSE_ID=ca-pub-...
NEXT_PUBLIC_GA_ID=G-...

# AI 토큰 한도 설정
AI_SUMMARIZE_MAX_TOKENS=1000
AI_RELATED_POSTS_MAX_TOKENS=500
AI_DAILY_TIP_MAX_TOKENS=1500
AI_RATE_LIMIT_PER_HOUR=20

# AI 발행 알림 (택1)
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
# SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
# NOTIFICATION_EMAIL=your@email.com
```

**Vercel 환경변수에도 동일하게 설정 필요**

---

## package.json 스크립트

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "generate:daily-tip": "ts-node scripts/auto-generators/daily-tip.ts",
    "generate:github-trends": "ts-node scripts/auto-generators/github-trends.ts",
    "newsletter:daily": "ts-node scripts/newsletter/send-daily.ts",
    "newsletter:weekly": "ts-node scripts/newsletter/send-weekly.ts"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "contentlayer": "^0.3.4",
    "next-contentlayer": "^0.3.4",
    "@anthropic-ai/sdk": "latest",
    "@uiw/react-md-editor": "latest",
    "jose": "^5.0.0",
    "resend": "latest",
    "@vercel/postgres": "latest"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "tailwindcss": "^3.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "ts-node": "latest"
  }
}
```

---

## 구현 순서

### Phase 1: 기본 블로그 구축 (1-2일)
1. Next.js 프로젝트 생성
2. Contentlayer 설정
3. 기본 레이아웃 (Header, Footer)
4. 메인 페이지
5. 블로그 목록 페이지
6. 블로그 상세 페이지
7. Vercel 배포

### Phase 2: 포스팅 시스템 (1일)
1. 에디터 모달 UI
2. 비밀번호 인증 API
3. 포스트 생성 API (Git Push 포함)
4. 헤더에 숨김 버튼 추가
5. 테스트 포스트 작성

### Phase 3: 데이터베이스 & 기능 (1-2일)
1. DB 스키마 생성
2. 조회수 카운터
3. 좋아요 기능
4. 댓글 시스템
5. 검색 기능
6. 카테고리 필터

### Phase 4: AI 자동화 (2-3일)
1. Claude API 연동
2. 매일 개발 팁 스크립트
3. GitHub Actions 설정
4. 주간 GitHub 트렌딩 스크립트
5. 자동 포스팅 테스트

### Phase 5: AI 인터랙티브 기능 (1-2일)
1. 3줄 요약 버튼
2. 관련 포스트 추천

### Phase 6: 수익화 & 최적화 (1-2일)
1. 구글 애드센스 통합
2. SEO 최적화
3. Google Analytics
4. 성능 최적화
5. 독립 도메인 연결

### Phase 7: 뉴스레터 & 고급 기능 (1-2일)
1. 매일 뉴스레터 시스템
2. 주간 종합 뉴스레터
3. 독서 기록 섹션
> 참고: 월간 인사이트 리포트는 데이터 축적 후 추후 추가

### Phase 8: 관리자 기능 (2-3일)
1. 관리자 인증 시스템 (JWT)
2. 통계 대시보드
3. 댓글 관리 페이지
4. 포스트 관리 페이지
5. 구독자 관리
6. AI 로그 페이지
7. 관리자 사이드바 네비게이션

---

## 관리자 기능

### 추가 필요한 관리 기능

#### 1. 통계 대시보드 (필수)
```
/admin/dashboard 페이지
- 전체 조회수, 좋아요 수
- 오늘/주간/월간 통계
- 인기 포스트 TOP 10
- 최근 댓글 목록
- 구독자 수 추이
- AI 생성 콘텐츠 통계 (토큰 사용량, 생성 횟수)
```

#### 2. 댓글 관리 페이지 (필수)
```
/admin/comments
- 모든 댓글 한눈에 보기
- 댓글 삭제/승인
- 스팸 필터링
- 포스트별로 댓글 보기
```

#### 3. 포스트 관리 (필수)
```
/admin/posts
- 모든 포스트 목록 (수동/AI 구분)
- 포스트 수정 (기존 글 수정 기능)
- 포스트 삭제
- 임시저장 기능
- 발행 예약
```

#### 4. 구독자 관리
```
/admin/subscribers
- 구독자 목록
- 구독 취소자 관리
- 뉴스레터 발송 이력
```

#### 5. AI 로그 확인
```
/admin/ai-logs
- AI 생성 이력
- 토큰 사용량
- 실패한 생성 확인
- 재생성 기능
```

### 통합 관리자 대시보드 구조

```
/admin
├── /dashboard          # 통합 대시보드
├── /posts             # 포스트 관리
│   ├── /all          # 전체 포스트
│   ├── /manual       # 수동 작성
│   ├── /ai           # AI 생성
│   └── /drafts       # 임시저장
├── /comments          # 댓글 관리
├── /subscribers       # 구독자 관리
├── /analytics         # 상세 통계
└── /ai-logs          # AI 로그
```

### 관리자 기능 구현 코드

#### 1. 통계 대시보드

```typescript
// app/admin/dashboard/page.tsx
import { requireAuth } from '@/lib/auth'

export default async function DashboardPage() {
  await requireAuth()
  
  const stats = await getStats()
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">대시보드</h1>
      
      {/* 요약 카드 */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard title="총 조회수" value={stats.totalViews} />
        <StatCard title="총 포스트" value={stats.totalPosts} />
        <StatCard title="총 댓글" value={stats.totalComments} />
        <StatCard title="구독자" value={stats.subscribers} />
      </div>

      {/* 차트 */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <ViewsChart data={stats.viewsHistory} />
        <PostsChart data={stats.postsHistory} />
      </div>

      {/* 인기 포스트 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">인기 포스트</h2>
        <TopPostsList posts={stats.topPosts} />
      </div>

      {/* 최근 댓글 */}
      <div>
        <h2 className="text-2xl font-bold mb-4">최근 댓글</h2>
        <RecentCommentsList comments={stats.recentComments} />
      </div>
    </div>
  )
}
```

```typescript
// components/admin/StatCard.tsx
export default function StatCard({ 
  title, 
  value 
}: { 
  title: string
  value: number 
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-gray-600 text-sm mb-2">{title}</h3>
      <p className="text-3xl font-bold">{value.toLocaleString()}</p>
    </div>
  )
}
```

#### 2. 댓글 관리

```typescript
// app/admin/comments/page.tsx
import { requireAuth } from '@/lib/auth'

export default async function CommentsPage() {
  await requireAuth()
  
  const comments = await getAllComments()
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">댓글 관리</h1>
      
      {/* 필터 */}
      <div className="flex gap-4 mb-6">
        <button className="px-4 py-2 bg-blue-600 text-white rounded">전체</button>
        <button className="px-4 py-2 border rounded">승인 대기</button>
        <button className="px-4 py-2 border rounded">스팸</button>
      </div>

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {comments.map(comment => (
          <CommentCard 
            key={comment.id}
            comment={comment}
          />
        ))}
      </div>
    </div>
  )
}
```

```typescript
// components/admin/CommentCard.tsx
'use client'

export default function CommentCard({ comment }) {
  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    
    await fetch(`/api/admin/comments/${comment.id}`, {
      method: 'DELETE'
    })
    
    window.location.reload()
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="font-medium">{comment.author_name}</p>
          <p className="text-sm text-gray-600">{comment.post_slug}</p>
        </div>
        <p className="text-sm text-gray-500">
          {new Date(comment.created_at).toLocaleDateString('ko-KR')}
        </p>
      </div>
      
      <p className="mb-4">{comment.content}</p>
      
      <div className="flex gap-2">
        <button 
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded text-sm"
        >
          삭제
        </button>
        <a 
          href={`/blog/${comment.post_slug}`}
          className="px-4 py-2 border rounded text-sm"
        >
          포스트 보기
        </a>
      </div>
    </div>
  )
}
```

#### 3. 포스트 관리

```typescript
// app/admin/posts/page.tsx
import { requireAuth } from '@/lib/auth'
import { allPosts } from 'contentlayer/generated'

export default async function PostsPage() {
  await requireAuth()
  
  const postsWithStats = await getPostsWithStats()
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">포스트 관리</h1>
      
      {/* 필터 */}
      <div className="flex gap-4 mb-6">
        <select className="px-4 py-2 border rounded">
          <option>전체</option>
          <option>수동 작성</option>
          <option>AI 생성</option>
        </select>
        <input 
          type="search" 
          placeholder="검색..." 
          className="px-4 py-2 border rounded flex-1"
        />
      </div>

      {/* 포스트 목록 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">제목</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">카테고리</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">조회수</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">날짜</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {postsWithStats.map(post => (
              <tr key={post.slug}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {post.title}
                    {post.aiGenerated && (
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                        AI
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">{post.category}</td>
                <td className="px-6 py-4">{post.views}</td>
                <td className="px-6 py-4">{new Date(post.date).toLocaleDateString('ko-KR')}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <a 
                      href={`/admin/posts/${post.slug}/edit`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      수정
                    </a>
                    <button 
                      onClick={() => handleDelete(post.slug)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

#### 4. 구독자 관리

```typescript
// app/admin/subscribers/page.tsx
import { requireAuth } from '@/lib/auth'

export default async function SubscribersPage() {
  await requireAuth()
  
  const subscribers = await getSubscribers()
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">구독자 관리</h1>
      
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <p className="text-2xl font-bold">{subscribers.length}</p>
        <p className="text-gray-600">총 구독자</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">이메일</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">구독일</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">매일 뉴스레터</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">주간 뉴스레터</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {subscribers.map(sub => (
              <tr key={sub.id}>
                <td className="px-6 py-4">{sub.email}</td>
                <td className="px-6 py-4">{new Date(sub.subscribed_at).toLocaleDateString('ko-KR')}</td>
                <td className="px-6 py-4">{sub.daily_newsletter ? '✓' : '✗'}</td>
                <td className="px-6 py-4">{sub.weekly_newsletter ? '✓' : '✗'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    sub.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {sub.active ? '활성' : '비활성'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

#### 5. AI 로그

```typescript
// app/admin/ai-logs/page.tsx
import { requireAuth } from '@/lib/auth'

export default async function AILogsPage() {
  await requireAuth()
  
  const logs = await getAILogs()
  const stats = calculateAIStats(logs)
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">AI 생성 로그</h1>
      
      {/* 통계 */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <StatCard title="총 생성" value={stats.totalGenerations} />
        <StatCard title="토큰 사용" value={stats.totalTokens} />
        <StatCard title="예상 비용" value={`$${stats.estimatedCost.toFixed(2)}`} />
      </div>

      {/* 로그 목록 */}
      <div className="space-y-4">
        {logs.map(log => (
          <div key={log.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-medium">{log.type}</p>
                <p className="text-sm text-gray-600">
                  {new Date(log.created_at).toLocaleString('ko-KR')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">토큰: {log.tokens_used}</p>
                <span className={`px-2 py-1 rounded text-xs ${
                  log.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {log.published ? '발행됨' : '대기중'}
                </span>
              </div>
            </div>
            
            {log.post_slug && (
              <a 
                href={`/blog/${log.post_slug}`}
                className="text-blue-600 hover:underline text-sm"
              >
                포스트 보기
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 관리자 인증 시스템

```typescript
// lib/auth.ts
import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'
import { redirect } from 'next/navigation'

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function createSession() {
  const token = await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(secret)
  
  cookies().set('admin-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 24시간
  })
}

export async function verifySession() {
  const token = cookies().get('admin-token')?.value
  
  if (!token) return false
  
  try {
    await jwtVerify(token, secret)
    return true
  } catch {
    return false
  }
}

export async function requireAuth() {
  const isAuthenticated = await verifySession()
  
  if (!isAuthenticated) {
    redirect('/admin/login')
  }
}

export async function logout() {
  cookies().delete('admin-token')
  redirect('/admin/login')
}
```

```typescript
// app/admin/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    })
    
    if (res.ok) {
      router.push('/admin/dashboard')
    } else {
      alert('비밀번호가 틀렸습니다')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">관리자 로그인</h1>
        
        <form onSubmit={handleLogin}>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="비밀번호"
            className="w-full px-4 py-2 border rounded mb-4"
            autoFocus
          />
          
          <button 
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  )
}
```

```typescript
// app/api/auth/login/route.ts
import { NextResponse } from 'next/server'
import { createSession } from '@/lib/auth'

export async function POST(request: Request) {
  const { password } = await request.json()
  
  if (password === process.env.ADMIN_PASSWORD) {
    await createSession()
    return NextResponse.json({ success: true })
  }
  
  return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
}
```

### 관리자 레이아웃

```typescript
// app/admin/layout.tsx
import { requireAuth } from '@/lib/auth'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  await requireAuth()
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
```

```typescript
// components/admin/AdminSidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminSidebar() {
  const pathname = usePathname()
  
  const navItems = [
    { href: '/admin/dashboard', label: '대시보드' },
    { href: '/admin/posts', label: '포스트 관리' },
    { href: '/admin/comments', label: '댓글 관리' },
    { href: '/admin/subscribers', label: '구독자' },
    { href: '/admin/analytics', label: '상세 통계' },
    { href: '/admin/ai-logs', label: 'AI 로그' },
  ]

  return (
    <aside className="w-64 bg-gray-900 text-white p-6">
      <h2 className="text-xl font-bold mb-8">관리자</h2>
      
      <nav className="space-y-2">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-4 py-2 rounded ${
              pathname === item.href 
                ? 'bg-blue-600' 
                : 'hover:bg-gray-800'
            }`}
          >
            {item.label}
          </Link>
        ))}
        
        <hr className="my-4 border-gray-700" />
        
        <Link href="/" className="block px-4 py-2 rounded hover:bg-gray-800">
          블로그 보기
        </Link>
        
        <button 
          onClick={() => fetch('/api/auth/logout', { method: 'POST' })}
          className="w-full text-left px-4 py-2 rounded hover:bg-gray-800 text-red-400"
        >
          로그아웃
        </button>
      </nav>
    </aside>
  )
}
```

### 필요한 API 엔드포인트

```typescript
// 통계 API
GET /api/admin/stats              # 전체 통계
GET /api/admin/analytics          # 상세 분석

// 댓글 관리
GET /api/admin/comments           # 모든 댓글
DELETE /api/admin/comments/[id]   # 댓글 삭제
PATCH /api/admin/comments/[id]    # 댓글 승인/스팸

// 포스트 관리
GET /api/admin/posts              # 모든 포스트 (통계 포함)
DELETE /api/admin/posts/[slug]    # 포스트 삭제
PATCH /api/admin/posts/[slug]     # 포스트 수정

// AI 로그
GET /api/admin/ai-logs            # AI 생성 로그
POST /api/admin/ai-logs/[id]/regenerate  # 재생성

// 구독자 관리
GET /api/admin/subscribers        # 구독자 목록
DELETE /api/admin/subscribers/[id] # 구독자 삭제

// 인증
POST /api/auth/login              # 로그인
POST /api/auth/logout             # 로그아웃
```

### 통계 API 구현 예시

```typescript
// app/api/admin/stats/route.ts
import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/db/client'

export async function GET() {
  await requireAuth()
  
  // 전체 통계 수집
  const [
    totalViews,
    totalPosts,
    totalComments,
    subscribers,
    topPosts,
    recentComments
  ] = await Promise.all([
    db.query('SELECT SUM(views) FROM post_analytics'),
    db.query('SELECT COUNT(*) FROM posts'),
    db.query('SELECT COUNT(*) FROM comments'),
    db.query('SELECT COUNT(*) FROM subscribers WHERE active = true'),
    db.query(`
      SELECT p.*, pa.views 
      FROM posts p 
      JOIN post_analytics pa ON p.slug = pa.slug 
      ORDER BY pa.views DESC 
      LIMIT 10
    `),
    db.query(`
      SELECT * FROM comments 
      ORDER BY created_at DESC 
      LIMIT 10
    `)
  ])
  
  return Response.json({
    totalViews: totalViews.rows[0].sum || 0,
    totalPosts: totalPosts.rows[0].count || 0,
    totalComments: totalComments.rows[0].count || 0,
    subscribers: subscribers.rows[0].count || 0,
    topPosts: topPosts.rows,
    recentComments: recentComments.rows
  })
}
```

---

## 관리자 기능

### 필요한 관리자 페이지

#### 1. 통합 관리자 대시보드 구조

```
/admin
├── /dashboard          # 통합 대시보드
├── /posts             # 포스트 관리
│   ├── /all          # 전체 포스트
│   ├── /edit/[slug]  # 포스트 수정
│   └── /drafts       # 임시저장
├── /comments          # 댓글 관리
├── /subscribers       # 구독자 관리
├── /analytics         # 상세 통계
└── /ai-logs          # AI 로그
```

#### 2. 통계 대시보드 (/admin/dashboard)

**표시 내용**:
- 전체 조회수, 좋아요 수
- 오늘/주간/월간 통계
- 인기 포스트 TOP 10
- 최근 댓글 목록
- 구독자 수 추이
- AI 생성 콘텐츠 통계 (토큰 사용량, 생성 횟수)

```typescript
// app/admin/dashboard/page.tsx
import { requireAuth } from '@/lib/auth'

export default async function DashboardPage() {
  await requireAuth()
  
  const stats = await getStats()
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">대시보드</h1>
      
      {/* 요약 카드 */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard title="총 조회수" value={stats.totalViews} />
        <StatCard title="총 포스트" value={stats.totalPosts} />
        <StatCard title="총 댓글" value={stats.totalComments} />
        <StatCard title="구독자" value={stats.subscribers} />
      </div>

      {/* 차트 */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <ViewsChart data={stats.viewsHistory} />
        <PostsChart data={stats.postsHistory} />
      </div>

      {/* 인기 포스트 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">인기 포스트</h2>
        <TopPostsList posts={stats.topPosts} />
      </div>

      {/* 최근 댓글 */}
      <div>
        <h2 className="text-2xl font-bold mb-4">최근 댓글</h2>
        <RecentCommentsList comments={stats.recentComments} />
      </div>
    </div>
  )
}
```

#### 3. 댓글 관리 (/admin/comments)

**기능**:
- 모든 댓글 한눈에 보기
- 댓글 삭제/승인
- 스팸 필터링
- 포스트별로 댓글 보기

```typescript
// app/admin/comments/page.tsx
import { requireAuth } from '@/lib/auth'

export default async function CommentsPage() {
  await requireAuth()
  
  const comments = await getAllComments()
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">댓글 관리</h1>
      
      {/* 필터 */}
      <div className="flex gap-4 mb-6">
        <button className="px-4 py-2 border rounded">전체</button>
        <button className="px-4 py-2 border rounded">승인 대기</button>
        <button className="px-4 py-2 border rounded">스팸</button>
      </div>

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {comments.map(comment => (
          <div key={comment.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-bold">{comment.author_name}</p>
                <p className="text-sm text-gray-500">
                  {comment.post_slug} - {formatDate(comment.created_at)}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="text-red-600">삭제</button>
                <button className="text-blue-600">승인</button>
              </div>
            </div>
            <p>{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

#### 4. 포스트 관리 (/admin/posts)

**기능**:
- 모든 포스트 목록 (수동/AI 구분)
- 포스트 수정 (기존 글 수정 기능)
- 포스트 삭제
- 임시저장 기능
- 발행 예약

```typescript
// app/admin/posts/page.tsx
import { requireAuth } from '@/lib/auth'

export default async function PostsPage() {
  await requireAuth()
  
  const posts = await getAllPosts()
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">포스트 관리</h1>
      
      {/* 필터 */}
      <div className="flex gap-4 mb-6">
        <select className="px-4 py-2 border rounded">
          <option>전체</option>
          <option>수동 작성</option>
          <option>AI 생성</option>
        </select>
        <input 
          type="search" 
          placeholder="검색..." 
          className="px-4 py-2 border rounded flex-1"
        />
      </div>

      {/* 포스트 목록 */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">제목</th>
              <th className="px-4 py-3 text-left">카테고리</th>
              <th className="px-4 py-3 text-left">조회수</th>
              <th className="px-4 py-3 text-left">날짜</th>
              <th className="px-4 py-3 text-left">작업</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.slug} className="border-t">
                <td className="px-4 py-3">
                  {post.title}
                  {post.aiGenerated && (
                    <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                      AI
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">{post.category}</td>
                <td className="px-4 py-3">{post.views}</td>
                <td className="px-4 py-3">{formatDate(post.date)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <a 
                      href={`/admin/posts/edit/${post.slug}`}
                      className="text-blue-600 hover:underline"
                    >
                      수정
                    </a>
                    <button className="text-red-600 hover:underline">
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

#### 5. 구독자 관리 (/admin/subscribers)

```typescript
// app/admin/subscribers/page.tsx
import { requireAuth } from '@/lib/auth'

export default async function SubscribersPage() {
  await requireAuth()
  
  const subscribers = await getAllSubscribers()
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">구독자 관리</h1>
      
      <div className="mb-6">
        <p className="text-lg">총 구독자: <strong>{subscribers.length}</strong>명</p>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">이메일</th>
              <th className="px-4 py-3 text-left">구독일</th>
              <th className="px-4 py-3 text-left">일일 뉴스레터</th>
              <th className="px-4 py-3 text-left">주간 뉴스레터</th>
              <th className="px-4 py-3 text-left">작업</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map(sub => (
              <tr key={sub.id} className="border-t">
                <td className="px-4 py-3">{sub.email}</td>
                <td className="px-4 py-3">{formatDate(sub.subscribed_at)}</td>
                <td className="px-4 py-3">
                  {sub.daily_newsletter ? '구독 중' : '해지'}
                </td>
                <td className="px-4 py-3">
                  {sub.weekly_newsletter ? '구독 중' : '해지'}
                </td>
                <td className="px-4 py-3">
                  <button className="text-red-600 hover:underline">
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

#### 6. AI 로그 (/admin/ai-logs)

```typescript
// app/admin/ai-logs/page.tsx
import { requireAuth } from '@/lib/auth'

export default async function AILogsPage() {
  await requireAuth()
  
  const logs = await getAILogs()
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">AI 생성 로그</h1>
      
      {/* 통계 */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <StatCard title="총 생성" value={logs.totalGenerations} />
        <StatCard title="토큰 사용" value={logs.totalTokens} />
        <StatCard title="예상 비용" value={`$${logs.estimatedCost}`} />
      </div>

      {/* 로그 목록 */}
      <div className="space-y-4">
        {logs.items.map(log => (
          <div key={log.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-bold">{log.type}</p>
                <p className="text-sm text-gray-500">
                  {formatDate(log.created_at)} - {log.tokens_used} tokens
                </p>
              </div>
              <div className="flex gap-2">
                {log.post_slug && (
                  <a 
                    href={`/blog/${log.post_slug}`}
                    className="text-blue-600 hover:underline"
                  >
                    보기
                  </a>
                )}
                <button className="text-green-600 hover:underline">
                  재생성
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              프롬프트: {log.prompt?.substring(0, 100)}...
            </p>
            {log.published ? (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                발행됨
              </span>
            ) : (
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                미발행
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

### 관리자 인증 시스템

현재는 버튼 누를 때마다 비밀번호를 입력하는데, 세션 방식으로 개선:

```typescript
// lib/auth.ts
import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function createSession() {
  const token = await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(secret)
  
  cookies().set('admin-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 24시간
  })
}

export async function verifySession() {
  const token = cookies().get('admin-token')?.value
  
  if (!token) return false
  
  try {
    await jwtVerify(token, secret)
    return true
  } catch {
    return false
  }
}

export async function destroySession() {
  cookies().delete('admin-token')
}

// 미들웨어
export async function requireAuth() {
  const isAuthenticated = await verifySession()
  
  if (!isAuthenticated) {
    redirect('/admin/login')
  }
}
```

```typescript
// app/admin/login/page.tsx
'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    })
    
    if (res.ok) {
      window.location.href = '/admin/dashboard'
    } else {
      alert('비밀번호가 틀렸습니다')
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">관리자 로그인</h1>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="비밀번호"
            className="w-full px-4 py-2 border rounded-lg mb-4"
            autoFocus
          />
          <button 
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  )
}
```

```typescript
// app/api/auth/login/route.ts
import { NextResponse } from 'next/server'
import { createSession } from '@/lib/auth'

export async function POST(request: Request) {
  const { password } = await request.json()
  
  if (password === process.env.ADMIN_PASSWORD) {
    await createSession()
    return NextResponse.json({ success: true })
  }
  
  return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
}
```

```typescript
// app/admin/layout.tsx
import { requireAuth, verifySession } from '@/lib/auth'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const isAuthenticated = await verifySession()
  
  if (!isAuthenticated) {
    redirect('/admin/login')
  }
  
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
    </div>
  )
}
```

---

### 관리자 사이드바

```typescript
// components/admin/AdminSidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminSidebar() {
  const pathname = usePathname()
  
  const NavLink = ({ href, children }: { href: string, children: React.ReactNode }) => {
    const isActive = pathname === href
    return (
      <Link
        href={href}
        className={`block px-4 py-2 rounded-lg transition-colors ${
          isActive 
            ? 'bg-blue-600 text-white' 
            : 'text-gray-300 hover:bg-gray-800'
        }`}
      >
        {children}
      </Link>
    )
  }
  
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/'
  }
  
  return (
    <aside className="w-64 bg-gray-900 text-white p-6">
      <h2 className="text-xl font-bold mb-8">관리자</h2>
      
      <nav className="space-y-2">
        <NavLink href="/admin/dashboard">
          대시보드
        </NavLink>
        <NavLink href="/admin/posts">
          포스트 관리
        </NavLink>
        <NavLink href="/admin/comments">
          댓글 관리
        </NavLink>
        <NavLink href="/admin/subscribers">
          구독자 관리
        </NavLink>
        <NavLink href="/admin/analytics">
          상세 통계
        </NavLink>
        <NavLink href="/admin/ai-logs">
          AI 로그
        </NavLink>
        
        <hr className="my-4 border-gray-700" />
        
        <NavLink href="/">
          블로그 보기
        </NavLink>
        <button 
          onClick={handleLogout}
          className="block w-full text-left px-4 py-2 text-red-400 hover:bg-gray-800 rounded-lg"
        >
          로그아웃
        </button>
      </nav>
    </aside>
  )
}
```

---

### 추가 필요 API 엔드포인트

```typescript
// 통계 API
GET /api/admin/stats
// 반환: { totalViews, totalPosts, totalComments, subscribers, viewsHistory, postsHistory, topPosts, recentComments }

// 댓글 관리 API
GET /api/admin/comments
// 쿼리: ?filter=all|pending|spam&postSlug=...
DELETE /api/admin/comments/[id]
PATCH /api/admin/comments/[id]/approve

// 포스트 관리 API
GET /api/admin/posts
// 쿼리: ?category=all|manual|ai&search=...
DELETE /api/admin/posts/[slug]
PATCH /api/admin/posts/[slug]
// 바디: { title, content, category, tags, summary }

// AI 로그 API
GET /api/admin/ai-logs
// 반환: { totalGenerations, totalTokens, estimatedCost, items[] }
POST /api/admin/ai-logs/[id]/regenerate

// 구독자 관리 API
GET /api/admin/subscribers
DELETE /api/admin/subscribers/[id]

// 인증 API
POST /api/auth/login
// 바디: { password }
POST /api/auth/logout
```

---

### 환경변수 추가

```bash
# 기존 환경변수에 추가
JWT_SECRET=your_jwt_secret_key_here_minimum_32_characters
```

---

## 예상 비용

```
무료:
- Vercel 호스팅 (Hobby 플랜)
- GitHub (Public 리포지토리)
- Vercel Postgres (Free tier)

유료:
- 도메인: $10-15/년
- Claude API: $3-15/월
- Resend (이메일): $0-20/월

총 예상: 월 $5-30
```
