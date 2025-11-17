
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleDollarSign, CheckCircle, Car, AlertTriangle, User } from "lucide-react";
import ridesData from '@/data/rides.json';
import usersData from '@/data/users.json';
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const driverId = "driver001"; // Assuming this is the logged-in driver

const initialRideRequests = ridesData.filter(ride => ride.rideStatus === 'requested');
const initialCompletedRides = ridesData.filter(ride => ride.driverId === driverId && ride.rideStatus === 'completed');

const getPassengerDetails = (passengerId: string) => {
    const passenger = usersData.find(user => user.id === passengerId);
    return passenger || { name: "Unknown Passenger", id: "unknown" };
};

export default function DriverDashboard() {
    const [isOnline, setIsOnline] = useState(true);
    const [rideRequests, setRideRequests] = useState(initialRideRequests);
    const [completedRides, setCompletedRides] = useState(initialCompletedRides);
    const totalEarnings = completedRides.reduce((acc, ride) => acc + ride.fare, 0);
    const { toast } = useToast();
    const notificationSoundRef = useRef<HTMLAudioElement>(null);
    const requestIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const playNotificationSound = () => {
        notificationSoundRef.current?.play().catch(error => {
            console.error("Audio playback failed:", error);
        });
    };

    const stopNotificationSound = () => {
        if (notificationSoundRef.current) {
            notificationSoundRef.current.pause();
            notificationSoundRef.current.currentTime = 0;
        }
    };

    const handleAcceptRide = (rideId: string) => {
        stopNotificationSound();
        setRideRequests(prev => prev.filter(r => r.id !== rideId));
        toast({
            title: "Ride Accepted!",
            description: "You are now heading to the pickup location.",
        });
    }

    const simulateNewRequest = () => {
        // Find a request that isn't already in the list
        const newRequest = initialRideRequests.find(r => !rideRequests.some(current => current.id === r.id));
        if (newRequest) {
            setRideRequests(prev => [newRequest, ...prev]);
            const passenger = getPassengerDetails(newRequest.passengerId);
            toast({
                title: "New Ride Request!",
                description: `From ${passenger.name}. 2.5 mi away.`,
            });
            playNotificationSound();
        }
    };

    useEffect(() => {
        if (isOnline) {
            // Initially clear and then show new requests one by one
            setRideRequests([]);
            requestIntervalRef.current = setInterval(simulateNewRequest, 8000); // Simulate new request every 8 seconds
        } else {
            stopNotificationSound();
            if (requestIntervalRef.current) {
                clearInterval(requestIntervalRef.current);
            }
        }
        return () => {
            stopNotificationSound();
            if (requestIntervalRef.current) {
                clearInterval(requestIntervalRef.current);
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOnline]);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
        <audio ref={notificationSoundRef} src="https://assets.mixkit.co/sfx/preview/mixkit-classic-office-phone-ring-435.mp3" preload="auto" loop />
        <header className="p-4 bg-card shadow-md">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-primary">Welcome, Diana!</h1>
                    <p className={`opacity-90 ${isOnline ? 'text-green-400' : 'text-muted-foreground'}`}>
                        {isOnline ? 'You are online and ready for rides.' : 'You are offline.'}
                    </p>
                </div>
                 <Button variant={isOnline ? "secondary" : "default"} onClick={() => setIsOnline(!isOnline)}>
                    {isOnline ? 'Go Offline' : 'Go Online'}
                 </Button>
            </div>
        </header>

        <main className="flex-1 p-4 overflow-y-auto">
            <Card className="mb-4 bg-card border-border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl text-primary-foreground">
                        <CircleDollarSign/>
                        Today's Earnings
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold text-primary">${totalEarnings.toFixed(2)}</p>
                    <p className="text-muted-foreground">From {completedRides.length} completed rides</p>
                </CardContent>
            </Card>

            <Tabs defaultValue="requests" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-muted">
                    <TabsTrigger value="requests">New Requests ({rideRequests.length})</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                <TabsContent value="requests" className="mt-4">
                    <div className="space-y-4">
                    {rideRequests.map(req => {
                        const passenger = getPassengerDetails(req.passengerId);
                        return (
                            <Card key={req.id} className="p-4 bg-card border-border">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={`https://picsum.photos/seed/${passenger.id}/200/200`} data-ai-hint="woman portrait" />
                                            <AvatarFallback>{passenger.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-bold text-primary-foreground">{passenger.name}</p>
                                            <p className="text-sm text-muted-foreground">2.5 mi away</p>
                                        </div>
                                    </div>
                                    <Button onClick={() => handleAcceptRide(req.id)}>Accept</Button>
                                </div>
                            </Card>
                        )
                    })}
                     {isOnline && rideRequests.length === 0 && <p className="text-center text-muted-foreground py-8">Waiting for new ride requests...</p>}
                     {!isOnline && <p className="text-center text-muted-foreground py-8">Go online to receive requests.</p>}
                    </div>
                </TabsContent>
                <TabsContent value="completed" className="mt-4">
                    <div className="space-y-4">
                    {completedRides.map(ride => {
                        const passenger = getPassengerDetails(ride.passengerId);
                        return (
                            <Card key={ride.id} className="p-4 bg-card border-border">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={`https://picsum.photos/seed/${passenger.id}/200/200`} data-ai-hint="woman portrait" />
                                            <AvatarFallback>{passenger.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-bold text-primary-foreground">{passenger.name}</p>
                                            <p className="text-sm text-muted-foreground">{ride.drop}</p>
                                        </div>
                                    </div>
                                    <p className="text-lg font-semibold text-green-400">${ride.fare.toFixed(2)}</p>
                                </div>
                            </Card>
                        )
                    })}
                    </div>
                </TabsContent>
            </Tabs>

        </main>
        
        <footer className="border-t border-border p-2 bg-card">
            <div className="grid grid-cols-3 gap-2">
                <Button variant="ghost" className="flex-col h-16 text-primary">
                    <Car/>
                    <span>Home</span>
                </Button>
                <Button variant="ghost" className="flex-col h-16 text-muted-foreground">
                    <CheckCircle/>
                    <span>Rides</span>
                </Button>
                <Button variant="ghost" className="flex-col h-16 text-red-500">
                    <AlertTriangle/>
                    <span>SOS</span>
                </Button>
            </div>
        </footer>
    </div>
  );

    