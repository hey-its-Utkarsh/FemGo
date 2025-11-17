
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleDollarSign, CheckCircle, Car, AlertTriangle } from "lucide-react";
import ridesData from '@/data/rides.json';
import usersData from '@/data/users.json';

const driverId = "driver001"; // Assuming this is the logged-in driver

const rideRequests = ridesData.filter(ride => ride.rideStatus === 'requested');
const completedRides = ridesData.filter(ride => ride.driverId === driverId && ride.rideStatus === 'completed');

const getPassengerName = (passengerId: string) => {
    const passenger = usersData.find(user => user.id === passengerId);
    return passenger ? passenger.name : "Unknown Passenger";
};

const totalEarnings = completedRides.reduce((acc, ride) => acc + ride.fare, 0);

export default function DriverDashboard() {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
        <header className="p-4 bg-card shadow-md">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-primary">Welcome, Diana!</h1>
                    <p className="opacity-90 text-muted-foreground">You are online and ready for rides.</p>
                </div>
                 <Button variant="secondary">Go Offline</Button>
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
                    <TabsTrigger value="requests">New Requests</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                <TabsContent value="requests" className="mt-4">
                    <div className="space-y-4">
                    {rideRequests.map(req => (
                        <Card key={req.id} className="p-4 bg-card border-border">
                             <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-primary-foreground">{getPassengerName(req.passengerId)}</p>
                                    <p className="text-sm text-muted-foreground">2.5 mi away</p>
                                </div>
                                <Button>Accept</Button>
                             </div>
                        </Card>
                    ))}
                     {rideRequests.length === 0 && <p className="text-center text-muted-foreground py-8">No new ride requests.</p>}
                    </div>
                </TabsContent>
                <TabsContent value="completed" className="mt-4">
                    <div className="space-y-4">
                    {completedRides.map(ride => (
                        <Card key={ride.id} className="p-4 bg-card border-border">
                            <div className="flex items-center justify-between">
                                <div>
                                     <p className="font-bold text-primary-foreground">{getPassengerName(ride.passengerId)}</p>
                                     <p className="text-sm text-muted-foreground">{ride.drop}</p>
                                </div>
                                <p className="text-lg font-semibold text-green-400">${ride.fare.toFixed(2)}</p>
                             </div>
                        </Card>
                    ))}
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
}
