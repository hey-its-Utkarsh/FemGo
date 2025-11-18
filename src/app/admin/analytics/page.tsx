
'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Car, ShieldAlert, BarChart3, Settings, LogOut, CircleDollarSign, Clock, PieChart } from "lucide-react";
import Link from 'next/link';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart as RechartsPieChart } from "recharts"

const menuItems = [
    { title: "User Management", href: "/admin/users", icon: Users },
    { title: "Driver Management", href: "/admin/drivers", icon: UserCheck },
    { title: "Ride Logs", href: "/admin/rides", icon: Car },
    { title: "SOS Monitoring", href: "/admin/sos", icon: ShieldAlert },
    { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

const revenueData = [
  { month: "Jan", revenue: 21000 },
  { month: "Feb", revenue: 25000 },
  { month: "Mar", revenue: 32000 },
  { month: "Apr", revenue: 30000 },
  { month: "May", revenue: 41000 },
  { month: "Jun", revenue: 38000 },
]

const peakHoursData = [
  { hour: "08:00", rides: 15 },
  { hour: "09:00", rides: 25 },
  { hour: "12:00", rides: 20 },
  { hour: "15:00", rides: 35 },
  { hour: "18:00", rides: 45 },
  { hour: "21:00", rides: 30 },
]

const rideStatusData = [
    { name: 'Completed', value: 1345, fill: 'var(--color-completed)' },
    { name: 'Requested', value: 58, fill: 'var(--color-requested)' },
    { name: 'Cancelled', value: 112, fill: 'var(--color-cancelled)' },
];

const chartConfig = {
  revenue: { label: "Revenue", color: "hsl(var(--primary))" },
  rides: { label: "Rides", color: "hsl(var(--secondary))" },
  completed: { label: "Completed", color: "#22c55e" },
  requested: { label: "Requested", color: "#3b82f6" },
  cancelled: { label: "Cancelled", color: "#ef4444" },
}

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-background">
      {/* Sidebar */}
       <aside className="w-64 bg-white dark:bg-card shadow-md flex-col hidden md:flex">
        <div className="h-20 flex items-center justify-center border-b">
          <Link href="/admin" className="text-2xl font-bold text-primary">SafeHer Admin</Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
            {menuItems.map(item => (
                <Link key={item.href} href={item.href}>
                    <span className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 dark:text-muted-foreground transition-all hover:bg-accent hover:text-primary ${item.href.includes('analytics') ? 'bg-accent text-primary' : ''}`}>
                        <item.icon className="h-5 w-5" />
                        {item.title}
                    </span>
                </Link>
            ))}
        </nav>
        <div className="p-4 border-t">
            <Link href="/admin/settings">
                 <span className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 dark:text-muted-foreground transition-all hover:bg-accent hover:text-primary">
                    <Settings className="h-5 w-5" />
                    Settings
                </span>
            </Link>
            <Link href="/login/admin">
                 <span className="flex items-center gap-3 rounded-lg px-3 py-2 text-red-500 transition-all hover:bg-red-50">
                    <LogOut className="h-5 w-5" />
                    Logout
                </span>
            </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-20 flex items-center justify-between bg-white dark:bg-card shadow-sm px-8">
            <h2 className="text-2xl font-semibold text-foreground">Platform Analytics</h2>
        </header>
        <main className="flex-1 p-8 bg-gray-50 dark:bg-background">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><CircleDollarSign /> Monthly Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="w-full h-[250px]">
                  <AreaChart data={revenueData} margin={{ left: 0, right: 20 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `$${value/1000}k`} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <defs>
                        <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="revenue" stroke="var(--color-revenue)" fill="url(#fillRevenue)" />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Clock /> Peak Ride Hours</CardTitle>
              </CardHeader>
              <CardContent>
                 <ChartContainer config={chartConfig} className="w-full h-[250px]">
                  <BarChart data={peakHoursData} margin={{ left: 0, right: 20 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="hour" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="rides" fill="var(--color-rides)" radius={4} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><PieChart /> Ride Status Distribution</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                 <ChartContainer config={chartConfig} className="w-full h-[300px]">
                    <RechartsPieChart>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Pie data={rideStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                          const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                          const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                          const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                          return (
                            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
                              {`${(percent * 100).toFixed(0)}%`}
                            </text>
                          );
                        }} />
                    </RechartsPieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
