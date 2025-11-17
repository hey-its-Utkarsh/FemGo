
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, HeartHandshake, LogIn } from 'lucide-react';
import { usePathname } from 'next/navigation';

const FemGoLogo = () => (
  <Link href="/" className="flex items-center space-x-2">
    <HeartHandshake className="h-7 w-7 text-primary" />
    <span className="text-2xl font-bold tracking-tight text-primary">FemGo</span>
  </Link>
);

export default function Header({ appName }: { appName?: string }) {
  const pathname = usePathname();

  const navLinks = [
    { href: '/passenger', label: 'Passenger' },
    { href: '/driver', label: 'Driver' },
    { href: '/admin', label: 'Admin' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center">
        <div className="mr-4 hidden md:flex">
          <FemGoLogo />
        </div>
        <div className="flex flex-1 items-center justify-between md:justify-end">
          <div className="md:hidden">
            <FemGoLogo />
          </div>
          <div className="flex items-center space-x-2">
            <nav className="hidden items-center space-x-6 text-base font-medium md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors hover:text-primary ${
                    pathname.startsWith(link.href)
                      ? 'text-primary'
                      : 'text-foreground/60'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="hidden md:flex items-center gap-4 ml-6">
                <Button variant="ghost" asChild>
                    <Link href="/login">
                        <LogIn className="mr-2" /> Login
                    </Link>
                </Button>
                <Button asChild>
                    <Link href="/signup">Sign Up</Link>
                </Button>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <nav className="flex h-full flex-col p-6">
                    <div className="mb-8">
                        <FemGoLogo />
                    </div>
                    <div className="flex flex-col space-y-4 text-lg font-medium">
                        {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`transition-colors hover:text-primary ${
                                pathname.startsWith(link.href)
                                ? 'text-primary'
                                : 'text-foreground/80'
                            }`}
                        >
                            {link.label}
                        </Link>
                        ))}
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
}
