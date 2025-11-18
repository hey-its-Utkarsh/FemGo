
'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Car, ShieldAlert, BarChart3, Settings, LogOut } from "lucide-react";
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import sosData from '@/data/sos.json';
import usersData from '@/data/users.json';
import { Button } from "@/components/ui/button";

const menuItems = [
    { title: "User Management", href: "/admin/users", icon: Users },
    { title: "Driver Management", href: "/admin/drivers", icon: UserCheck },
    { title: "Ride Logs", href: "/admin/rides", icon: Car },
    { title: "SOS Monitoring", href: "/admin/sos", icon: ShieldAlert },
    { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

const getUserName = (userId: string) => usersData.find(u => u.id === userId)?.name || 'Unknown';

export default function SosMonitoringPage() {
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
                    <span className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-primary ${item.href.includes('sos') ? 'bg-accent text-primary' : ''}`}>
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
            <h2 className="text-2xl font-semibold text-foreground">SOS Monitoring</h2>
        </header>
        <main className="flex-1 p-8 bg-background">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2"><ShieldAlert /> Active SOS Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Ride ID</TableHead>
                    <TableHead>Last Known Location</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sosData.map(sos => (
                    <TableRow key={sos.id} className="bg-red-500/10">
                      <TableCell>{new Date(sos.timestamp).toUTCString()}</TableCell>
                      <TableCell>{getUserName(sos.userId)}</TableCell>
                      <TableCell>{sos.rideId}</TableCell>
                      <TableCell>{sos.location}</TableCell>
                      <TableCell>
                          <Button variant="destructive" size="sm">View Details</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
