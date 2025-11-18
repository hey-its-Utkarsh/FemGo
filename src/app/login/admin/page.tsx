
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MobileHeader from '@/components/femgo/layout/MobileHeader';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function AdminLoginPage() {
    const router = useRouter();
    const { toast } = useToast();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Admin Login Successful",
            description: "Redirecting to the admin dashboard...",
        });
        router.push('/admin');
    }
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <MobileHeader title="Admin Login" backPath="/" />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 md:border shadow-none md:shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary">Admin Login</CardTitle>
            <CardDescription>
              Access the SafeHer administration panel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="flex flex-col gap-6">
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="admin@example.com" required defaultValue="admin@safeher.com"/>
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="••••••••" required defaultValue="password" />
                </div>
                <Button type="submit" size="lg" className="w-full text-lg py-6">Login</Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
