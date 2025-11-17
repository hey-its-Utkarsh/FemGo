
'use client';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Phone, Shield, Star, MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { dummySpeechSafety } from '@/lib/ai-simulation';
import { useToast } from "@/hooks/use-toast";

export default function LiveRidePage() {
    const router = useRouter();
    const { toast } = useToast();
    const [progress, setProgress] = useState(10);

    useEffect(() => {
        // Simulate ride progress
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    router.push('/passenger/ride-completed');
                    return 100;
                }
                return prev + 5;
            });
        }, 1000);

        // Simulate background safety check
        const safetyCheck = setInterval(async () => {
            const result: any = await dummySpeechSafety(null);
            if (result.detected) {
                toast({
                    variant: "destructive",
                    title: "Safety Alert",
                    description: "Potential emergency detected. Our team is monitoring.",
                });
            }
        }, 10000); // Check every 10 seconds

        return () => {
            clearInterval(timer);
            clearInterval(safetyCheck);
        };
    }, [router, toast]);


  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gray-200">
      {/* Map Placeholder */}
      <div className="h-full w-full">
        <Image
          src="https://picsum.photos/seed/livemap/800/1200"
          alt="Live Ride Map"
          layout="fill"
          objectFit="cover"
          data-ai-hint="map satellite view"
        />
        <div className="absolute inset-0 bg-white/10" />
      </div>

      {/* Top Info */}
       <div className="absolute top-0 left-0 right-0 p-4 z-10">
         <Card className="p-3">
            <p className="text-center font-semibold">Arriving at <span className="text-primary">123 Main St</span> in 8 mins</p>
            <Progress value={progress} className="mt-2" />
         </Card>
       </div>


      {/* Bottom Sheet */}
      <Card className="absolute bottom-0 left-0 right-0 z-10 rounded-t-3xl border-t-4 border-primary/50 shadow-2xl p-6">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Image
                    src="https://picsum.photos/seed/driver1/200/200"
                    alt="Driver"
                    width={60}
                    height={60}
                    className="rounded-full border-2 border-primary"
                    data-ai-hint="woman portrait"
                />
                <div>
                    <p className="font-bold text-lg">Diana Miller</p>
                    <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500"/>
                        <span>4.9</span>
                    </div>
                </div>
            </div>
            <div>
                 <p className="font-bold text-lg text-primary">PK-123-XYZ</p>
                 <p className="text-sm text-right text-muted-foreground">Toyota Prius</p>
            </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 text-center">
            <Link href="/passenger/safety">
                <Button variant="destructive" size="lg" className="w-full flex-col h-20">
                    <Shield className="h-6 w-6 mb-1"/>
                    <span>SOS</span>
                </Button>
            </Link>
             <Button variant="outline" size="lg" className="w-full flex-col h-20">
                <Phone className="h-6 w-6 mb-1"/>
                <span>Call</span>
            </Button>
             <Button variant="outline" size="lg" className="w-full flex-col h-20">
                <MessageSquare className="h-6 w-6 mb-1"/>
                <span>Message</span>
            </Button>
        </div>

        <div className="mt-4">
            <Button variant="secondary" className="w-full h-12" onClick={() => router.push('/passenger')}>Cancel Ride</Button>
        </div>

      </Card>
    </div>
  );
}
