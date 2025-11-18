'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MobileHeader from '@/components/femgo/layout/MobileHeader';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function LoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [email, setEmail] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you'd verify credentials. Here, we just redirect based on a dummy email.
        toast({
            title: "Login Successful",
            description: "Redirecting to your dashboard...",
        });

        if (email.includes('admin')) {
            router.push('/admin');
        }
        else {
            router.push('/driver');
        }
    }
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <MobileHeader title="Driver Login" backPath="/" />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 md:border shadow-none md:shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary">Driver Login</CardTitle>
            <CardDescription>
              Log in to your FemGo driver account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="flex flex-col gap-6">
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="••••••••" />
                </div>
                <Button type="submit" size="lg" className="w-full text-lg py-6">Login</Button>
                <p className="text-center text-sm text-muted-foreground">
                    Are you a passenger?{' '}
                    <Link href="/login/passenger" className="font-semibold text-primary hover:underline">
                        Passenger Login
                    </Link>
                </p>
                 <p className="text-center text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Link href="/signup/driver" className="font-semibold text-primary hover:underline">
                        Sign Up as a Driver
                    </Link>
                </p>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
