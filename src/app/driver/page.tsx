
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleDollarSign, CheckCircle, Car, AlertTriangle, Phone, MessageSquare, Navigation, Shield, UserX, Check, X } from "lucide-react";
import ridesData from '@/data/rides.json';
import usersData from '@/data/users.json';
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import Link from 'next/link';

const driverId = "driver001"; // Assuming this is the logged-in driver
const REQUEST_TIMEOUT_SECONDS = 15;

type Ride = (typeof ridesData)[number];
type RideRequestWithTimer = Ride & { timeLeft: number };
type ActiveRide = Ride & { step: 'pickup' | 'trip' };

const allRideRequests = ridesData.filter(ride => ride.rideStatus === 'requested');
const initialCompletedRides = ridesData.filter(ride => ride.driverId === driverId && ride.rideStatus === 'completed');

const getPassengerDetails = (passengerId: string) => {
    const passenger = usersData.find(user => user.id === passengerId);
    return passenger || { name: "Unknown Passenger", id: "unknown", phone: "N/A" };
};

export default function DriverDashboard() {
    const [isOnline, setIsOnline] = useState(true);
    const [rideRequests, setRideRequests] = useState<RideRequestWithTimer[]>([]);
    const [completedRides, setCompletedRides] = useState(initialCompletedRides);
    const [activeRide, setActiveRide] = useState<ActiveRide | null>(null);
    const totalEarnings = completedRides.reduce((acc, ride) => acc + ride.fare, 0);
    const { toast } = useToast();
    const notificationSoundRef = useRef<HTMLAudioElement>(null);
    const newRequestIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const playNotificationSound = () => {
        if (rideRequests.length === 0) { 
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

    const simulateNewRequest = () => {
        const existingIds = new Set(rideRequests.map(r => r.id));
        const newRequest = allRideRequests.find(r => !existingIds.has(r.id) && r.id !== activeRide?.id);
        
        if (newRequest && !activeRide) { // Only add requests if no ride is active
            playNotificationSound();
            setRideRequests(prev => [...prev, { ...newRequest, timeLeft: REQUEST_TIMEOUT_SECONDS }]);
            const passenger = getPassengerDetails(newRequest.passengerId);
            toast({
                title: "New Ride Request!",
                description: `From ${passenger.name}. 2.5 mi away.`,
            });
        } else if (rideRequests.length === 0) { // Stop if no new requests are available
             if (newRequestIntervalRef.current) {
                clearInterval(newRequestIntervalRef.current);
            }
        }
    };
    
    // Countdown timer for requests
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
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        }
        return () => { if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current) };
    }, [isOnline, rideRequests.length]);

    // Main simulation loop
    useEffect(() => {
        if (isOnline && !activeRide) {
            setRideRequests([]); // Clear old requests
            setTimeout(() => {
                simulateNewRequest();
                newRequestIntervalRef.current = setInterval(simulateNewRequest, 17000);
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
    }, [isOnline, activeRide]);


    const handleAcceptRide = (rideId: string) => {
        const acceptedRide = rideRequests.find(r => r.id === rideId);
        if (acceptedRide) {
            setActiveRide({ ...acceptedRide, step: 'pickup' });
        }
        setRideRequests([]); // Clear all other requests
        stopNotificationSound();
        if (newRequestIntervalRef.current) clearInterval(newRequestIntervalRef.current);
        toast({
            title: "Ride Accepted!",
            description: "Head to the pickup location.",
        });
    };
    
    const handleDeclineRide = (rideId: string) => {
        setRideRequests(prev => {
            const updatedRequests = prev.filter(r => r.id !== rideId);
            if (updatedRequests.length === 0) {
                stopNotificationSound();
            }
            return updatedRequests;
        });
        toast({
            title: "Ride Declined",
            description: "The request has been removed.",
            variant: "destructive"
        });
    };

    const handleRideAction = (action: 'arrived' | 'start_trip' | 'end_ride' | 'cancel') => {
        if (!activeRide) return;
        
        if (action === 'arrived') {
            setActiveRide({ ...activeRide, step: 'trip' });
            toast({ title: "Arrived at Pickup", description: "Waiting for passenger."});
        } else if (action === 'start_trip') {
            toast({ title: "Trip Started", description: `Heading to ${activeRide.drop}.`});
            // Here you would navigate to a live trip screen. For now, we simulate completion.
            setTimeout(() => handleRideAction('end_ride'), 5000); // Auto-end after 5s
        } else if (action === 'end_ride') {
            toast({ title: "Trip Completed!", description: `Earned $${activeRide.fare.toFixed(2)}` });
            setCompletedRides(prev => [{...activeRide, rideStatus: 'completed'}, ...prev]);
            setActiveRide(null); // Return to dashboard
        } else if (action === 'cancel') {
            toast({ title: "Ride Cancelled", variant: 'destructive'});
            setActiveRide(null); // Return to dashboard
        }
    };
    
    const handleContact = (type: 'call' | 'message') => {
        const passenger = getPassengerDetails(activeRide!.passengerId);
        toast({
            title: `Simulating ${type}`,
            description: `Contacting ${passenger.name}... (This is a prototype).`,
        });
    };

  if (activeRide) {
    const passenger = getPassengerDetails(activeRide.passengerId);
    return (
      <div className="relative h-screen w-screen overflow-hidden bg-gray-200">
        <Image src="https://picsum.photos/seed/drivermap/800/1200" alt="Map to passenger" fill objectFit="cover" className="opacity-20" data-ai-hint="map dark city" />
        <div className="absolute inset-0 bg-background/40" />

        <Card className="absolute bottom-0 left-0 right-0 z-10 rounded-t-3xl border-t-4 border-primary/50 shadow-2xl p-4">
          <CardHeader className="p-2 text-center">
            <CardTitle className="text-2xl font-bold">
                {activeRide.step === 'pickup' ? "Head to Pickup" : "Trip to Destination"}
            </CardTitle>
            <p className="text-muted-foreground">{activeRide.step === 'pickup' ? activeRide.pickup : activeRide.drop}</p>
          </CardHeader>
          <CardContent className="p-2">
            <div className="flex items-center justify-between p-3 bg-card-foreground/5 rounded-lg">
                <div className="flex items-center gap-3">
                    <Avatar className="h-14 w-14">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${passenger.id}`} data-ai-hint="woman portrait" />
                        <AvatarFallback>{passenger.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-xl font-bold">{passenger.name}</p>
                        <p className="text-muted-foreground">{passenger.phone}</p>
                    </div>
                </div>
                 <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleContact('call')}><Phone/></Button>
                    <Button variant="outline" size="icon" onClick={() => handleContact('message')}><MessageSquare/></Button>
                </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-3">
                {activeRide.step === 'pickup' ? (
                    <Button size="lg" className="h-16 text-lg col-span-2" onClick={() => handleRideAction('arrived')}>
                        <Check className="mr-2"/> Arrived at Pickup
                    </Button>
                ) : (
                    <Button size="lg" className="h-16 text-lg col-span-2" onClick={() => handleRideAction('start_trip')}>
                        <Navigation className="mr-2"/> Start Trip
                    </Button>
                )}
                 <Button variant="destructive" className="h-14" onClick={() => handleRideAction('cancel')}>
                    <UserX className="mr-2"/> Cancel
                </Button>
                <Link href="/driver/safety" className="w-full h-full">
                    <Button variant="secondary" className="h-14 w-full">
                        <Shield className="mr-2"/> SOS
                    </Button>
                </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
        <audio ref={notificationSoundRef} src="https://assets.mixkit.co/sfx/preview/mixkit-classic-office-phone-ring-435.mp3" preload="auto" loop />
        <header className="p-4 bg-card shadow-md">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-primary">Welcome, Diana!</h1>
                    <p className={`opacity-90 ${isOnline ? 'text-green-500' : 'text-muted-foreground'}`}>
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
                    <CardTitle className="flex items-center gap-2 text-xl text-card-foreground">
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
                                            <AvatarImage src={`https://i.pravatar.cc/150?u=${passenger.id}`} data-ai-hint="woman portrait" />
                                            <AvatarFallback>{passenger.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-bold text-card-foreground">{passenger.name}</p>
                                            <p className="text-sm text-muted-foreground">2.5 mi away</p>
                                        </div>
                                    </div>
                                    <div className="text-right space-y-2">
                                        <p className="text-lg font-bold text-primary">${req.fare.toFixed(2)}</p>
                                        <div className="flex gap-2">
                                            <Button onClick={() => handleDeclineRide(req.id)} size="sm" variant="destructive">
                                                <X className="h-4 w-4"/>
                                            </Button>
                                            <Button onClick={() => handleAcceptRide(req.id)} size="sm" className="flex-grow">
                                                Accept
                                            </Button>
                                        </div>
                                    </div>
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
                                            <AvatarImage src={`https://i.pravatar.cc/150?u=${passenger.id}`} data-ai-hint="woman portrait" />
                                            <AvatarFallback>{passenger.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-bold text-card-foreground">{passenger.name}</p>
                                            <p className="text-sm text-muted-foreground">{ride.drop}</p>
                                        </div>
                                    </div>
                                    <p className="text-lg font-semibold text-green-500">${ride.fare.toFixed(2)}</p>
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
                <Link href="/driver" passHref>
                    <Button variant="ghost" className="flex-col h-16 w-full text-primary">
                        <Car/>
                        <span>Home</span>
                    </Button>
                </Link>
                <Link href="#completed" passHref>
                    <Button variant="ghost" className="flex-col h-16 w-full text-muted-foreground">
                        <CheckCircle/>
                        <span>Rides</span>
                    </Button>
                </Link>
                <Link href="/driver/safety" passHref>
                    <Button variant="ghost" className="flex-col h-16 w-full text-red-500">
                        <AlertTriangle/>
                        <span>SOS</span>
                    </Button>
                </Link>
            </div>
        </footer>
    </div>
  );
}
