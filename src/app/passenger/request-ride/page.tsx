
'use client';

import MobileHeader from "@/components/femgo/layout/MobileHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car, MapPin, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RequestRidePage() {
    const router = useRouter();

    const handleRideRequest = () => {
        // Navigate to the finding driver page
        router.push('/passenger/finding-driver');
    }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <MobileHeader title="Request a Ride" backPath="/passenger" />
      <main className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <Card className="mb-4">
            <CardContent className="p-4 space-y-4">
              <div className="relative">
                <Label htmlFor="pickup" className="text-primary font-semibold">Pickup Location</Label>
                <MapPin className="absolute left-2 top-9 h-5 w-5 text-muted-foreground" />
                <Input id="pickup" type="text" defaultValue="123 Main Street, Anytown" className="pl-9 h-12 mt-1" />
              </div>
              <div className="relative">
                <Label htmlFor="destination" className="text-primary font-semibold">Destination</Label>
                <MapPin className="absolute left-2 top-9 h-5 w-5 text-muted-foreground" />
                <Input id="destination" type="text" placeholder="Where are you going?" className="pl-9 h-12 mt-1" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle className="text-xl">Available Rides</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-center p-4 border rounded-lg bg-accent/30">
                    <div className="flex items-center gap-4">
                        <Car className="h-10 w-10 text-primary"/>
                        <div>
                            <p className="font-bold text-lg">FemGo Safe</p>
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
                        <span>Cash</span>
                    </div>
                    <Button variant="link">Change payment</Button>
                </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="py-4">
            <Button size="lg" className="w-full text-lg h-14" onClick={handleRideRequest}>
                Request FemGo Safe
            </Button>
        </div>
      </main>
    </div>
  );
}
