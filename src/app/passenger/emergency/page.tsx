
'use client';
import MobileHeader from "@/components/femgo/layout/MobileHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, PlusCircle, Phone } from "lucide-react";

const contacts = [
    { name: "Mom", phone: "+1 (555) 987-6543" },
    { name: "Jessica (Friend)", phone: "+1 (555) 345-6789" },
];

export default function EmergencyContactsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <MobileHeader title="Emergency Contacts" backPath="/passenger/profile" />
            <main className="flex-1 p-4">
                <div className="space-y-4">
                    {contacts.map((contact, index) => (
                        <Card key={index}>
                            <CardContent className="p-4 flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <User className="w-8 h-8 text-primary"/>
                                    <div>
                                        <p className="font-bold">{contact.name}</p>
                                        <p className="text-sm text-muted-foreground">{contact.phone}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon">
                                    <Phone className="w-5 h-5"/>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-8">
                    <Button className="w-full h-12">
                        <PlusCircle className="mr-2"/> Add New Contact
                    </Button>
                </div>
            </main>
        </div>
    )
}
