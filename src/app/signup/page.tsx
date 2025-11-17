
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, User } from 'lucide-react';
import Link from 'next/link';
import MobileHeader from '@/components/femgo/layout/MobileHeader';

export default function SignupPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 md:bg-background">
      <MobileHeader title="Choose Your Role" backPath="/" />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary">Join FemGo</CardTitle>
            <CardDescription>
              Sign up as a passenger to book safe rides, or as a driver to start earning.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Link href="/signup/passenger" passHref>
                <Button variant="outline" className="w-full h-32 flex-col gap-2">
                    <User className="w-8 h-8 text-primary" />
                    <span className='text-lg'>Sign up as Passenger</span>
                </Button>
            </Link>
            <Link href="/signup/driver" passHref>
                <Button variant="outline" className="w-full h-32 flex-col gap-2">
                    <Car className="w-8 h-8 text-secondary" />
                    <span className='text-lg'>Sign up as Driver</span>
                </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
