
'use client';
import MobileHeader from "@/components/femgo/layout/MobileHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Car } from "lucide-react";
import rides from '@/data/rides.json';

export default function RidesPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <MobileHeader title="My Rides" backPath="/passenger" />
            <main className="flex-1 p-4 space-y-4">
                {rides.filter(r => r.passengerId === 'user001').map(ride => (
                    <Card key={ride.id}>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Car className="w-8 h-8 text-primary"/>
                                    <div>
                                        <p className="font-bold">{ride.drop}</p>
                                        <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">${ride.fare.toFixed(2)}</p>
                                    <p className="text-sm text-green-600 capitalize">{ride.rideStatus}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </main>
        </div>
    )
}
