# AI 자동화 블로그 프로젝트 - 기술 아키텍처 설계

> 작성일: 2026-02-03
> 버전: 1.0

---

## 1. Core Stack - 프레임워크, 언어, 런타임

### 선택 기술

| 항목 | 선택 | 버전 | 선택 이유 |
|------|------|------|-----------|
| **Framework** | Next.js | 15.x (또는 16.x) | App Router 안정화, Turbopack 정식 지원, RSC 최적화 |
| **Language** | TypeScript | 5.x | 타입 안전성, 개발자 경험 향상 |
| **Runtime** | Node.js | 22.x LTS | 최신 LTS, ES 모듈 네이티브 지원 |
| **React** | React | 19.x | Next.js 15+ 기본 지원, 새로운 Hooks API |

### 상세 설명

#### Next.js 15/16 선택 근거
- **Turbopack 정식 지원**: 개발 서버 시작 76.7% 빠름, Fast Refresh 96.3% 빠름
- **App Router 완전 안정화**: Server Components, Server Actions 프로덕션 준비 완료
- **onRequestError Hook**: Sentry 연동 시 에러 컨텍스트 자동 수집
- **Static Route Indicator**: 빌드 최적화 가시성 향상

> **참고**: Next.js 16이 이미 출시되었으나, 프로젝트 안정성을 위해 15.x LTS 또는 16.x 초기 안정 버전 선택 권장

#### 대안
- **Nuxt 4**: Vue 생태계 선호 시 고려
- **Remix**: 데이터 로딩 패턴이 중요한 경우
- **Astro**: 정적 콘텐츠 중심일 경우 (하지만 인터랙티브 AI 기능에 제약)

---

## 2. Package Manager & Build

### 선택 기술

| 항목 | 선택 | 버전 | 선택 이유 |
|------|------|------|-----------|
| **Package Manager** | pnpm | 10.x | 디스크 효율 87% 절약, 3.4x 빠른 설치 |
| **Build Tool** | Turbopack | (Next.js 내장) | Vite 대비 10x 빠른 개발 빌드 |
| **Monorepo** | 불필요 | - | 단일 프로젝트 구조 |

### 상세 설명

#### pnpm 10.x 선택 근거
- **성능**: Cold install 4.2초 (npm 대비 3.4x 빠름)
- **디스크 절약**: 10개 프로젝트 기준 612MB vs npm 4.87GB (-87%)
- **보안 강화**: SHA256 체크섬, public-hoist-pattern 기본 비활성화
- **Workspace Catalog**: 의존성 버전 중앙 관리

#### 구성 파일

```yaml
# pnpm-workspace.yaml
packages:
  - '.'

# package.json
{
  "packageManager": "pnpm@10.28.0"
}
```

#### 대안
- **npm**: 추가 설치 불필요, 호환성 최고
- **yarn**: PnP 모드 지원
- **bun**: 가장 빠르나 생태계 성숙도 낮음

---

## 3. Frontend - UI 라이브러리, 스타일링, 상태관리

### 선택 기술

| 항목 | 선택 | 버전 | 선택 이유 |
|------|------|------|-----------|
| **UI Components** | shadcn/ui | latest | 복사 기반 커스터마이징, Tailwind 네이티브 |
| **Styling** | Tailwind CSS | 3.x | 브라우저 호환성 안정, 4.x는 추후 업그레이드 |
| **Icons** | Lucide React | latest | 경량, Tree-shaking 지원 |
| **Animation** | Framer Motion | 11.x | 성숙한 애니메이션 라이브러리 |
| **State Management** | React useState | - | 초기에는 기본 상태 관리로 충분, Zustand는 추후 필요시 추가 |
| **Form** | React Hook Form + Zod | 7.x / 3.x | 성능 최적화, 타입 안전 검증 |

### 상세 설명

#### Tailwind CSS 3.x 선택 근거
- **브라우저 호환성**: 모든 주요 브라우저 지원 (IE11 제외)
- **안정성**: 성숙한 생태계, 풍부한 플러그인
- **추후 업그레이드**: 4.x 안정화 후 마이그레이션 가능

> **참고**: Tailwind CSS 4.x는 Safari 16.4+, Chrome 111+, Firefox 128+ 필요. 브라우저 호환성이 중요하므로 3.x로 시작

```javascript
// tailwind.config.ts - Tailwind CSS 3.x
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#7c3aed',
        secondary: '#06b6d4',
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
```

#### shadcn/ui 선택 근거
- **소유권**: 코드 복사 방식으로 완전한 커스터마이징 가능
- **접근성**: Radix UI 기반 ARIA 완전 지원
- **Tailwind 네이티브**: 별도 CSS-in-JS 불필요

#### 상태 관리
- **초기**: React useState, useContext로 충분
- **필요한 상태**: 에디터 모달 열림/닫힘, 로딩 상태 등 단순한 UI 상태
- **인증 상태**: JWT 쿠키 기반으로 관리 (클라이언트 상태 불필요)

> **추후 확장**: AI 인터랙티브 기능(Phase 4-5)에서 복잡한 상태 관리 필요시 Zustand 추가 검토

```typescript
// 초기에는 간단한 커스텀 훅으로 충분
// hooks/use-editor-modal.ts
import { useState, useCallback } from 'react'

export function useEditorModal() {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  return { isOpen, open, close }
}
```

#### 대안
- **CSS**: CSS Modules (Tailwind 불필요 시), Vanilla Extract
- **Components**: Radix UI 직접 사용, Ark UI, Headless UI
- **State**: Jotai (atomic), TanStack Query (서버 상태)

---

## 4. Content Management - MDX 처리, 콘텐츠 레이어

### 선택 기술

| 항목 | 선택 | 버전 | 선택 이유 |
|------|------|------|-----------|
| **Content Layer** | Content Collections | 2.x | Contentlayer 대체, 활발한 유지보수 |
| **MDX Processor** | @content-collections/mdx | latest | Content Collections 공식 MDX 지원 |
| **Editor** | @uiw/react-md-editor | latest | 경량 마크다운 에디터 |
| **Syntax Highlight** | Shiki | 1.x | VS Code 테마 호환 |

### 상세 설명

#### Content Collections 선택 근거 (Contentlayer 대체)
Contentlayer는 메인 스폰서(Stackbit)가 Netlify에 인수된 후 유지보수가 중단되었습니다. Content Collections는:
- **App Router 호환**: React Server Components 완전 지원
- **Zod 기반 스키마**: 유연한 타입 검증 (email, url 타입 등)
- **마이그레이션 용이**: Contentlayer에서 직접 마이그레이션 가능
- **활발한 유지보수**: Sebastian Sdorra가 적극적으로 관리

```typescript
// content-collections.ts
import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMDX } from '@content-collections/mdx'

const posts = defineCollection({
  name: 'posts',
  directory: 'content/posts',
  include: '**/*.mdx',
  schema: (z) => ({
    title: z.string(),
    date: z.coerce.date(),
    category: z.enum(['manual', 'tech', 'reading', 'ai-daily-tip', 'ai-github', 'ai-news']),
    tags: z.array(z.string()).default([]),
    summary: z.string().optional(),
    aiGenerated: z.boolean().default(false),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document)
    return {
      ...document,
      mdx,
      slug: document._meta.path.split('/').pop(),
      url: `/blog/${document._meta.path.split('/').pop()}`,
    }
  },
})

export default defineConfig({
  collections: [posts],
})
```

#### MDX 처리 파이프라인

```
MDX 파일 → Content Collections 파싱 → Zod 검증 → MDX 컴파일 → React 컴포넌트
```

#### 대안
- **@next/mdx**: Next.js 공식, 단순한 경우
- **next-mdx-remote**: 동적 MDX 로딩
- **Markdownlayer**: Contentlayer fork

---

## 5. Database - DB 선택, ORM, 스키마 관리

### 선택 기술

| 항목 | 선택 | 버전 | 선택 이유 |
|------|------|------|-----------|
| **Database** | Neon | - | Serverless Postgres, Vercel 통합 |
| **ORM** | Drizzle ORM | 0.40.x | SQL 투명성, Edge 최적화 |
| **Schema Migration** | Drizzle Kit | latest | drizzle-kit push/migrate |
| **Connection** | @neondatabase/serverless | latest | HTTP 기반 쿼리 (cold start 최소화) |

### 상세 설명

#### Neon 선택 근거 (vs Supabase)
- **Vercel 통합**: Vercel Postgres가 Neon 기반
- **Branching**: Git처럼 데이터베이스 브랜치 생성 (CI/CD 최적)
- **Scale to Zero**: 미사용 시 자동 종료 (비용 절약)
- **Cold Start**: 500ms~100ms (때때로 최대 3초)

> **비용 고려**: 개인 블로그 규모에서 Neon Free tier 충분 (0.5GB 스토리지, 10개 브랜치)

#### Drizzle ORM 선택 근거 (vs Prisma)
- **SQL 투명성**: "If you know SQL, you know Drizzle"
- **Edge 최적화**: Cold start 문제 없음 (Prisma의 Rust 엔진 이슈 해결)
- **번들 크기**: Prisma 대비 10x 작은 클라이언트
- **타입 안전성**: TypeScript 우선 설계

```typescript
// lib/db/schema.ts
import { pgTable, uuid, varchar, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core'

export const subscribers = pgTable('subscribers', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  subscribedAt: timestamp('subscribed_at').defaultNow(),
  active: boolean('active').default(true),
  dailyNewsletter: boolean('daily_newsletter').default(true),
  weeklyNewsletter: boolean('weekly_newsletter').default(true),
})

export const postAnalytics = pgTable('post_analytics', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  views: integer('views').default(0),
  likes: integer('likes').default(0),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  postSlug: varchar('post_slug', { length: 255 }).notNull(),
  authorName: varchar('author_name', { length: 100 }),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const aiGenerations = pgTable('ai_generations', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: varchar('type', { length: 50 }).notNull(),
  prompt: text('prompt'),
  content: text('content'),
  tokensUsed: integer('tokens_used'),
  createdAt: timestamp('created_at').defaultNow(),
  published: boolean('published').default(false),
  postSlug: varchar('post_slug', { length: 255 }),
})
```

```typescript
// lib/db/client.ts
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })
```

#### 대안
- **Supabase**: Auth + Storage + Realtime 필요 시 (BaaS)
- **Prisma**: DX 중시, 팀 생산성 우선 시
- **PlanetScale**: MySQL 선호 시 (Vitess 기반)

---

## 6. Authentication - 인증 방식

### 선택 기술

| 항목 | 선택 | 버전 | 선택 이유 |
|------|------|------|-----------|
| **Auth Library** | jose | 5.x | Edge Runtime 호환 JWT |
| **Session** | HTTP-only Cookie | - | XSS 방지 |
| **Password Hash** | 불필요 | - | 환경변수 비밀번호 비교 |

### 상세 설명

#### 인증 전략
프로젝트 특성상 **단일 관리자 인증**만 필요합니다:

1. **글쓰기 모달**: 환경변수 비밀번호 단순 비교
2. **관리자 대시보드**: JWT 세션 + HTTP-only 쿠키

```typescript
// lib/auth.ts
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function createSession(): Promise<void> {
  const token = await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(secret)

  const cookieStore = await cookies()
  cookieStore.set('admin-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24시간
  })
}

export async function verifySession(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin-token')?.value

  if (!token) return false

  try {
    await jwtVerify(token, secret)
    return true
  } catch {
    return false
  }
}

export async function requireAuth(): Promise<void> {
  const isAuthenticated = await verifySession()
  if (!isAuthenticated) {
    redirect('/admin/login')
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('admin-token')
}
```

#### 보안 고려사항
- **JWT_SECRET**: 최소 32자 이상 랜덤 문자열
- **ADMIN_PASSWORD**: 강력한 비밀번호 사용
- **Rate Limiting**: 로그인 시도 제한 (Upstash Rate Limit)

#### 대안 (확장 시)
- **Auth.js (NextAuth)**: OAuth 소셜 로그인 필요 시
- **Clerk**: 관리형 인증 서비스
- **Lucia**: 경량 세션 관리

---

## 7. AI/ML - Claude API, 관련 라이브러리

### 선택 기술

| 항목 | 선택 | 버전 | 선택 이유 |
|------|------|------|-----------|
| **AI Provider** | Anthropic Claude | Sonnet 4 / Haiku 4.5 | 고품질 텍스트 생성, 한국어 우수 |
| **SDK** | @anthropic-ai/sdk | latest | 공식 TypeScript SDK |
| **Rate Limiting** | @upstash/ratelimit | latest | Serverless Redis 기반 |
| **Token Counting** | 직접 계산 | - | API 응답의 usage 필드 활용 |

### 상세 설명

#### Claude 모델 선택

| 용도 | 모델 | 이유 |
|------|------|------|
| **매일 팁 생성** | claude-sonnet-4-20250514 | 고품질 콘텐츠 필요 |
| **3줄 요약** | claude-haiku-4-5-20251101 | 빠른 응답, 비용 효율 |
| **관련 포스트 추천** | claude-haiku-4-5-20251101 | 단순 분류 작업 |
| **GitHub 트렌딩 분석** | claude-sonnet-4-20250514 | 깊은 분석 필요 |

#### SDK 구성

```typescript
// lib/ai/claude.ts
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

interface GenerateOptions {
  model?: 'claude-sonnet-4-20250514' | 'claude-haiku-4-5-20251101'
  maxTokens?: number
  system?: string
}

export async function generateContent(
  prompt: string,
  options: GenerateOptions = {}
): Promise<{ content: string; tokensUsed: number }> {
  const {
    model = 'claude-sonnet-4-20250514',
    maxTokens = 1500,
    system,
  } = options

  const message = await client.messages.create({
    model,
    max_tokens: maxTokens,
    system,
    messages: [{ role: 'user', content: prompt }],
  })

  const textBlock = message.content[0]
  const content = textBlock.type === 'text' ? textBlock.text : ''
  const tokensUsed = message.usage.input_tokens + message.usage.output_tokens

  return { content, tokensUsed }
}
```

#### Rate Limiting (AI 비용 관리)

```typescript
// lib/ai/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// IP 기반 Rate Limiting
export const ipRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '1 h'), // 시간당 20회
  analytics: true,
})

// 기능별 토큰 한도
export const tokenLimits = {
  summarize: parseInt(process.env.AI_SUMMARIZE_MAX_TOKENS || '1000'),
  relatedPosts: parseInt(process.env.AI_RELATED_POSTS_MAX_TOKENS || '500'),
  dailyTip: parseInt(process.env.AI_DAILY_TIP_MAX_TOKENS || '1500'),
}
```

#### 예상 비용

| 작업 | 빈도 | 모델 | 예상 토큰/회 | 월간 비용 |
|------|------|------|-------------|-----------|
| 매일 팁 | 30회/월 | Sonnet 4 | 2000 | ~$1.80 |
| 주간 분석 | 4회/월 | Sonnet 4 | 4000 | ~$0.48 |
| 3줄 요약 | 100회/월 | Haiku 4.5 | 500 | ~$0.05 |
| **총합** | - | - | - | **~$3-5/월** |

#### 대안
- **OpenAI GPT-4o**: 범용성, 도구 호출 우수
- **Google Gemini**: 긴 컨텍스트 (100만 토큰)
- **Groq**: 초고속 추론 (Llama 3)

---

## 8. Email - 뉴스레터 발송

### 선택 기술

| 항목 | 선택 | 버전 | 선택 이유 |
|------|------|------|-----------|
| **Email Provider** | Resend | latest | 개발자 친화적 API, React Email 통합 |
| **Email Template** | React Email | latest | React 컴포넌트로 이메일 작성 |
| **SDK** | resend | latest | 공식 Node.js SDK |

### 상세 설명

#### Resend 선택 근거
- **Free Tier**: 월 3,000통 무료 (개인 블로그 충분)
- **React Email**: JSX로 이메일 템플릿 작성
- **높은 전송률**: DKIM/SPF/DMARC 자동 구성
- **가격**: Pro $20/월 (50,000통), 초과 시 $1.80/1,000통

#### 구현 예시

```typescript
// lib/email/resend.ts
import { Resend } from 'resend'
import { DailyNewsletterEmail } from '@/emails/daily-newsletter'

const resend = new Resend(process.env.RESEND_API_KEY!)

interface SendNewsletterOptions {
  to: string[]
  subject: string
  posts: Array<{ title: string; url: string; summary: string }>
}

export async function sendDailyNewsletter(options: SendNewsletterOptions) {
  const { to, subject, posts } = options

  // 배치 발송 (최대 100명씩)
  const batches = chunk(to, 100)

  for (const batch of batches) {
    await resend.batch.send(
      batch.map((email) => ({
        from: 'newsletter@yourblog.com',
        to: email,
        subject,
        react: DailyNewsletterEmail({ posts }),
      }))
    )
  }
}

function chunk<T>(array: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  )
}
```

```tsx
// emails/daily-newsletter.tsx
import { Html, Head, Body, Container, Heading, Text, Link } from '@react-email/components'

interface DailyNewsletterEmailProps {
  posts: Array<{ title: string; url: string; summary: string }>
}

export function DailyNewsletterEmail({ posts }: DailyNewsletterEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'sans-serif' }}>
        <Container>
          <Heading>오늘의 포스트</Heading>
          {posts.map((post) => (
            <div key={post.url}>
              <Link href={post.url}>{post.title}</Link>
              <Text>{post.summary}</Text>
            </div>
          ))}
        </Container>
      </Body>
    </Html>
  )
}
```

#### 대안
- **SendGrid**: 대규모 발송, 마케팅 기능
- **Postmark**: 트랜잭션 이메일 특화
- **AWS SES**: 최저 비용, 직접 설정 필요

---

## 9. Deployment & CI/CD

### 선택 기술

| 항목 | 선택 | 버전 | 선택 이유 |
|------|------|------|-----------|
| **Hosting** | Vercel | - | Next.js 최적화, 무료 Hobby 플랜 |
| **CI/CD** | GitHub Actions | - | Cron Job, 자동 배포 트리거 |
| **Image Hosting** | Vercel Blob | - | 이미지 최적화 통합 |
| **Domain** | Vercel DNS | - | 무료 SSL, 간편 설정 |

### 상세 설명

#### 배포 플로우

```
1. 수동 포스팅:
   에디터 모달 → GitHub API로 파일 생성 → Vercel 자동 배포

2. AI 자동 포스팅:
   GitHub Actions (Cron) → Claude API 호출 → MDX 생성 → Git Push → Vercel 자동 배포
```

#### ⚠️ Git Push 문제 및 해결책

**문제**: Vercel Serverless 환경에서는 `git push` 실행 불가 (읽기 전용 파일 시스템)

**해결책: GitHub API (Octokit) 사용**

```typescript
// lib/github.ts
import { Octokit } from '@octokit/rest'

const octokit = new Octokit({
  auth: process.env.GITHUB_PAT, // Personal Access Token (contents: write 권한)
})

interface CreateFileOptions {
  path: string
  content: string
  message: string
}

export async function createFileViaGitHub({ path, content, message }: CreateFileOptions) {
  const owner = process.env.GITHUB_OWNER!
  const repo = process.env.GITHUB_REPO!

  // Base64 인코딩
  const contentBase64 = Buffer.from(content).toString('base64')

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message,
    content: contentBase64,
    branch: 'main',
  })
}

// 사용 예시: app/api/posts/create/route.ts
export async function POST(request: Request) {
  // ... 인증, 검증 로직 ...

  const slug = generateSlug(title)
  const filePath = `content/posts/manual/${slug}.mdx`

  await createFileViaGitHub({
    path: filePath,
    content: mdxContent,
    message: `feat: add post "${title}"`,
  })

  // Vercel이 자동으로 재배포됨
  return Response.json({ success: true, slug })
}
```

**필요한 환경변수**:
```bash
GITHUB_PAT=ghp_xxxx          # Personal Access Token (contents: write)
GITHUB_OWNER=your-username
GITHUB_REPO=your-repo-name
```

**PAT 생성 방법**:
1. GitHub Settings → Developer settings → Personal access tokens → Fine-grained tokens
2. Repository access: 해당 repo만 선택
3. Permissions: Contents → Read and write

#### GitHub Actions 설정

```yaml
# .github/workflows/daily-tip.yml
name: Daily Development Tip

on:
  schedule:
    - cron: '0 0 * * *'  # 매일 UTC 00:00 (KST 09:00)
  workflow_dispatch:

permissions:
  contents: write

jobs:
  generate-tip:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Generate daily tip
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: pnpm run generate:daily-tip

      - name: Configure Git
        run: |
          git config --global user.name "AI Bot"
          git config --global user.email "bot@yourblog.com"

      - name: Commit and Push
        run: |
          git add content/posts/ai-generated/
          git diff --staged --quiet || git commit -m "chore: add daily tip $(date +%Y-%m-%d)"
          git push
```

#### Vercel 설정

```json
// vercel.json
{
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["icn1"],  // 서울 리전
  "crons": [
    {
      "path": "/api/cron/daily-newsletter",
      "schedule": "0 1 * * *"
    }
  ]
}
```

#### 환경변수 (Vercel + GitHub Secrets)

```bash
# 필수
ADMIN_PASSWORD=
JWT_SECRET=
ANTHROPIC_API_KEY=
DATABASE_URL=
RESEND_API_KEY=
GITHUB_PAT=                  # GitHub API용 Personal Access Token
GITHUB_OWNER=                # GitHub 사용자명
GITHUB_REPO=                 # 저장소 이름

# 선택
DISCORD_WEBHOOK_URL=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_ADSENSE_ID=
```

#### 대안
- **Cloudflare Pages**: Edge 배포, Workers 연동
- **Netlify**: 빌드 플러그인 생태계
- **Railway**: 더 많은 자유도, DB 통합

---

## 10. Monitoring & Logging

### 선택 기술

| 항목 | 선택 | 버전 | 선택 이유 |
|------|------|------|-----------|
| **Error Tracking** | Sentry | latest | Next.js 공식 통합, 에러 그룹핑 |
| **Analytics** | Vercel Analytics | - | 무료, Core Web Vitals |
| **Product Analytics** | Google Analytics 4 | - | 무료, 상세 트래픽 분석 |
| **Uptime Monitoring** | Vercel (built-in) | - | 기본 제공 |
| **AI 발행 알림** | Discord Webhook | - | 무료, 즉시 알림 |

### 상세 설명

#### Sentry 선택 근거 (vs LogRocket)
- **Next.js 공식 통합**: 8분 만에 설정 완료
- **에러 그룹핑**: 중복 에러 자동 그룹화
- **소스맵 지원**: 프로덕션 스택 트레이스
- **onRequestError**: Next.js 15 네이티브 훅 지원

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
})
```

#### AI 발행 알림

```typescript
// lib/utils/notify.ts
interface AIPublishNotification {
  title: string
  slug: string
  type: string
  tokensUsed: number
}

export async function notifyAIPublish(data: AIPublishNotification): Promise<void> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL

  if (!webhookUrl) return

  const embed = {
    title: '새 AI 포스트 발행',
    color: 0x7c3aed, // Purple
    fields: [
      { name: '제목', value: data.title, inline: false },
      { name: '타입', value: data.type, inline: true },
      { name: '토큰', value: String(data.tokensUsed), inline: true },
    ],
    url: `https://yourblog.com/blog/${data.slug}`,
    timestamp: new Date().toISOString(),
  }

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ embeds: [embed] }),
  })
}
```

#### 대안
- **LogRocket**: 세션 리플레이 중심
- **Posthog**: 오픈소스 Analytics
- **Axiom**: 로그 중심 모니터링

---

## 11. Developer Experience - 린터, 포매터, 테스트

### 선택 기술

| 항목 | 선택 | 버전 | 선택 이유 |
|------|------|------|-----------|
| **Linter/Formatter** | Biome | 2.x | ESLint+Prettier 대비 20x 빠름 |
| **Git Hooks** | lefthook | latest | Husky 대안, 빠른 실행 |
| **Testing** | Vitest | 3.x | Jest 대비 10x 빠름, ESM 네이티브 |
| **E2E Testing** | Playwright | 1.x | 크로스 브라우저, 안정성 |
| **Type Checking** | tsc | - | TypeScript 내장 |

### 상세 설명

#### Biome 선택 근거 (vs ESLint + Prettier)
- **성능**: 10k 라인 린트 200ms (ESLint 3-5초)
- **통합**: 린터 + 포매터 단일 도구
- **97% Prettier 호환**: 거의 동일한 출력
- **제로 설정**: 기본값으로 시작 가능

```json
// biome.json
{
  "$schema": "https://biomejs.dev/schemas/2.0/schema.json",
  "organizeImports": { "enabled": true },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "complexity": {
        "noExcessiveCognitiveComplexity": "warn"
      },
      "style": {
        "noNonNullAssertion": "warn"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "asNeeded"
    }
  }
}
```

#### Vitest 선택 근거 (vs Jest)
- **성능**: Watch 모드 10-20x 빠름
- **ESM 네이티브**: 설정 불필요
- **Jest 호환**: 마이그레이션 용이 (95% 호환)
- **Vite 통합**: HMR 기반 빠른 피드백

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      threshold: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
})
```

#### Git Hooks (lefthook)

```yaml
# lefthook.yml
pre-commit:
  parallel: true
  commands:
    biome:
      glob: "*.{js,ts,jsx,tsx,json}"
      run: pnpm biome check --write --staged
    typecheck:
      run: pnpm tsc --noEmit

pre-push:
  commands:
    test:
      run: pnpm test run
```

#### 대안
- **ESLint + Prettier**: 더 많은 플러그인 생태계
- **Jest**: React Native 필수, 성숙한 생태계
- **Cypress**: E2E 시각적 디버깅

---

## 12. Security - 보안 관련 설정

### 보안 체크리스트

#### 인증/인가
- [x] JWT HTTP-only 쿠키 사용
- [x] CSRF 보호 (SameSite=Lax)
- [x] Rate Limiting (로그인, AI 기능)
- [x] 환경변수로 비밀번호 관리

#### 입력 검증
- [x] Zod 스키마 검증 (API Routes)
- [x] MDX 콘텐츠 Sanitization
- [x] SQL Injection 방지 (Drizzle ORM)

#### API 보안
- [x] CORS 설정 (동일 출처만 허용)
- [x] API Rate Limiting
- [x] 에러 메시지 정보 노출 방지

#### 인프라 보안
- [x] HTTPS 강제 (Vercel 기본)
- [x] 환경변수 암호화 (Vercel)
- [x] 종속성 취약점 스캔

### 구현 예시

#### API Rate Limiting

```typescript
// app/api/ai/summarize/route.ts
import { NextResponse } from 'next/server'
import { ipRateLimiter } from '@/lib/ai/rate-limit'
import { z } from 'zod'

const requestSchema = z.object({
  content: z.string().min(1).max(10000),
})

export async function POST(request: Request) {
  // 1. Rate Limiting
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
  const { success, remaining } = await ipRateLimiter.limit(ip)

  if (!success) {
    return NextResponse.json(
      { error: '요청 한도 초과. 1시간 후 다시 시도해주세요.' },
      { status: 429, headers: { 'X-RateLimit-Remaining': '0' } }
    )
  }

  // 2. 입력 검증
  const body = await request.json()
  const result = requestSchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json(
      { error: '잘못된 요청입니다.' },
      { status: 400 }
    )
  }

  // 3. 비즈니스 로직
  try {
    const summary = await generateSummary(result.data.content)
    return NextResponse.json(
      { summary },
      { headers: { 'X-RateLimit-Remaining': String(remaining) } }
    )
  } catch (error) {
    // 에러 상세 정보 숨김
    console.error('Summary generation failed:', error)
    return NextResponse.json(
      { error: '요약 생성에 실패했습니다.' },
      { status: 500 }
    )
  }
}
```

#### Content Security Policy

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://pagead2.googlesyndication.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self'",
              "connect-src 'self' https://api.anthropic.com https://www.google-analytics.com",
              "frame-src 'self' https://googleads.g.doubleclick.net",
            ].join('; '),
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

export default nextConfig
```

---

## 전체 package.json

```json
{
  "name": "ai-blog",
  "version": "1.0.0",
  "private": true,
  "packageManager": "pnpm@10.28.0",
  "scripts": {
    "dev": "next dev --turbo",
    "build": "content-collections build && next build",
    "start": "next start",
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "format": "biome format --write .",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "db:push": "drizzle-kit push",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio",
    "generate:daily-tip": "tsx scripts/auto-generators/daily-tip.ts",
    "generate:github-trends": "tsx scripts/auto-generators/github-trends.ts",
    "newsletter:daily": "tsx scripts/newsletter/send-daily.ts",
    "newsletter:weekly": "tsx scripts/newsletter/send-weekly.ts",
    "prepare": "lefthook install"
  },
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@content-collections/core": "^2.0.0",
    "@content-collections/mdx": "^2.0.0",
    "@content-collections/next": "^2.0.0",
    "@anthropic-ai/sdk": "^0.40.0",
    "@neondatabase/serverless": "^0.10.0",
    "drizzle-orm": "^0.40.0",
    "@upstash/ratelimit": "^2.0.0",
    "@upstash/redis": "^1.35.0",
    "jose": "^5.10.0",
    "resend": "^4.0.0",
    "@react-email/components": "^0.0.30",
    "@octokit/rest": "^21.0.0",
    "react-hook-form": "^7.55.0",
    "@hookform/resolvers": "^3.10.0",
    "zod": "^3.24.0",
    "@uiw/react-md-editor": "^4.0.0",
    "lucide-react": "^0.470.0",
    "framer-motion": "^11.15.0",
    "shiki": "^1.25.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.7.0",
    "@sentry/nextjs": "^8.45.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "@types/node": "^22.10.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "drizzle-kit": "^0.30.0",
    "@biomejs/biome": "2.0.0",
    "vitest": "^3.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "vite-tsconfig-paths": "^5.1.0",
    "@testing-library/react": "^16.1.0",
    "@testing-library/jest-dom": "^6.6.0",
    "jsdom": "^26.0.0",
    "@playwright/test": "^1.50.0",
    "lefthook": "^1.10.0",
    "tsx": "^4.19.0"
  }
}
```

---

## 폴더 구조 (최종)

```
ai-blog/
├── app/
│   ├── (main)/
│   │   ├── page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   ├── [slug]/page.tsx
│   │   │   └── category/[cat]/page.tsx
│   │   ├── reading/
│   │   ├── ai-lab/
│   │   ├── about/
│   │   └── layout.tsx
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── posts/
│   │   ├── comments/page.tsx
│   │   ├── subscribers/page.tsx
│   │   ├── analytics/page.tsx
│   │   └── ai-logs/page.tsx
│   ├── api/
│   │   ├── auth/
│   │   ├── posts/
│   │   ├── admin/
│   │   ├── ai/
│   │   ├── newsletter/
│   │   └── cron/
│   └── layout.tsx
├── content/
│   ├── posts/
│   │   ├── manual/
│   │   └── ai-generated/
│   ├── reading/
│   └── ai-lab/
├── components/
│   ├── ui/           # shadcn/ui
│   ├── layout/
│   ├── admin/
│   ├── blog/
│   ├── editor/
│   ├── ai-features/
│   └── mdx/
├── lib/
│   ├── ai/
│   │   ├── claude.ts
│   │   ├── rate-limit.ts
│   │   └── prompts/
│   ├── db/
│   │   ├── schema.ts
│   │   ├── client.ts
│   │   └── queries.ts
│   ├── email/
│   ├── auth.ts
│   ├── github.ts        # GitHub API (Octokit)
│   └── utils/
├── hooks/               # 커스텀 훅 (추후 Zustand 필요시 stores/로 대체)
│   └── use-editor-modal.ts
├── emails/
│   ├── daily-newsletter.tsx
│   └── weekly-newsletter.tsx
├── scripts/
│   ├── auto-generators/
│   └── newsletter/
├── .github/
│   └── workflows/
├── public/
├── content-collections.ts
├── next.config.ts
├── tailwind.config.ts
├── biome.json
├── vitest.config.ts
├── drizzle.config.ts
├── lefthook.yml
├── .env.local
└── package.json
```

---

## 요약 및 참고 자료

### 기술 스택 요약

| 레이어 | 선택 기술 |
|--------|-----------|
| **Framework** | Next.js 15/16 + React 19 + TypeScript 5.x |
| **Package Manager** | pnpm 10.x |
| **Styling** | Tailwind CSS 3.x + shadcn/ui |
| **Content** | Content Collections + MDX |
| **Database** | Neon + Drizzle ORM |
| **Auth** | jose (JWT) + HTTP-only Cookie |
| **AI** | Anthropic Claude (Sonnet 4 / Haiku 4.5) |
| **Email** | Resend + React Email |
| **Hosting** | Vercel |
| **CI/CD** | GitHub Actions |
| **Monitoring** | Sentry + Vercel Analytics + GA4 |
| **DX** | Biome + Vitest + Playwright + lefthook |

### 예상 월간 비용

| 항목 | 비용 |
|------|------|
| Vercel Hobby | $0 |
| Neon Free | $0 |
| Resend Free (3,000통) | $0 |
| Claude API | $3-5 |
| 도메인 (연간 / 12) | ~$1 |
| **총합** | **~$5/월** |

### 참고 자료

- [Next.js 15 Release Notes](https://nextjs.org/blog/next-15)
- [Next.js 16 Release Notes](https://nextjs.org/blog/next-16)
- [Tailwind CSS v4.0](https://tailwindcss.com/blog/tailwindcss-v4)
- [Content Collections Migration from Contentlayer](https://dub.co/blog/content-collections)
- [pnpm 10 Features](https://pnpm.io/blog/2025/12/29/pnpm-in-2025)
- [Drizzle vs Prisma 2026 Comparison](https://medium.com/@codabu/drizzle-vs-prisma-choosing-the-right-typescript-orm-in-2026-deep-dive-63abb6aa882b)
- [Neon vs Supabase Comparison](https://www.bytebase.com/blog/neon-vs-supabase/)
- [Biome Migration Guide 2026](https://dev.to/pockit_tools/biome-the-eslint-and-prettier-killer-complete-migration-guide-for-2026-27m)
- [Vitest vs Jest 2026](https://dev.to/dataformathub/vitest-vs-jest-30-why-2026-is-the-year-of-browser-native-testing-2fgb)
- [Resend Pricing](https://resend.com/pricing)
- [Anthropic Claude API](https://platform.claude.com/docs/en/release-notes/overview)
