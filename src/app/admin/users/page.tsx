
'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Car, ShieldAlert, BarChart3, Settings, LogOut, CheckCircle, XCircle, Mic, Camera } from "lucide-react";
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import usersData from '@/data/users.json';
import complaintsData from '@/data/complaints.json';
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";

const menuItems = [
    { title: "User Management", href: "/admin/users", icon: Users },
    { title: "Driver Management", href: "/admin/drivers", icon: UserCheck },
    { title: "Ride Logs", href: "/admin/rides", icon: Car },
    { title: "SOS Monitoring", href: "/admin/sos", icon: ShieldAlert },
    { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

export default function UserManagementPage() {
  const [users, setUsers] = useState(usersData);

  const getPassengerComplaints = (passengerId: string) => {
    return complaintsData.filter(c => c.passengerId === passengerId && c.complainant === 'driver').length;
  }
  
  const pendingUsers = users.filter(u => u.verificationStatus === 'pending');
  const verifiedUsers = users
    .filter(u => u.verificationStatus !== 'pending')
    .sort((a, b) => getPassengerComplaints(b.id) - getPassengerComplaints(a.id));

  const handleApproveUser = (userId: string) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? { ...user, verificationStatus: 'verified' } : user
      )
    );
  };

  const handleRejectUser = (userId: string) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
  };


  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
       <aside className="w-64 bg-card shadow-md flex-col hidden md:flex">
        <div className="h-20 flex items-center justify-center border-b">
          <Link href="/admin" className="text-2xl font-bold text-primary">FemGo Admin</Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
            {menuItems.map(item => (
                <Link key={item.href} href={item.href}>
                    <span className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent/20 hover:text-primary ${item.href.includes('users') ? 'bg-accent/20 text-primary' : ''}`}>
                        <item.icon className="h-5 w-5" />
                        {item.title}
                    </span>
                </Link>
            ))}
        </nav>
        <div className="p-4 border-t">
            <Link href="/admin/settings">
                 <span className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent/20 hover:text-primary">
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
            <h2 className="text-2xl font-semibold text-foreground">User Management</h2>
        </header>
        <main className="flex-1 p-8 bg-background space-y-8">
          
          {/* Pending Verifications */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Pending User Verifications</h3>
            {pendingUsers.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pendingUsers.map(user => (
                  <Card key={user.id}>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span>{user.name}</span>
                        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700">Pending</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <p className="text-muted-foreground">{user.phone}</p>
                       <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2"><Mic/> Voice Sample</h4>
                          <Button variant="outline" className="w-full">Play Voice Sample</Button>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2"><Camera/> Submitted Photos</h4>
                          <div className="flex gap-2">
                            <Image src={user.signupData.photos.front} alt="Front profile" width={60} height={60} className="rounded-md" data-ai-hint="woman portrait" />
                            <Image src={user.signupData.photos.left} alt="Left profile" width={60} height={60} className="rounded-md" data-ai-hint="woman profile" />
                            <Image src={user.signupData.photos.right} alt="Right profile" width={60} height={60} className="rounded-md" data-ai-hint="woman profile" />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-4 pt-4">
                        <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => handleApproveUser(user.id)}><CheckCircle className="mr-2"/> Approve</Button>
                        <Button variant="destructive" className="w-full" onClick={() => handleRejectUser(user.id)}><XCircle className="mr-2"/> Reject</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No users are currently pending verification.</p>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Registered Passengers</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Verification Status</TableHead>
                    <TableHead>Complaints</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {verifiedUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>
                        <Badge variant={user.verificationStatus === 'verified' ? 'default' : 'secondary'} className={user.verificationStatus === 'verified' ? 'bg-green-500/20 text-green-700' : 'bg-yellow-500/20 text-yellow-700'}>
                          {user.verificationStatus}
                        </Badge>
                      </TableCell>
                       <TableCell>
                          <Badge variant={getPassengerComplaints(user.id) > 0 ? 'destructive' : 'default'} className={getPassengerComplaints(user.id) > 0 ? '' : 'bg-transparent text-muted-foreground'}>
                            {getPassengerComplaints(user.id)}
                          </Badge>
                      </TableCell>
                      <TableCell>
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/80">Delete</Button>
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
