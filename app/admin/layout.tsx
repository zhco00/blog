/**
 * Admin layout - renders children without sidebar
 * Each admin page is responsible for its own authentication check
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
