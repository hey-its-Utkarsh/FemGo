
'use client';
import MobileHeader from "@/components/femgo/layout/MobileHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, ShieldAlert, Users } from "lucide-react";
import Link from "next/link";

export default function DriverSafetyPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <MobileHeader title="Safety Center" backPath="/driver" />
            <main className="flex-1 p-4 text-center">
                <Card className="p-6 bg-red-50 border-destructive">
                    <ShieldAlert className="w-16 h-16 text-destructive mx-auto" />
                    <h1 className="text-2xl font-bold mt-4 text-destructive">Emergency - SOS</h1>
                    <p className="text-muted-foreground mt-2">Press the button below to immediately alert your emergency contacts and our safety team.</p>
                    <Button size="lg" variant="destructive" className="w-full mt-6 h-16 text-lg">
                        <Phone className="mr-2"/> Send SOS Alert
                    </Button>
                </Card>

                <div className="mt-8 space-y-4 text-left">
                    <h2 className="text-xl font-bold">Safety Toolkit</h2>
                    {/* This can be linked to a driver-specific emergency contact page later */}
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <Users className="w-8 h-8 text-primary"/>
                            <div>
                                <p className="font-semibold">Manage Emergency Contacts</p>
                                <p className="text-sm text-muted-foreground">Add or update your trusted contacts.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}

    