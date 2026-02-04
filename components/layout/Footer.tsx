export default function Footer() {
  return (
    <footer className="border-t bg-gray-50 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold mb-2">AI 블로그</h3>
            <p className="text-sm text-muted-foreground">
              개인 블로그 + AI 자동화 콘텐츠 플랫폼
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-2">카테고리</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <a href="/blog/category/tech" className="text-muted-foreground hover:text-primary">
                  기술
                </a>
              </li>
              <li>
                <a
                  href="/blog/category/reading"
                  className="text-muted-foreground hover:text-primary"
                >
                  독서
                </a>
              </li>
              <li>
                <a
                  href="/blog/category/manual"
                  className="text-muted-foreground hover:text-primary"
                >
                  일상
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-2">링크</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <a href="/about" className="text-muted-foreground hover:text-primary">
                  소개
                </a>
              </li>
              <li>
                <a href="/blog" className="text-muted-foreground hover:text-primary">
                  전체 포스트
                </a>
              </li>
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
