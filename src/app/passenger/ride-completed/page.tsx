
'use client';
import MobileHeader from "@/components/femgo/layout/MobileHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import drivers from '@/data/drivers.json';

export default function RideCompletedPage() {
    const router = useRouter();
    const [rating, setRating] = useState(0);
    const driver = drivers[0];

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <MobileHeader title="Ride Completed" backPath="/passenger" />
            <main className="flex-1 p-4 flex flex-col items-center justify-center text-center">
                <Card className="w-full max-w-sm">
                    <CardContent className="p-6">
                        <Image
                            src={`https://xsgames.co/randomusers/assets/avatars/female/${driver.id.replace('driver','_')}.jpg`}
                            alt="Driver"
                            width={96}
                            height={96}
                            className="rounded-full border-4 border-primary mx-auto"
                            data-ai-hint="woman portrait"
                        />
                        <h1 className="text-2xl font-bold mt-4">Rate Your Driver</h1>
                        <p className="text-muted-foreground">{driver.name}</p>

                        <div className="flex justify-center gap-2 mt-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-10 h-10 cursor-pointer ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                    onClick={() => setRating(star)}
                                />
                            ))}
                        </div>

                        <Textarea placeholder="Add a comment..." className="mt-6 min-h-[100px]" />

                        <Button size="lg" className="w-full mt-6 h-12 text-lg" onClick={() => router.push('/passenger')}>
                            Submit Review
                        </Button>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}

    

    