
'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, Camera, Loader2, ShieldCheck, ShieldX, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { dummySpeechSafety, dummyFaceVerification } from '@/lib/ai-simulation';
import MobileHeader from '@/components/femgo/layout/MobileHeader';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type SignupStep = 'details' | 'voice' | 'face' | 'verifying' | 'complete' | 'failed';

export default function SignupPage() {
  const [step, setStep] = useState<SignupStep>('details');
  const [progress, setProgress] = useState(0);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProgress(25);
    setStep('voice');
  };

  // Step 2: Voice recording simulation
  const handleVoiceStart = () => {
    setStep('verifying');
    setProgress(35);
    const interval = setInterval(() => {
      setProgress(p => (p < 50 ? p + 5 : 50));
    }, 200);

    setTimeout(async () => {
      clearInterval(interval);
      const result: any = await dummySpeechSafety(null);
      if (!result.detected) { // Assuming not detected means safe to proceed
        setProgress(60);
        setStep('face');
      } else {
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: "Safety concern detected in audio. Please try again in a calm environment.",
        });
        setStep('failed');
      }
    }, 3000);
  };

  // Step 3: Request camera permission
  useEffect(() => {
    if (step === 'face') {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setProgress(75);
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: "destructive",
            title: "Camera Access Denied",
            description: "Please enable camera permissions to continue.",
          });
        }
      };
      getCameraPermission();
    }
  }, [step, toast]);


  // Step 4: Face capture and verification
  const handleFaceCapture = async () => {
    setStep('verifying');
    const interval = setInterval(() => {
        setProgress(p => (p < 90 ? p + 5 : 90));
    }, 200);

    setTimeout(async () => {
        clearInterval(interval);
        const result: any = await dummyFaceVerification(null);
        if (result.status === "verified") {
            setProgress(100);
            setStep('complete');
            setTimeout(() => router.push('/login'), 2000);
        } else {
            toast({
                variant: "destructive",
                title: "Verification Failed",
                description: result.message,
            });
            setStep('failed');
        }
    }, 3000);

    // Stop camera stream after capture
    if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleReset = () => {
    setProgress(0);
    setStep('details');
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 'details':
        return (
          <>
            <CardTitle>Step 1: Your Details</CardTitle>
            <CardDescription>Create your account to get started.</CardDescription>
            <form onSubmit={handleDetailsSubmit} className="flex flex-col gap-4 pt-4 text-left">
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" type="text" placeholder="Jane Doe" required />
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="you@example.com" required />
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="••••••••" required />
                </div>
                <Button type="submit" size="lg" className="w-full">
                    Continue to Verification
                </Button>
            </form>
          </>
        );
      case 'voice':
        return (
          <>
            <CardTitle>Step 2: Voice Verification</CardTitle>
            <CardDescription className='pt-2'>Press the button and clearly say:</CardDescription>
            <p className='text-lg font-semibold text-primary py-4'>"My voice is my password"</p>
            <div className="py-4 flex justify-center">
              <Button size="icon" className="w-24 h-24 rounded-full bg-primary hover:bg-primary/90" onClick={handleVoiceStart}>
                <Mic size={48} />
              </Button>
            </div>
          </>
        );
      case 'face':
        return (
            <>
                <CardTitle>Step 3: Gender Recognition</CardTitle>
                <CardDescription>Position your face in the frame to complete signup.</CardDescription>
                <div className="py-4 aspect-video w-full rounded-md bg-muted overflow-hidden flex items-center justify-center">
                    <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted />
                </div>
                {hasCameraPermission === false && (
                    <Alert variant="destructive">
                    <AlertTitle>Camera Access Required</AlertTitle>
                    <AlertDescription>
                        Please allow camera access to use this feature.
                    </AlertDescription>
                    </Alert>
                )}
                <Button onClick={handleFaceCapture} disabled={!hasCameraPermission} className="w-full" size="lg">
                    <Camera className="mr-2" /> Capture & Finish
                </Button>
            </>
        )
      case 'verifying':
        return (
          <>
            <CardTitle>Verifying Your Identity...</CardTitle>
            <CardDescription>Our AI is analyzing your data. Please wait.</CardDescription>
            <div className="py-8 flex justify-center items-center flex-col gap-4">
              <Loader2 size={64} className="animate-spin text-primary" />
              <p className="text-lg font-semibold">Please wait</p>
            </div>
          </>
        );
      case 'complete':
        return (
          <>
            <CardTitle>Signup Complete!</CardTitle>
            <CardDescription>Redirecting you to the login page...</CardDescription>
            <div className="py-8 flex justify-center text-green-500">
              <ShieldCheck size={80} />
            </div>
          </>
        );
      case 'failed':
         return (
            <>
              <CardTitle>Verification Failed</CardTitle>
              <CardDescription>Please try again or contact support.</CardDescription>
              <div className="py-8 flex justify-center text-destructive">
                <ShieldX size={80} />
              </div>
              <Button onClick={handleReset} className="w-full">Try Again</Button>
            </>
          );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 md:bg-background">
      <MobileHeader title="Create Your Account" backPath="/" />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                {renderStepContent()}
            </CardHeader>
            <CardContent>
                <Progress value={progress} className="w-full" />
                <p className="text-center text-sm text-muted-foreground mt-4">
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold text-primary hover:underline">
                        Log In
                    </Link>
                </p>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
