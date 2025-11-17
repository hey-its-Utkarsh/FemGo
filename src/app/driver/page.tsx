'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleDollarSign, CheckCircle, Car, AlertTriangle } from "lucide-react";

const rideRequests = [
    { id: 1, user: "Alice J.", distance: "2.5 mi away", destination: "123 Main St" },
    { id: 2, user: "Brenda S.", distance: "3.1 mi away", destination: "456 Oak Ave" },
];

const completedRides = [
    { id: 3, user: "Clara D.", fare: 22.50 },
];

export default function DriverDashboard() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
        <header className="p-4 bg-primary text-primary-foreground shadow-md">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Welcome, Diana!</h1>
                    <p className="opacity-90">You are online and ready for rides.</p>
                </div>
                 <Button variant="secondary">Go Offline</Button>
            </div>
        </header>

        <main className="flex-1 p-4 overflow-y-auto">
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <CircleDollarSign/>
                        Today's Earnings
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold text-primary">$78.50</p>
                    <p className="text-muted-foreground">From 3 completed rides</p>
                </CardContent>
            </Card>

            <Tabs defaultValue="requests" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="requests">New Requests</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                <TabsContent value="requests" className="mt-4">
                    <div className="space-y-4">
                    {rideRequests.map(req => (
                        <Card key={req.id} className="p-4">
                             <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold">{req.user}</p>
                                    <p className="text-sm text-muted-foreground">{req.distance}</p>
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
                        <Card key={ride.id} className="p-4">
                            <div className="flex items-center justify-between">
                                <p className="font-bold">{ride.user}</p>
                                <p className="text-lg font-semibold text-green-600">${ride.fare.toFixed(2)}</p>
                             </div>
                        </Card>
                    ))}
                    </div>
                </TabsContent>
            </Tabs>

        </main>
        
        <footer className="border-t p-2">
            <div className="grid grid-cols-3 gap-2">
                <Button variant="ghost" className="flex-col h-16 text-primary">
                    <Car/>
                    <span>Home</span>
                </Button>
                <Button variant="ghost" className="flex-col h-16">
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
