import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Car } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Car className="h-6 w-6 text-primary" />
            <span className="font-bold">SafeHer Rides</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/ride"
              className="transition-colors hover:text-foreground/80"
            >
              Ride
            </Link>
            <Link
              href="/drive"
              className="transition-colors hover:text-foreground/80"
            >
              Drive
            </Link>
            <Link
              href="/safety"
              className="transition-colors hover:text-foreground/80"
            >
              Safety
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between md:justify-end">
           <Link href="/" className="flex items-center space-x-2 md:hidden">
            <Car className="h-6 w-6 text-primary" />
            <span className="font-bold">SafeHer Rides</span>
          </Link>
          <div className="flex items-center space-x-2">
            <nav className="hidden items-center space-x-2 md:flex">
                <Button asChild variant="ghost">
                <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                <Link href="/signup">Sign Up</Link>
                </Button>
            </nav>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex h-full flex-col p-6">
                    <Link href="/" className="mb-8 flex items-center space-x-2">
                        <Car className="h-6 w-6 text-primary" />
                        <span className="font-bold">SafeHer Rides</span>
                    </Link>
                    <div className="flex flex-col space-y-4 text-lg font-medium">
                        <Link href="/ride">Ride</Link>
                        <Link href="/drive">Drive</Link>
                        <Link href="/safety">Safety</Link>
                    </div>
                    <div className="mt-auto flex flex-col space-y-2">
                        <Button asChild variant="outline">
                        <Link href="/login">Login</Link>
                        </Button>
                        <Button asChild>
                        <Link href="/signup">Sign Up</Link>
                        </Button>
                    </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
