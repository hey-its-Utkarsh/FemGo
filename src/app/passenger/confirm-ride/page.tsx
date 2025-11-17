
'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import MobileHeader from '@/components/femgo/layout/MobileHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ShieldCheck, Car } from 'lucide-react';
import drivers from '@/data/drivers.json';

export default function ConfirmRidePage() {
    const router = useRouter();
    const driver = drivers[0]; // Get the first dummy driver

    const handleConfirm = () => {
        // Navigate to the live tracking page
        router.push('/passenger/live-ride');
    };

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <MobileHeader title="Driver Found!" showHomeButton={false} />
            <main className="flex-1 flex flex-col items-center justify-center p-4 text-center bg-background">
                <h1 className="text-2xl font-bold">Your driver is on the way!</h1>
                <Card className="w-full max-w-sm mt-6 text-left">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <Image
                                src="https://i.pravatar.cc/150?u=driver001"
                                alt={driver.name}
                                width={80}
                                height={80}
                                className="rounded-full border-4 border-primary"
                                data-ai-hint="woman portrait"
                            />
                            <div>
                                <h2 className="text-xl font-bold">{driver.name}</h2>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    <span>{driver.rating}</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 p-3 bg-muted rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-bold text-lg text-primary">{driver.vehicle.split(' - ')[1]}</p>
                                <p className="text-sm text-muted-foreground">{driver.vehicle.split(' - ')[0]}</p>
                            </div>
                            <Car className="w-10 h-10 text-primary" />
                        </div>
                         <div className="mt-4 flex items-center justify-center gap-2 text-green-600">
                            <ShieldCheck className="w-5 h-5" />
                            <span className="font-semibold">{driver.verificationStatus === "verified" ? "Verified Driver" : "Pending Verification"}</span>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-8 w-full max-w-sm space-y-3">
                    <Button onClick={handleConfirm} size="lg" className="w-full h-14 text-lg">
                        Track Your Ride
                    </Button>
                    <Button variant="outline" size="lg" className="w-full h-14 text-lg" onClick={() => router.push('/passenger')}>
                        Cancel
                    </Button>
                </div>
            </main>
        </div>
    );
}
