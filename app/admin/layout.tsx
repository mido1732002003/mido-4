import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/utils'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { AdminNav } from '@/components/layout/admin-nav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdmin()
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="container flex-1 py-8">
        <div className="grid gap-8 md:grid-cols-4">
          <aside className="md:col-span-1">
            <AdminNav />
          </aside>
          <main className="md:col-span-3">{children}</main>
        </div>
      </div>
      <Footer />
    </div>
  )
}