import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/utils'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { AccountNav } from '@/components/layout/account-nav'

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/signin')
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="container flex-1 py-8">
        <div className="grid gap-8 md:grid-cols-4">
          <aside className="md:col-span-1">
            <AccountNav />
          </aside>
          <main className="md:col-span-3">{children}</main>
        </div>
      </div>
      <Footer />
    </div>
  )
}