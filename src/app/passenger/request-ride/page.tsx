
'use client';

import MobileHeader from "@/components/femgo/layout/MobileHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car, MapPin, Wallet, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from 'react';

export default function RequestRidePage() {
    const router = useRouter();
    const [step, setStep] = useState<'destination' | 'confirm'>('destination');
    const [destination, setDestination] = useState('');

    const handleDestinationSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (destination) {
            setStep('confirm');
        }
    }

    const handleRideRequest = () => {
        router.push('/passenger/finding-driver');
    }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <MobileHeader title={step === 'destination' ? "Request a Ride" : "Confirm Your Ride"} backPath="/passenger" />
      <main className="flex-1 p-4 flex flex-col justify-between bg-gray-900">
        {step === 'destination' && (
            <Card className="bg-card border-border">
                <CardContent className="p-4 space-y-4">
                <form onSubmit={handleDestinationSubmit}>
                    <div className="relative">
                        <Label htmlFor="pickup" className="text-primary font-semibold">Pickup Location</Label>
                        <MapPin className="absolute left-2 top-9 h-5 w-5 text-muted-foreground" />
                        <Input id="pickup" type="text" defaultValue="123 Main Street, Anytown" className="pl-9 h-12 mt-1 bg-gray-800 border-gray-700 text-white" />
                    </div>
                    <div className="relative">
                        <Label htmlFor="destination" className="text-primary font-semibold">Destination</Label>
                        <MapPin className="absolute left-2 top-9 h-5 w-5 text-muted-foreground" />
                        <Input 
                            id="destination" 
                            type="text" 
                            placeholder="Where are you going?" 
                            className="pl-9 h-12 mt-1 bg-gray-800 border-gray-700 text-white"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <Button type="submit" size="lg" className="w-full text-lg h-14 mt-4">
                        Find Rides
                    </Button>
                </form>
                </CardContent>
            </Card>
        )}

        {step === 'confirm' && (
            <div>
                <Button variant="ghost" onClick={() => setStep('destination')} className="mb-4">
                    <ArrowLeft className="mr-2" /> Back
                </Button>
                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-xl text-primary-foreground">Available Rides</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center p-4 border rounded-lg bg-accent/10 border-primary/30">
                            <div className="flex items-center gap-4">
                                <Car className="h-10 w-10 text-primary"/>
                                <div>
                                    <p className="font-bold text-lg text-primary-foreground">FemGo Safe</p>
                                    <p className="text-sm text-muted-foreground">1-2 mins away</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-lg text-primary">$18.50</p>
                                <p className="text-sm text-muted-foreground">Est. fare</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-4 p-2">
                            <div className="flex items-center gap-2">
                                <Wallet className="h-5 w-5 text-muted-foreground"/>
                                <span className="text-primary-foreground">Cash</span>
                            </div>
                            <Button variant="link" className="text-primary">Change payment</Button>
                        </div>
                    </CardContent>
                </Card>
                 <div className="py-4 fixed bottom-4 left-4 right-4">
                    <Button size="lg" className="w-full text-lg h-14" onClick={handleRideRequest}>
                        Request FemGo Safe
                    </Button>
                </div>
            </div>
        )}
      </main>
    </div>
  );
}
