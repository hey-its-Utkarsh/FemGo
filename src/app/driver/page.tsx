
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleDollarSign, CheckCircle, Car, AlertTriangle } from "lucide-react";
import ridesData from '@/data/rides.json';
import usersData from '@/data/users.json';
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const driverId = "driver001"; // Assuming this is the logged-in driver
const REQUEST_TIMEOUT_SECONDS = 15;

// Define a type for a single ride based on your JSON structure
type Ride = typeof ridesData[number];

const allRideRequests = ridesData.filter(ride => ride.rideStatus === 'requested');
const initialCompletedRides = ridesData.filter(ride => ride.driverId === driverId && ride.rideStatus === 'completed');

interface RideRequestWithTimer extends Ride {
    timeLeft: number;
}

const getPassengerDetails = (passengerId: string) => {
    const passenger = usersData.find(user => user.id === passengerId);
    return passenger || { name: "Unknown Passenger", id: "unknown" };
};

export default function DriverDashboard() {
    const [isOnline, setIsOnline] = useState(true);
    const [rideRequests, setRideRequests] = useState<RideRequestWithTimer[]>([]);
    const [completedRides] = useState(initialCompletedRides);
    const totalEarnings = completedRides.reduce((acc, ride) => acc + ride.fare, 0);
    const { toast } = useToast();
    const notificationSoundRef = useRef<HTMLAudioElement>(null);
    const newRequestIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const playNotificationSound = () => {
        if (rideRequests.length === 0) { // Only start ringing if it wasn't already
            notificationSoundRef.current?.play().catch(error => {
                console.error("Audio playback failed:", error);
            });
        }
    };

    const stopNotificationSound = () => {
        if (notificationSoundRef.current) {
            notificationSoundRef.current.pause();
            notificationSoundRef.current.currentTime = 0;
        }
    };
    
    // Countdown timer effect
    useEffect(() => {
        if (isOnline && rideRequests.length > 0) {
            countdownIntervalRef.current = setInterval(() => {
                setRideRequests(prevRequests => {
                    const updatedRequests = prevRequests.map(req => ({
                        ...req,
                        timeLeft: req.timeLeft - 1,
                    })).filter(req => req.timeLeft > 0);

                    if (updatedRequests.length < prevRequests.length && updatedRequests.length === 0) {
                        stopNotificationSound();
                    }
                    return updatedRequests;
                });
            }, 1000);
        } else {
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
            }
        }

        return () => {
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
            }
        };
    }, [isOnline, rideRequests.length]);


    const handleAcceptRide = (rideId: string) => {
        setRideRequests(prev => {
            const remaining = prev.filter(r => r.id !== rideId);
            if (remaining.length === 0) {
                stopNotificationSound();
            }
            return remaining;
        });
        toast({
            title: "Ride Accepted!",
            description: "You are now heading to the pickup location.",
        });
    }

    const simulateNewRequest = () => {
        // Find a request that isn't already in the list
        const existingIds = new Set(rideRequests.map(r => r.id));
        const newRequest = allRideRequests.find(r => !existingIds.has(r.id));
        
        if (newRequest) {
            playNotificationSound();
            setRideRequests(prev => [...prev, { ...newRequest, timeLeft: REQUEST_TIMEOUT_SECONDS }]);
            const passenger = getPassengerDetails(newRequest.passengerId);
            toast({
                title: "New Ride Request!",
                description: `From ${passenger.name}. 2.5 mi away.`,
            });
        } else {
            // Stop adding new requests if all have been shown
             if (newRequestIntervalRef.current) {
                clearInterval(newRequestIntervalRef.current);
            }
        }
    };

    useEffect(() => {
        if (isOnline) {
            setRideRequests([]); // Clear old requests on going online
            // Start the simulation after a short delay
            setTimeout(() => {
                simulateNewRequest();
                newRequestIntervalRef.current = setInterval(simulateNewRequest, 17000); // New request every 17 seconds (15s timer + 2s buffer)
            }, 1000);
        } else {
            stopNotificationSound();
            if (newRequestIntervalRef.current) clearInterval(newRequestIntervalRef.current);
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
            setRideRequests([]);
        }
        return () => {
            stopNotificationSound();
            if (newRequestIntervalRef.current) clearInterval(newRequestIntervalRef.current);
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
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
                        const progressPercentage = (req.timeLeft / REQUEST_TIMEOUT_SECONDS) * 100;
                        return (
                            <Card key={req.id} className="p-4 bg-card border-border space-y-3">
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
                                <Progress value={progressPercentage} className="h-2" />
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
