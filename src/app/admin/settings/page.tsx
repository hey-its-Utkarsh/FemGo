
'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Car, ShieldAlert, BarChart3, Settings, LogOut } from "lucide-react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const menuItems = [
    { title: "User Management", href: "/admin/users", icon: Users },
    { title: "Driver Management", href: "/admin/drivers", icon: UserCheck },
    { title: "Ride Logs", href: "/admin/rides", icon: Car },
    { title: "SOS Monitoring", href: "/admin/sos", icon: ShieldAlert },
    { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-background">
      {/* Sidebar */}
       <aside className="w-64 bg-white dark:bg-card shadow-md flex-col hidden md:flex">
        <div className="h-20 flex items-center justify-center border-b">
          <Link href="/" className="text-2xl font-bold text-primary">SafeHer Admin</Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
            {menuItems.map(item => (
                <Link key={item.href} href={item.href}>
                    <span className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 dark:text-muted-foreground transition-all hover:bg-accent hover:text-primary`}>
                        <item.icon className="h-5 w-5" />
                        {item.title}
                    </span>
                </Link>
            ))}
        </nav>
        <div className="p-4 border-t">
            <Link href="/admin/settings">
                 <span className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 dark:text-muted-foreground transition-all bg-accent text-primary">
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
            <h2 className="text-2xl font-semibold text-foreground">Settings</h2>
        </header>
        <main className="flex-1 p-8 bg-gray-50 dark:bg-background">
          <div className="max-w-2xl mx-auto space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="Admin User" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="admin@safeher.com" />
                </div>
                <Button>Update Profile</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sos-alerts">SOS Alert Emails</Label>
                  <Switch id="sos-alerts" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="weekly-summary">Weekly Summary Reports</Label>
                  <Switch id="weekly-summary" />
                </div>
              </CardContent>
            </Card>

             <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                </div>
                 <div className="space-y-1">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                </div>
                <Button>Change Password</Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
