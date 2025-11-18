
'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Car, ShieldAlert, BarChart3, Settings, LogOut } from "lucide-react";
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import ridesData from '@/data/rides.json';
import usersData from '@/data/users.json';
import driversData from '@/data/drivers.json';

const menuItems = [
    { title: "User Management", href: "/admin/users", icon: Users },
    { title: "Driver Management", href: "/admin/drivers", icon: UserCheck },
    { title: "Ride Logs", href: "/admin/rides", icon: Car },
    { title: "SOS Monitoring", href: "/admin/sos", icon: ShieldAlert },
    { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

const getPassengerName = (passengerId: string) => usersData.find(u => u.id === passengerId)?.name || 'Unknown';
const getDriverName = (driverId: string) => driversData.find(d => d.id === driverId)?.name || 'N/A';

export default function RideLogsPage() {
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
                    <span className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 dark:text-muted-foreground transition-all hover:bg-accent hover:text-primary ${item.href.includes('rides') ? 'bg-accent text-primary' : ''}`}>
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
            <h2 className="text-2xl font-semibold text-foreground">Ride Logs</h2>
        </header>
        <main className="flex-1 p-8 bg-gray-50 dark:bg-background">
          <Card>
            <CardHeader>
              <CardTitle>All Ride Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Passenger</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Pickup</TableHead>
                    <TableHead>Dropoff</TableHead>
                    <TableHead>Fare</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ridesData.map(ride => (
                    <TableRow key={ride.id}>
                      <TableCell>{getPassengerName(ride.passengerId)}</TableCell>
                      <TableCell>{getDriverName(ride.driverId)}</TableCell>
                      <TableCell>{ride.pickup}</TableCell>
                      <TableCell>{ride.drop}</TableCell>
                      <TableCell>${ride.fare.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={
                            ride.rideStatus === 'completed' ? 'default' : 
                            ride.rideStatus === 'requested' ? 'secondary' : 
                            'destructive'
                        } className={
                             ride.rideStatus === 'completed' ? 'bg-green-500/20 text-green-700' :
                             ride.rideStatus === 'requested' ? 'bg-blue-500/20 text-blue-700' :
                             'bg-red-500/20 text-red-700'
                        }>
                          {ride.rideStatus}
                        </Badge>
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
