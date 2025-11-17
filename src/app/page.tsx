import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { KeyRound, MapPin, Shield, UserCheck } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const features = [
  {
    icon: <UserCheck className="h-8 w-8 text-primary" />,
    title: 'For Women, By Women',
    description: 'All our drivers are women, ensuring a safer and more comfortable ride experience.',
  },
  {
    icon: <KeyRound className="h-8 w-8 text-primary" />,
    title: 'OTP-Based Login',
    description: 'Secure your account and rides with One-Time Passwords for verification.',
  },
  {
    icon: <MapPin className="h-8 w-8 text-primary" />,
    title: 'Real-Time Tracking',
    description: 'Share your journey with loved ones and track your ride in real-time for peace of mind.',
  },
  {
    icon: <Shield className="h-8 w-8 text-primary" />,
    title: 'Emergency Assistance',
    description: 'An in-app SOS button to connect with authorities and share your location instantly.',
  },
];

const heroImage = PlaceHolderImages.find(p => p.id === 'hero-woman-car');

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 lg:py-40">
            <div className="absolute inset-0">
                {heroImage && (
                    <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={heroImage.imageHint}
                    priority
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                 <div className="absolute inset-0 bg-background/30" />
            </div>
            <div className="container relative z-10 text-center">
                <div className="mx-auto max-w-3xl">
                    <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                        Safe & Empowered Journeys for Women
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-foreground/90">
                        Welcome to SafeHer Rides, a ride-sharing service dedicated to creating a secure and comfortable travel experience for women.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Button asChild size="lg">
                            <Link href="/ride">Book a Ride</Link>
                        </Button>
                        <Button asChild variant="secondary" size="lg">
                            <Link href="/drive">Become a Driver</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="py-20 sm:py-32">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Your Safety is Our Priority
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                We've built features to ensure every ride is a safe ride.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.title} className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    {feature.icon}
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-base text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-card py-20 sm:py-32">
            <div className="container">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        How It Works
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Getting a safe ride is just a few taps away.
                    </p>
                </div>
                <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3">
                    <div className="flex flex-col items-center text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary text-primary">
                            <span className="text-2xl font-bold">1</span>
                        </div>
                        <h3 className="mt-6 text-xl font-semibold text-foreground">Request a Ride</h3>
                        <p className="mt-2 text-base text-muted-foreground">Enter your destination and confirm your pickup location.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary text-primary">
                            <span className="text-2xl font-bold">2</span>
                        </div>
                        <h3 className="mt-6 text-xl font-semibold text-foreground">Match with a Driver</h3>
                        <p className="mt-2 text-base text-muted-foreground">We'll connect you with a nearby female driver.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary text-primary">
                            <span className="text-2xl font-bold">3</span>
                        </div>
                        <h3 className="mt-6 text-xl font-semibold text-foreground">Enjoy Your Ride</h3>
                        <p className="mt-2 text-base text-muted-foreground">Travel with confidence, knowing you're in safe hands.</p>
                    </div>
                </div>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
