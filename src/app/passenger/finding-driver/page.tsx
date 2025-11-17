
'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import MobileHeader from "@/components/femgo/layout/MobileHeader";

export default function FindingDriverPage() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/passenger/confirm-ride');
        }, 5000); // Simulate a 5-second search

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <MobileHeader title="Finding Your Driver" backPath="/passenger/request-ride" />
            <main className="flex-1 flex flex-col items-center justify-center p-4 text-center overflow-hidden">
                <div className="relative flex items-center justify-center w-80 h-80">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full border-primary/50"
                            style={{
                                width: `${(i + 1) * 8}rem`,
                                height: `${(i + 1) * 8}rem`,
                                borderWidth: '1px',
                                animation: `ping-radar 2s cubic-bezier(0, 0, 0.2, 1) infinite`,
                                animationDelay: `${i * 0.3}s`,
                            }}
                        />
                    ))}
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                </div>
                <h1 className="text-2xl font-bold mt-12 tracking-wider">CONNECTING TO DRIVER NETWORK...</h1>
                <p className="text-muted-foreground mt-2">This should only take a moment.</p>
                <style jsx>{`
                    @keyframes ping-radar {
                        75%, 100% {
                            transform: scale(2);
                            opacity: 0;
                        }
                    }
                `}</style>
            </main>
        </div>
    );
}
