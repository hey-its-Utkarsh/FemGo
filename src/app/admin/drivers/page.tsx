
'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Car, ShieldAlert, BarChart3, Settings, LogOut, Mic, Camera, CheckCircle, XCircle } from "lucide-react";
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import driversData from '@/data/drivers.json';
import complaintsData from '@/data/complaints.json';
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { useState } from "react";

const menuItems = [
    { title: "User Management", href: "/admin/users", icon: Users },
    { title: "Driver Management", href: "/admin/drivers", icon: UserCheck },
    { title: "Ride Logs", href: "/admin/rides", icon: Car },
    { title: "SOS Monitoring", href: "/admin/sos", icon: ShieldAlert },
    { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

export default function DriverManagementPage() {
  const [drivers, setDrivers] = useState(driversData);

  const getDriverComplaints = (driverId: string) => {
    return complaintsData.filter(c => c.driverId === driverId).length;
  }

  const pendingDrivers = drivers.filter(d => d.verificationStatus === 'pending');
  const verifiedDrivers = drivers
    .filter(d => d.verificationStatus !== 'pending')
    .sort((a, b) => getDriverComplaints(b.id) - getDriverComplaints(a.id));

  const handleApproveDriver = (driverId: string) => {
    setDrivers(prevDrivers => 
      prevDrivers.map(driver => 
        driver.id === driverId ? { ...driver, verificationStatus: 'verified' } : driver
      )
    );
  };

  const handleRejectDriver = (driverId: string) => {
    setDrivers(prevDrivers => prevDrivers.filter(driver => driver.id !== driverId));
  };

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
        <main className="flex-1 p-8 bg-gray-50 dark:bg-background space-y-8">

          {/* Pending Verifications */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Pending Manual Verification</h3>
            {pendingDrivers.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pendingDrivers.map(driver => (
                  <Card key={driver.id}>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span>{driver.name}</span>
                        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700">Pending</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2"><Mic/> Voice Sample</h4>
                          <Button variant="outline" className="w-full">Play Voice Sample</Button>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2"><Camera/> Submitted Photos</h4>
                          <div className="flex gap-2">
                            <Image src={driver.signupData.photos.front} alt="Front profile" width={60} height={60} className="rounded-md" data-ai-hint="woman portrait" />
                            <Image src={driver.signupData.photos.left} alt="Left profile" width={60} height={60} className="rounded-md" data-ai-hint="woman profile" />
                            <Image src={driver.signupData.photos.right} alt="Right profile" width={60} height={60} className="rounded-md" data-ai-hint="woman profile" />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-4 pt-4">
                        <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => handleApproveDriver(driver.id)}><CheckCircle className="mr-2"/> Approve</Button>
                        <Button variant="destructive" className="w-full" onClick={() => handleRejectDriver(driver.id)}><XCircle className="mr-2"/> Reject</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No drivers are currently pending verification.</p>
            )}
          </div>

          {/* Registered Drivers */}
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
                    <TableHead>Complaints</TableHead>
                    <TableHead>Availability</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {verifiedDrivers.map(driver => (
                    <TableRow key={driver.id}>
                      <TableCell className="font-medium">{driver.name}</TableCell>
                      <TableCell>{driver.vehicle}</TableCell>
                      <TableCell>{driver.rating}</TableCell>
                      <TableCell>
                          <Badge variant={getDriverComplaints(driver.id) > 0 ? 'destructive' : 'default'} className={getDriverComplaints(driver.id) > 0 ? '' : 'bg-transparent text-muted-foreground'}>
                            {getDriverComplaints(driver.id)}
                          </Badge>
                      </TableCell>
                      <TableCell>
                          <Badge variant={driver.availability === 'available' ? 'default' : 'secondary'} className={driver.availability === 'available' ? 'bg-green-500/20 text-green-700' : 'bg-orange-500/20 text-orange-700'}>
                              {driver.availability}
                          </Badge>
                      </TableCell>
                      <TableCell>
                          <Button variant="ghost" size="sm">View Details</Button>
                          <Button variant="ghost" size="sm" className="text-destructive">Suspend</Button>
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
