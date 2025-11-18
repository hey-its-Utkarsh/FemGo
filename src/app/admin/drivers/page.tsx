
'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Car, ShieldAlert, BarChart3, Settings, LogOut } from "lucide-react";
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import driversData from '@/data/drivers.json';
import { Button } from "@/components/ui/button";

const menuItems = [
    { title: "User Management", href: "/admin/users", icon: Users },
    { title: "Driver Management", href: "/admin/drivers", icon: UserCheck },
    { title: "Ride Logs", href: "/admin/rides", icon: Car },
    { title: "SOS Monitoring", href: "/admin/sos", icon: ShieldAlert },
    { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

export default function DriverManagementPage() {
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
                    <span className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 dark:text-muted-foreground transition-all hover:bg-accent hover:text-primary ${item.href.includes('drivers') ? 'bg-accent text-primary' : ''}`}>
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
            <h2 className="text-2xl font-semibold text-foreground">Driver Management</h2>
        </header>
        <main className="flex-1 p-8 bg-gray-50 dark:bg-background">
          <Card>
            <CardHeader>
              <CardTitle>Registered Drivers</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Availability</TableHead>
                    <TableHead>Verification Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {driversData.map(driver => (
                    <TableRow key={driver.id}>
                      <TableCell className="font-medium">{driver.name}</TableCell>
                      <TableCell>{driver.vehicle}</TableCell>
                      <TableCell>{driver.rating}</TableCell>
                      <TableCell>
                          <Badge variant={driver.availability === 'available' ? 'default' : 'secondary'} className={driver.availability === 'available' ? 'bg-green-500/20 text-green-700' : 'bg-orange-500/20 text-orange-700'}>
                              {driver.availability}
                          </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={driver.verificationStatus === 'verified' ? 'default' : 'secondary'} className={driver.verificationStatus === 'verified' ? 'bg-green-500/20 text-green-700' : 'bg-yellow-500/20 text-yellow-700'}>
                          {driver.verificationStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm" className="text-destructive">Delete</Button>
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
