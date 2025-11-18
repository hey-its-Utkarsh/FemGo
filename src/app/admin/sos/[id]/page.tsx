
'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Car, ShieldAlert, BarChart3, Settings, LogOut, Phone, Mic, Camera, MapPin } from "lucide-react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import sosData from '@/data/sos.json';
import usersData from '@/data/users.json';
import { notFound } from 'next/navigation';
import Image from "next/image";

const menuItems = [
    { title: "User Management", href: "/admin/users", icon: Users },
    { title: "Driver Management", href: "/admin/drivers", icon: UserCheck },
    { title: "Ride Logs", href: "/admin/rides", icon: Car },
    { title: "SOS Monitoring", href: "/admin/sos", icon: ShieldAlert },
    { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

const getUserDetails = (userId: string) => usersData.find(u => u.id === userId);

export default function SosDetailsPage({ params }: { params: { id: string } }) {
    const alert = sosData.find(s => s.id === params.id);

    if (!alert) {
        notFound();
    }

    const user = getUserDetails(alert.userId);
    const capturedImages = [
        "https://picsum.photos/seed/sos1/400/300",
        "https://picsum.photos/seed/sos2/400/300",
        "https://picsum.photos/seed/sos3/400/300",
    ];

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
                            <span className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${item.href.includes('sos') ? 'bg-accent text-primary' : ''}`}>
                                <item.icon className="h-5 w-5" />
                                {item.title}
                            </span>
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t">
                    <Link href="/admin/settings">
                        <span className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
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
                    <h2 className="text-2xl font-semibold text-foreground">SOS Alert Details</h2>
                </header>
                <main className="flex-1 p-8 bg-background">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Map and Alert Info */}
                        <div className="lg:col-span-2 space-y-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><MapPin/> Live Location</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden relative">
                                        <Image src="https://picsum.photos/seed/sosmap/1200/800" alt="Live map" layout="fill" objectFit="cover" data-ai-hint="map dark city" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="relative flex items-center justify-center">
                                                <div className="absolute h-8 w-8 bg-red-500 rounded-full animate-ping"></div>
                                                <div className="relative h-4 w-4 bg-red-600 rounded-full border-2 border-white"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-center mt-2 text-muted-foreground">{alert.location}</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Camera/> Captured Images</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {capturedImages.map((img, index) => (
                                        <Image key={index} src={img} alt={`Captured image ${index + 1}`} width={400} height={300} className="rounded-lg object-cover aspect-[4/3]" data-ai-hint="distressed person car interior" />
                                    ))}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column: User and Actions */}
                        <div className="space-y-8">
                            <Card className="border-destructive">
                                <CardHeader>
                                    <CardTitle className="text-destructive flex items-center gap-2"><ShieldAlert /> Alert Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">User</p>
                                        <p className="font-semibold">{user?.name || 'Unknown User'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Contact</p>
                                        <p className="font-semibold">{user?.phone || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Time</p>
                                        <p className="font-semibold">{new Date(alert.timestamp).toUTCString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Ride ID</p>
                                        <p className="font-semibold">{alert.rideId}</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Mic/> Recorded Audio</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <audio controls className="w-full">
                                        <source src="/audio/dummy-sos-audio.mp3" type="audio/mpeg" />
                                        Your browser does not support the audio element.
                                    </audio>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button className="w-full" size="lg"><Phone className="mr-2"/> Contact User</Button>
                                    <Button className="w-full" size="lg" variant="outline">Contact Driver</Button>
                                    <Button className="w-full" size="lg" variant="destructive">Escalate to Authorities</Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
