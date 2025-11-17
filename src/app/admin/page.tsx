'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Users, UserCheck, CircleDollarSign, ShieldAlert, BarChart3, Settings, LogOut } from "lucide-react";
import adminData from '@/data/admin.json';
import Link from 'next/link';

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

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex-col hidden md:flex">
        <div className="h-20 flex items-center justify-center border-b">
          <h1 className="text-2xl font-bold text-primary">FemGo Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
            {menuItems.map(item => (
                <Link key={item.href} href={item.href}>
                    <span className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition-all hover:bg-accent hover:text-primary">
                        <item.icon className="h-5 w-5" />
                        {item.title}
                    </span>
                </Link>
            ))}
        </nav>
        <div className="p-4 border-t">
            <Link href="/admin/settings">
                 <span className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition-all hover:bg-accent hover:text-primary">
                    <Settings className="h-5 w-5" />
                    Settings
                </span>
            </Link>
            <Link href="/">
                 <span className="flex items-center gap-3 rounded-lg px-3 py-2 text-red-500 transition-all hover:bg-red-50">
                    <LogOut className="h-5 w-5" />
                    Logout
                </span>
            </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-20 flex items-center justify-between bg-white shadow-sm px-8">
            <h2 className="text-2xl font-semibold">Dashboard Overview</h2>
            {/* Add user menu or search here */}
        </header>
        <main className="flex-1 p-8 bg-gray-50">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {stats.map(stat => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">{stat.title}</CardTitle>
                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Recent activity feed will be displayed here.</p>
                        {/* Placeholder for recent activity list/chart */}
                    </CardContent>
                </Card>
            </div>
        </main>
      </div>
    </div>
  );
}
