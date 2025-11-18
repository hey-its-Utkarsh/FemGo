
'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Users, UserCheck, CircleDollarSign, ShieldAlert, BarChart3, Settings, LogOut, Activity } from "lucide-react";
import adminData from '@/data/admin.json';
import Link from 'next/link';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

const stats = [
    { title: "Total Rides", value: adminData.stats.totalRides, icon: Car, color: "text-blue-500" },
    { title: "Active Drivers", value: adminData.stats.activeDrivers, icon: UserCheck, color: "text-green-500" },
    { title: "Registered Passengers", value: adminData.stats.registeredPassengers, icon: Users, color: "text-purple-500" },
    { title: "Total Revenue", value: `$${(adminData.stats.revenue / 1000).toFixed(1)}k`, icon: CircleDollarSign, color: "text-yellow-500" },
    { title: "SOS Alerts", value: adminData.stats.sosAlerts, icon: ShieldAlert, color: "text-red-500" },
];

const menuItems = [
    { title: "User Management", href: "/admin/users", icon: Users },
    { title: "Driver Management", href: "/admin/drivers", icon: UserCheck },
    { title: "Ride Logs", href: "/admin/rides", icon: Car },
    { title: "SOS Monitoring", href: "/admin/sos", icon: ShieldAlert },
    { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

const chartData = [
  { date: "2024-07-23", rides: 186 },
  { date: "2024-07-24", rides: 205 },
  { date: "2024-07-25", rides: 257 },
  { date: "2024-07-26", rides: 230 },
  { date: "2024-07-27", rides: 280 },
  { date: "2024-07-28", rides: 310 },
  { date: "2024-07-29", rides: 295 },
]

const chartConfig = {
  rides: {
    label: "Rides",
    color: "hsl(var(--primary))",
  },
}

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 bg-card shadow-md flex-col hidden md:flex">
        <div className="h-20 flex items-center justify-center border-b">
          <Link href="/admin" className="text-2xl font-bold text-primary">SafeHer Admin</Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
            {menuItems.map(item => (
                <Link key={item.href} href={item.href}>
                    <span className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-primary">
                        <item.icon className="h-5 w-5" />
                        {item.title}
                    </span>
                </Link>
            ))}
        </nav>
        <div className="p-4 border-t">
            <Link href="/admin/settings">
                 <span className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-primary">
                    <Settings className="h-5 w-5" />
                    Settings
                </span>
            </Link>
            <Link href="/login/admin">
                 <span className="flex items-center gap-3 rounded-lg px-3 py-2 text-red-500 transition-all hover:bg-red-500/10">
                    <LogOut className="h-5 w-5" />
                    Logout
                </span>
            </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-20 flex items-center justify-between bg-card shadow-sm px-8">
            <h2 className="text-2xl font-semibold text-foreground">Dashboard Overview</h2>
        </header>
        <main className="flex-1 p-8 bg-background">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {stats.map(stat => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity /> Recent Activity (Last 7 Days)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ChartContainer config={chartConfig} className="w-full h-[300px]">
                            <AreaChart data={chartData} margin={{ left: 12, right: 12, top: 10, bottom: 10 }}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                />
                                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <defs>
                                    <linearGradient id="fillRides" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-rides)" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="var(--color-rides)" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <Area
                                    dataKey="rides"
                                    type="natural"
                                    fill="url(#fillRides)"
                                    stroke="var(--color-rides)"
                                    stackId="a"
                                />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </main>
      </div>
    </div>
  );
}
