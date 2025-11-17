
'use client';
import MobileHeader from "@/components/femgo/layout/MobileHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, ShieldAlert, Users, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type SOSState = 'idle' | 'sending' | 'sent';

export default function DriverSafetyPage() {
    const [sosState, setSosState] = useState<SOSState>('idle');

    const handleSendSOS = () => {
        setSosState('sending');
        setTimeout(() => {
            setSosState('sent');
        }, 3000); // Simulate a 3-second delay for sending the alert
    };

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <MobileHeader title="Safety Center" backPath="/driver" />
            <main className="flex-1 p-4 text-center">
                <Card className={`p-6 transition-all duration-300 ${sosState === 'sent' ? 'bg-green-50 dark:bg-green-900/20 border-green-500' : 'bg-red-50 dark:bg-red-900/20 border-destructive'}`}>
                    {sosState === 'idle' && <ShieldAlert className="w-16 h-16 text-destructive mx-auto" />}
                    {sosState === 'sending' && <Loader2 className="w-16 h-16 text-destructive mx-auto animate-spin" />}
                    {sosState === 'sent' && <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />}
                    
                    <h1 className={`text-2xl font-bold mt-4 ${sosState === 'sent' ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>
                        {sosState === 'idle' && "Emergency - SOS"}
                        {sosState === 'sending' && "Sending Alert..."}
                        {sosState === 'sent' && "Alert Sent!"}
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        {sosState === 'idle' && "Press the button below to immediately alert your emergency contacts and our safety team."}
                        {sosState === 'sending' && "Connecting to emergency services and your trusted contacts. Stay safe."}
                        {sosState === 'sent' && "Your location and ride details have been shared with your emergency contacts and the FemGo safety team."}
                    </p>
                    <Button 
                        size="lg" 
                        variant={sosState === 'sent' ? "default" : "destructive"}
                        className={`w-full mt-6 h-16 text-lg transition-all duration-300 ${sosState === 'sent' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                        onClick={handleSendSOS}
                        disabled={sosState !== 'idle'}
                    >
                        {sosState === 'idle' && <><Phone className="mr-2"/> Send SOS Alert</>}
                        {sosState === 'sending' && <><Loader2 className="mr-2 animate-spin"/> Connecting...</>}
                        {sosState === 'sent' && <><CheckCircle className="mr-2"/> Alert Confirmed</>}
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
