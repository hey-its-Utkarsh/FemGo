
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MobileHeader from '@/components/femgo/layout/MobileHeader';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you'd verify credentials. Here, we just redirect.
        router.push('/passenger');
    }
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 md:bg-background">
      <div className='md:hidden'>
        <MobileHeader title="Login" backPath="/" />
      </div>
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 md:border shadow-none md:shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary">Welcome Back</CardTitle>
            <CardDescription>
              Log in to your FemGo account to book a ride.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="flex flex-col gap-6">
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="you@example.com" defaultValue="passenger@femgo.com" />
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="••••••••" defaultValue="password123" />
                </div>
                <Button type="submit" size="lg" className="w-full text-lg py-6">Login</Button>
                <p className="text-center text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Link href="/signup" className="font-semibold text-primary hover:underline">
                        Sign Up
                    </Link>
                </p>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
