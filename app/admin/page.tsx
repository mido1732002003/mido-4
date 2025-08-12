import { Metadata } from 'next'
import { DashboardStats } from '@/components/admin/dashboard-stats'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, CreditCard, Package, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
}

async function getDashboardStats() {
  // In production, create dedicated API endpoints for these
  const [productsRes, ordersRes, usersRes] = await Promise.all([
    fetch(`${process.env.APP_URL}/api/products`, { cache: 'no-store' }),
    fetch(`${process.env.APP_URL}/api/orders`, { cache: 'no-store' }),
    fetch(`${process.env.APP_URL}/api/users`, { cache: 'no-store' }),
  ])
  
  const products = await productsRes.json()
  const orders = await ordersRes.json()
  const users = await usersRes.json()
  
  // Calculate revenue (sum of paid orders)
  const revenue = orders.items
    .filter((order: any) => order.status === 'paid')
    .reduce((sum: number, order: any) => sum + order.total, 0)
  
  return {
    totalProducts: products.pagination.total,
    totalOrders: orders.pagination.total,
    totalUsers: users.pagination.total,
    totalRevenue: revenue,
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()
  
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(stats.totalRevenue / 100).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              From {stats.totalOrders} orders
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Orders
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime orders
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Active products
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered users
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest orders and user registrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Activity feed coming soon...
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <DashboardStats />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}