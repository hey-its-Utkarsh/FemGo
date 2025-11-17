
'use client';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Search, Mic, Shield, Home } from "lucide-react";
import Link from "next/link";

export default function PassengerDashboard() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Map Placeholder */}
      <div className="flex-1 bg-gray-300 flex items-center justify-center">
        <p className="text-gray-500">Map Placeholder</p>
      </div>

      {/* Bottom Sheet */}
      <Card className="rounded-t-3xl p-4 shadow-2xl">
        <div className="grid gap-4">
          <div className="text-center">
            <p className="font-bold text-lg">Where to?</p>
            <p className="text-sm text-muted-foreground">Your safe ride is just a tap away.</p>
          </div>

          <Button variant="secondary" size="lg" className="w-full justify-start h-14 text-lg">
            <Search className="mr-4" />
            Enter destination
          </Button>

          <div className="grid grid-cols-2 gap-4">
             <Button variant="outline" className="py-6">
                <MapPin className="mr-2" />
                Set on Map
             </Button>
             <Button variant="outline" className="py-6">
                <Mic className="mr-2" />
                Use Voice
            </Button>
          </div>
        </div>
      </Card>
      
       {/* Floating Action buttons */}
      <div className="absolute top-4 right-4 z-10">
        <Button size="icon" variant="destructive" className="rounded-full w-16 h-16 shadow-lg">
            <Shield size={32} />
        </Button>
      </div>
       <div className="absolute top-4 left-4 z-10">
        <Link href="/">
          <Button size="icon" variant="secondary" className="rounded-full w-16 h-16 shadow-lg">
              <Home size={32} />
          </Button>
        </Link>
      </div>
    </div>
  );
}
