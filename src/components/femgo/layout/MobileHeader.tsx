'use client';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MobileHeader({ title, backPath }: { title: string, backPath?: string }) {
  const router = useRouter();

  const handleBack = () => {
    if (backPath) {
      router.push(backPath);
    } else {
      router.back();
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4">
        <button onClick={handleBack} className="p-2 -ml-2">
          <ChevronLeft className="h-6 w-6" />
        </button>
      <h1 className="flex-1 text-center text-lg font-semibold -ml-10">
        {title}
      </h1>
    </header>
  );
}
