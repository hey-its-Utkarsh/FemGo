
'use client';

import MobileHeader from "@/components/femgo/layout/MobileHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Heart, LogOut, Shield, User } from "lucide-react";
import Link from "next/link";
import users from '@/data/users.json';

export default function ProfilePage() {
    const user = users[0];

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <MobileHeader title="Profile" backPath="/passenger" />
            <main className="flex-1 p-4">
                <Card className="w-full text-center p-6">
                    <Avatar className="w-24 h-24 mx-auto border-4 border-primary">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${user.id}`} alt={user.name} data-ai-hint="woman portrait" />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h1 className="text-2xl font-bold mt-4">{user.name}</h1>
                    <p className="text-muted-foreground">{user.phone}</p>
                </Card>

                <div className="mt-6 space-y-2">
                    <ProfileMenuItem icon={User} text="Account Details" href="/passenger/profile/details" />
                    <ProfileMenuItem icon={Shield} text="Safety Center" href="/passenger/safety" />
                    <ProfileMenuItem icon={Heart} text="Emergency Contacts" href="/passenger/emergency" />
                </div>

                 <div className="mt-8">
                    <Link href="/login">
                        <Button variant="destructive" className="w-full h-12 text-base">
                            <LogOut className="mr-2" /> Logout
                        </Button>
                    </Link>
                 </div>
            </main>
        </div>
    )
}

function ProfileMenuItem({ icon: Icon, text, href }: { icon: React.ElementType, text: string, href: string }) {
    return (
        <Link href={href}>
            <Card>
                <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Icon className="w-6 h-6 text-primary" />
                        <span className="font-semibold">{text}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </CardContent>
            </Card>
        </Link>
    )
}
