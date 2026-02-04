import { AdminSidebar } from './AdminSidebar'

interface AdminLayoutProps {
  children: React.ReactNode
}

/**
 * Admin pages layout with sidebar
 * Used by authenticated admin pages
 */
export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {children}
      </main>
    </div>
  )
}
