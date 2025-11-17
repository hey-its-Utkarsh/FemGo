'use client';
import { ChevronLeft, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
        <button onClick={handleBack} className="p-2 -ml-2">
          <ChevronLeft className="h-6 w-6" />
        </button>
      <h1 className="flex-1 text-center text-lg font-semibold -ml-10">
        {title}
      </h1>
      {showHomeButton && (
        <button onClick={handleHome} className="p-2 -mr-2">
            <Home className="h-6 w-6" />
        </button>
      )}
    </header>
  );
}
