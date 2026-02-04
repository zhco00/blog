# AI 블로그

개인 블로그 + AI 자동화 콘텐츠 플랫폼

## 기술 스택

- **Framework**: Next.js 15 + React 19 + TypeScript
- **Package Manager**: pnpm 10.28.0
- **Styling**: Tailwind CSS 3.x
- **Content**: Content Collections + MDX
- **Linter/Formatter**: Biome
- **Testing**: Vitest
- **Git Hooks**: lefthook

## 시작하기

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 환경변수 설정

`.env.example`을 복사하여 `.env.local` 생성:

```bash
cp .env.example .env.local
```

필수 환경변수를 설정하세요.

### 3. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3005](http://localhost:3005) 열기

## 주요 명령어

```bash
# 개발
pnpm dev              # 개발 서버 시작 (Turbopack)
pnpm build            # 프로덕션 빌드
pnpm start            # 프로덕션 서버 시작

# 코드 품질
pnpm lint             # Biome 린트 체크
pnpm lint:fix         # Biome 자동 수정
pnpm format           # Biome 포맷팅
pnpm typecheck        # TypeScript 타입 체크

# 테스트
pnpm test             # Vitest 실행 (watch 모드)
pnpm test:coverage    # 커버리지 리포트 생성
```

## 프로젝트 구조

```
ai-blog/
├── app/                      # Next.js App Router
│   ├── (main)/              # 메인 레이아웃 그룹
│   │   ├── layout.tsx       # 메인 레이아웃 (Header + Footer)
│   │   ├── page.tsx         # 홈페이지
│   │   ├── blog/            # 블로그 페이지
│   │   │   ├── page.tsx     # 블로그 목록
│   │   │   ├── [slug]/      # 블로그 상세
│   │   │   └── category/[cat]/ # 카테고리별 목록
│   │   ├── reading/         # 독서 페이지
│   │   │   ├── page.tsx     # 독서 목록
│   │   │   └── [slug]/      # 독서 상세
│   │   └── about/           # 소개 페이지
│   ├── layout.tsx           # 루트 레이아웃
│   ├── sitemap.ts           # 사이트맵
│   ├── robots.ts            # robots.txt
│   └── globals.css          # 전역 스타일
├── content/                  # MDX 콘텐츠
│   ├── posts/               # 블로그 포스트
│   │   └── manual/          # 수동 작성 포스트
│   └── reading/             # 독서 기록
├── components/               # React 컴포넌트
│   ├── layout/              # 레이아웃 컴포넌트
│   │   ├── Header.tsx       # 헤더 (네비게이션 + 숨겨진 W 버튼)
│   │   └── Footer.tsx       # 푸터
│   ├── blog/                # 블로그 컴포넌트
│   │   ├── PostCard.tsx     # 포스트 카드
│   │   ├── PostContent.tsx  # 포스트 콘텐츠
│   │   ├── CategoryFilter.tsx # 카테고리 필터
│   │   └── SearchBar.tsx    # 검색바
│   ├── home/                # 홈 컴포넌트
│   │   ├── Hero.tsx         # 히어로 섹션
│   │   └── FeaturedPosts.tsx # 추천 포스트
│   ├── reading/             # 독서 컴포넌트
│   │   └── BookCard.tsx     # 책 카드
│   └── ui/                  # shadcn/ui 컴포넌트
├── lib/                      # 유틸리티 함수
│   └── utils.ts             # cn 함수 등
├── docs/                     # 프로젝트 문서
├── content-collections.ts    # Content Collections 설정
├── next.config.ts           # Next.js 설정
├── tailwind.config.ts       # Tailwind CSS 설정
├── biome.json               # Biome 설정
├── vitest.config.ts         # Vitest 설정
├── lefthook.yml             # Git Hooks 설정
└── package.json             # 패키지 설정
```

## 핵심 기능

### Phase 2 (완료)

- ✅ **메인 페이지**: Hero 섹션 + 최신/추천 포스트
- ✅ **블로그 목록**: 카테고리 필터, 검색, 페이지네이션
- ✅ **블로그 상세**: MDX 렌더링, 이전/다음 네비게이션
- ✅ **카테고리 페이지**: 카테고리별 포스트 목록
- ✅ **독서 페이지**: 독서 기록 목록 및 상세
- ✅ **SEO 최적화**: sitemap.xml, robots.txt, Open Graph
- ✅ **반응형 디자인**: 모바일/태블릿/데스크톱 대응

### 콘텐츠 카테고리

- **수동 작성**: 독서 기록, 개인 이야기
- **AI 자동 포스팅**: 매일 개발 팁, 주간 GitHub 트렌딩 등 (Phase 4에서 구현 예정)

### 기술적 특징

- **Type-safe Content**: Content Collections로 MDX 타입 안전성 보장
- **Fast Refresh**: Turbopack 기반 빠른 개발 경험
- **Code Quality**: Biome으로 일관된 코드 스타일 유지
- **Testing**: Vitest로 빠른 단위 테스트

## 배포

Vercel에 자동 배포됩니다:

```bash
git push origin main
```

## 라이선스

MIT

## 문서

상세한 문서는 `/docs` 폴더 참조:

- [기능 명세](./docs/ai-blog-project-spec.md)
- [기술 아키텍처](./docs/technical-architecture.md)
