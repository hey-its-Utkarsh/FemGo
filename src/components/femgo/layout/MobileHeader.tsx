'use client';
import { ChevronLeft, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function MobileHeader({ title, backPath, showHomeButton = true }: { title: string, backPath?: string, showHomeButton?: boolean }) {
  const router = useRouter();

  const handleBack = () => {
    if (backPath) {
      router.push(backPath);
    } else {
      router.back();
    }
  };

  const handleHome = () => {
    router.push('/');
  }

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4">
        <Button onClick={handleBack} variant="ghost" size="icon" className="-ml-2">
          <ChevronLeft className="h-6 w-6" />
        </Button>
      <h1 className="flex-1 text-center text-lg font-semibold -ml-10">
        {title}
      </h1>
      {showHomeButton && (
        <Button onClick={handleHome} variant="ghost" size="icon" className="-mr-2">
            <Home className="h-6 w-6" />
        </Button>
      )}
    </header>
  );
}
