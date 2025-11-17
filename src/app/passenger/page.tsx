
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Home, MapPin, Mic, Search, Shield, User, Wallet, History } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PassengerDashboard() {
  const router = useRouter();

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gray-200">
      {/* Map Placeholder */}
      <div className="h-full w-full">
        <Image
          src="https://picsum.photos/seed/map/800/1200"
          alt="Map"
          layout="fill"
          objectFit="cover"
          data-ai-hint="map view"
        />
        <div className="absolute inset-0 bg-white/10" />
      </div>

      {/* Floating Header Actions */}
      <div className="absolute top-4 left-4 z-20">
        <Link href="/">
          <Button size="icon" className="rounded-full h-12 w-12 shadow-lg">
              <Home size={24} />
          </Button>
        </Link>
      </div>
      <div className="absolute top-4 right-4 z-20">
        <Link href="/passenger/safety">
         <Button size="icon" variant="destructive" className="rounded-full h-12 w-12 shadow-lg">
            <Shield size={24} />
        </Button>
        </Link>
      </div>

      {/* Bottom Sheet */}
      <Card className="absolute bottom-0 left-0 right-0 z-10 rounded-t-3xl border-t-4 border-primary/50 shadow-2xl">
        <div className="p-6 space-y-4">
          <p className="text-center text-2xl font-bold text-foreground">Where to?</p>
          
          <div className="relative" onClick={() => router.push('/passenger/request-ride')}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Enter destination"
              className="h-14 pl-10 text-lg border-2 focus-visible:ring-primary cursor-pointer"
              readOnly
            />
             <Mic className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
          </div>

          <div className="flex items-center gap-4 text-muted-foreground">
            <MapPin className="h-5 w-5 text-primary"/>
            <div className="text-left">
                <p className="font-semibold text-foreground">123 Main Street</p>
                <p className="text-sm">Your current location</p>
            </div>
          </div>
        </div>

        <CardFooter className="grid grid-cols-4 gap-1 border-t bg-card p-0">
             <Link href="/passenger/payments" className="w-full">
                <Button variant="ghost" className="w-full flex-col h-20 rounded-none">
                    <Wallet className="h-6 w-6 text-gray-500"/>
                    <span className="text-xs font-normal text-gray-600">Payments</span>
                </Button>
             </Link>
             <Link href="/passenger" className="w-full">
                <Button variant="ghost" className="w-full flex-col h-20 rounded-none">
                    <Home className="h-6 w-6 text-primary"/>
                    <span className="text-xs font-normal text-primary">Home</span>
                </Button>
             </Link>
             <Link href="/passenger/rides" className="w-full">
                <Button variant="ghost" className="w-full flex-col h-20 rounded-none">
                    <History className="h-6 w-6 text-gray-500"/>
                    <span className="text-xs font-normal text-gray-600">My Rides</span>
                </Button>
             </Link>
             <Link href="/passenger/profile" className="w-full">
                <Button variant="ghost" className="w-full flex-col h-20 rounded-none">
                    <User className="h-6 w-6 text-gray-500"/>
                    <span className="text-xs font-normal text-gray-600">Profile</span>
                </Button>
            </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
