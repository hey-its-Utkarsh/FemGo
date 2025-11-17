
'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import MobileHeader from "@/components/femgo/layout/MobileHeader";

export default function FindingDriverPage() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/passenger/confirm-ride');
        }, 4000); // Simulate a 4-second search

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <MobileHeader title="Finding Your Driver" backPath="/passenger/request-ride" />
            <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                <div className="relative flex items-center justify-center">
                    <div className="absolute h-64 w-64 rounded-full bg-primary/10 animate-ping" />
                    <div className="absolute h-48 w-48 rounded-full bg-primary/20 animate-ping delay-200" />
                    <Loader2 className="h-24 w-24 text-primary animate-spin" />
                </div>
                <h1 className="text-2xl font-bold mt-12">Contacting nearby drivers...</h1>
                <p className="text-muted-foreground mt-2">This should only take a moment.</p>
            </main>
        </div>
    );
}
