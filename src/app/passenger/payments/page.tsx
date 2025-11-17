
'use client';
import MobileHeader from "@/components/femgo/layout/MobileHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, PlusCircle } from "lucide-react";

export default function PaymentsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <MobileHeader title="Payments" backPath="/passenger" />
            <main className="flex-1 p-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                <CreditCard className="w-8 h-8 text-primary"/>
                                <div>
                                    <p className="font-bold">Visa **** 1234</p>
                                    <p className="text-sm text-muted-foreground">Default payment method</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm">Remove</Button>
                        </div>
                    </CardContent>
                </Card>
                 <div className="mt-6">
                    <Button className="w-full h-12">
                        <PlusCircle className="mr-2"/> Add Payment Method
                    </Button>
                 </div>
            </main>
        </div>
    )
}
