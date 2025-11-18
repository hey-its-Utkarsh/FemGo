
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Header from '@/components/femgo/layout/Header';
import { ShieldCheck, Users, Car, UserCog } from 'lucide-react';

export default function FemGoHome() {
  const heroImage = "https://static.vecteezy.com/system/resources/previews/002/029/774/large_2x/four-african-american-women-in-a-car-photo.jpg";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 lg:py-40">
          <div className="absolute inset-0">
            <Image
              src={heroImage}
              alt="Women friends enjoying a ride"
              fill
              className="object-cover opacity-30"
              data-ai-hint="women friends car"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          </div>
          <div className="container relative z-10 text-center">
            <div className="mx-auto max-w-3xl">
              <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                Safe Rides, <span className="text-primary">Empowered Journeys</span>.
              </h1>
              <p className="mt-6 text-lg leading-8 text-foreground/80">
                Welcome to FemGo, the ride-sharing platform designed for women, by women. Experience safety, comfort, and empowerment on every ride.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button asChild size="lg" className="text-lg">
                  <Link href="/login/passenger">Book a Ride</Link>
                </Button>
                <Button asChild variant="secondary" size="lg" className="text-lg">
                  <Link href="/login">Drive with Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Portals Section */}
        <section id="portals" className="py-20 sm:py-24 bg-background">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Choose Your Role
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Whether you're a passenger, a driver, or an admin, we have a dedicated experience for you.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center p-8 border rounded-lg shadow-lg bg-card hover:shadow-primary/20 transition-shadow">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold">Passenger</h3>
                <p className="mt-2 text-base text-muted-foreground">Request safe and reliable rides with verified female drivers.</p>
                <Button asChild className="mt-6">
                  <Link href="/login/passenger">Passenger Dashboard</Link>
                </Button>
              </div>
              <div className="flex flex-col items-center text-center p-8 border rounded-lg shadow-lg bg-card hover:shadow-secondary/20 transition-shadow">
                <Car className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold">Driver</h3>
                <p className="mt-2 text-base text-muted-foreground">Join our community of female drivers and earn on your own schedule.</p>
                <Button asChild variant="secondary" className="mt-6">
                  <Link href="/login">Driver Dashboard</Link>
                </Button>
              </div>
              <div className="flex flex-col items-center text-center p-8 border rounded-lg shadow-lg bg-card hover:shadow-accent/20 transition-shadow">
                <UserCog className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold">Admin</h3>
                <p className="mt-2 text-base text-muted-foreground">Manage operations, ensure safety, and oversee the platform.</p>
                <Button asChild variant="outline" className="mt-6">
                  <Link href="/login/admin">Admin Panel</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-card">
        <div className="container py-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} FemGo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
