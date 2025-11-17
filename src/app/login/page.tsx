
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MobileHeader from '@/components/femgo/layout/MobileHeader';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Redirect to the new verification flow instead of directly to the passenger dashboard
        router.push('/verify');
    }
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 md:bg-background">
      <div className='md:hidden'>
        <MobileHeader title="Login" backPath="/"/>
      </div>
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 md:border shadow-none md:shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary">Verification Required</CardTitle>
            <CardDescription>
              For your safety, we need to verify your identity. Please enter your phone number to begin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="flex flex-col gap-6">
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" defaultValue="+15551234567" />
                </div>
                <Button type="submit" size="lg" className="w-full text-lg py-6">Start Verification</Button>
                <p className="text-center text-sm text-muted-foreground">
                    We'll send a One-Time Password to your number. <br/> (This is a dummy flow, just click the button).
                </p>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
