
'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, Camera, Loader2, ShieldCheck, ShieldX, Video, User, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import MobileHeader from '@/components/femgo/layout/MobileHeader';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

type SignupStep = 'details' | 'voice' | 'face' | 'verifying' | 'complete' | 'failed';
type VoiceStep = 'instructions' | 'idle' | 'recording' | 'recorded' | 'analyzing' | 'analyzed';
type FaceStep = 'instructions' | 'capturing' | 'captured';
type FaceProfile = 'front' | 'left' | 'right';


const verificationSteps = [
    "Initializing verification sequence...",
    "Establishing secure connection...",
    "Analyzing vocal patterns for authenticity...",
    "Checking for stress indicators...",
    "Voice signature confirmed.",
    "Activating camera...",
    "Analyzing facial landmarks...",
    "Cross-referencing profiles for consistency...",
    "Verifying gender and identity markers...",
    "Finalizing identity check...",
];
const voicePrompts = [
  "My voice is my password, verify me.",
  "The quick brown fox jumps over the lazy dog.",
  "FemGo ensures safety and empowerment for everyone.",
  "I am signing up for a safe ride experience.",
  "Never underestimate the power of a woman."
];


export default function DriverSignupPage() {
  const [step, setStep] = useState<SignupStep>('details');
  const [voiceSubStep, setVoiceSubStep] = useState<VoiceStep>('instructions');
  const [faceSubStep, setFaceSubStep] = useState<FaceStep>('instructions');
  const [progress, setProgress] = useState(0);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [verificationStatusText, setVerificationStatusText] = useState('');
  const [voicePrompt, setVoicePrompt] = useState('');
  const [capturedPhotos, setCapturedPhotos] = useState<Record<FaceProfile, string | null>>({ front: null, left: null, right: null });
  const [currentProfile, setCurrentProfile] = useState<FaceProfile>('front');
  const [recordingTime, setRecordingTime] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  
  const updateVerificationStatus = (messages: string[], finalStep: SignupStep, success: boolean, successProgress: number, failureToast: any) => {
    let messageIndex = 0;
    const interval = setInterval(() => {
        if (messageIndex < messages.length) {
            setVerificationStatusText(messages[messageIndex]);
            setProgress(p => Math.min(p + 5, successProgress - 5));
            messageIndex++;
        } else {
            clearInterval(interval);
            if (success) {
                setStep(finalStep);
                setProgress(successProgress);
            } else {
                toast(failureToast);
                setStep('failed');
            }
        }
    }, 400);
     return () => clearInterval(interval);
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProgress(25);
    setStep('voice');
  };

  const handleVoiceStart = () => {
    setVoiceSubStep('recording');
    setRecordingTime(0);
  };

  const handleVoiceStop = () => {
    setVoiceSubStep('recorded');
  };

  const handleVoiceSubmit = () => {
    setVoiceSubStep('analyzing');
    // Simulate analysis
    setTimeout(() => {
        setVoiceSubStep('analyzed');
    }, 2000);
  };

  const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
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

  useEffect(() => {
    if (step === 'voice' && voiceSubStep === 'idle') {
      setVoicePrompt(voicePrompts[Math.floor(Math.random() * voicePrompts.length)]);
    }

    if (step === 'face' && faceSubStep === 'capturing') {
      startCamera();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, faceSubStep, voiceSubStep]);

  useEffect(() => {
    if (voiceSubStep === 'recording') {
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }

    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [voiceSubStep]);


  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    
    if (context) {
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedPhotos(prev => ({...prev, [currentProfile]: dataUrl}));

      // Move to next profile
      if (currentProfile === 'front') setCurrentProfile('left');
      else if (currentProfile === 'left') setCurrentProfile('right');
      else setFaceSubStep('captured');
    }
  };

  const handleFaceSubmit = async () => {
    setStep('verifying');
    setProgress(75);
    const faceMessages = verificationSteps.slice(5);
    updateVerificationStatus(faceMessages, 'complete', true, 100, {
        variant: "destructive",
        title: "Verification Failed",
        description: "Could not verify identity.",
    });

    setTimeout(() => {
        router.push('/login');
    }, faceMessages.length * 400 + 1000);


    // Stop camera stream after capture
    if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleReset = () => {
    setProgress(0);
    setCapturedPhotos({ front: null, left: null, right: null });
    setCurrentProfile('front');
    setFaceSubStep('instructions');
    setVoiceSubStep('instructions');
    setStep('details');
  };

  const renderPhotoCaptureUI = () => {
    return (
      <>
        <CardTitle>Gender Recognition (Step 3/3)</CardTitle>
        <CardDescription>Position your face in the frame and capture your profile.</CardDescription>
        <div className="py-4 aspect-video w-full rounded-md bg-muted overflow-hidden flex items-center justify-center relative">
            <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted playsInline />
            <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
                <div className='w-48 h-64 border-4 border-dashed border-primary/50 rounded-lg' />
            </div>
            {currentProfile === 'left' && <div className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-md"><ChevronLeft className="w-8 h-8" /></div>}
            {currentProfile === 'right' && <div className="absolute top-4 left-4 text-white bg-black/50 p-2 rounded-md"><ChevronRight className="w-8 h-8" /></div>}
            {currentProfile === 'front' && <div className="absolute top-4 text-white bg-black/50 p-2 rounded-md"><User className="w-8 h-8" /></div>}
        </div>
        
        {hasCameraPermission === false && (
            <div className='text-red-500 text-sm'>Camera permission denied. Please enable it in your browser settings.</div>
        )}

        <Button onClick={handleCapturePhoto} disabled={!hasCameraPermission} className="w-full" size="lg">
            <Camera className="mr-2" /> Capture {currentProfile.charAt(0).toUpperCase() + currentProfile.slice(1)} Profile
        </Button>

        <div className='mt-4 space-y-2'>
          <p className='text-sm text-muted-foreground'>Captured Photos:</p>
          <div className='grid grid-cols-3 gap-2'>
            {Object.entries(capturedPhotos).map(([key, value]) => (
              <div key={key} className='aspect-square bg-muted rounded-md flex items-center justify-center'>
                {value ? <Image src={value} alt={`${key} profile`} width={100} height={100} className='rounded-md' /> : <div className='text-xs text-muted-foreground'>{key}</div>}
              </div>
            ))}
          </div>
        </div>
      </>
    )
  }
  
  const renderStepContent = () => {
    switch (step) {
      case 'details':
        return (
          <>
            <CardTitle>Driver Signup (Step 1/3)</CardTitle>
            <CardDescription>Please provide your details to join our driver network.</CardDescription>
            <form onSubmit={handleDetailsSubmit} className="flex flex-col gap-4 pt-4 text-left">
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" type="text" placeholder="Diana Prince" required />
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="driver@example.com" required />
                </div>
                 <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" required />
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="license">Driving License Number</Label>
                    <Input id="license" type="text" placeholder="D12345678" required />
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="vehicle">Vehicle Details</Label>
                    <Input id="vehicle" type="text" placeholder="Pink Toyota Prius - ABC 123" required />
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
            <AlertDialog open={voiceSubStep === 'instructions'} onOpenChange={(open) => !open && setVoiceSubStep('idle')}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Voice Verification Instructions</AlertDialogTitle>
                        <AlertDialogDescription>
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="relative w-24 h-24">
                                    <Mic className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-primary" />
                                    <svg className="w-full h-full animate-pulse" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="40" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" strokeDasharray="5 10" />
                                    </svg>
                                </div>
                                <p>To verify your voice, you will be asked to read a short phrase out loud. Please ensure you are in a quiet environment.</p>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setVoiceSubStep('idle')}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <CardTitle>Voice Verification (Step 2/3)</CardTitle>
            <CardDescription className='pt-2'>Press the button and clearly say:</CardDescription>
            <p className='text-lg font-semibold text-primary py-4'>"{voicePrompt}"</p>
            <div className="py-4 flex flex-col items-center justify-center gap-4 w-full">
              {voiceSubStep === 'idle' && (
                <Button size="lg" className="w-full" onClick={handleVoiceStart}>
                  <Mic className="mr-2" /> Start Recording
                </Button>
              )}
              {voiceSubStep === 'recording' && (
                <>
                  <div className="font-mono text-2xl text-primary">{new Date(recordingTime * 1000).toISOString().substr(14, 5)}</div>
                  <Button size="lg" className="w-full" variant="destructive" onClick={handleVoiceStop}>
                    <Mic className="mr-2 animate-pulse" /> Stop Recording
                  </Button>
                </>
              )}
              {voiceSubStep === 'recorded' && (
                <div className='flex flex-col items-center gap-4 w-full'>
                    <p className='text-green-500 flex items-center gap-2'><Check /> Recording Complete ({recordingTime}s)</p>
                    <Button size="lg" className="w-full" onClick={handleVoiceSubmit}>
                        Submit for Analysis
                    </Button>
                     <Button size="lg" variant="outline" className="w-full" onClick={() => setVoiceSubStep('idle')}>
                        Record Again
                    </Button>
                </div>
              )}
              {voiceSubStep === 'analyzing' && (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Loader2 size={32} className="animate-spin text-primary" />
                  <p>Analyzing voice signature...</p>
                </div>
              )}
              {voiceSubStep === 'analyzed' && (
                <div className='flex flex-col items-center gap-4 w-full text-center'>
                    <div className='p-4 rounded-lg bg-green-500/10 border border-green-500/30 w-full'>
                        <ShieldCheck className='w-12 h-12 text-green-500 mx-auto' />
                        <p className='font-semibold text-green-500 mt-2'>Voice Signature Confirmed</p>
                    </div>
                    <Button size="lg" className="w-full" onClick={() => { setProgress(60); setStep('face') }}>
                        Continue to Facial Scan
                    </Button>
                </div>
              )}
            </div>
          </>
        );
      case 'face':
        return (
          <>
             <AlertDialog open={faceSubStep === 'instructions'} onOpenChange={(open) => !open && setFaceSubStep('capturing')}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Facial Verification Instructions</AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className='flex flex-col items-center text-center gap-4'>
                                <div className="relative flex items-center justify-center w-24 h-24">
                                    <User className="w-12 h-12 text-primary" />
                                    <ChevronLeft className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 text-primary/70 animate-ping" style={{animationDelay: '0.5s'}} />
                                    <ChevronRight className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 text-primary/70 animate-ping" style={{animationDelay: '1s'}} />
                                </div>
                                <div>
                                    To ensure security, we need to capture three photos of your profile:
                                    <ul className='list-disc list-inside mt-2 text-left'>
                                      <li>A clear photo of your <strong>front profile</strong>.</li>
                                      <li>A photo of your <strong>left profile</strong>.</li>
                                      <li>A photo of your <strong>right profile</strong>.</li>
                                    </ul>
                                    Please make sure you are in a well-lit area.
                                </div>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setFaceSubStep('capturing')}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            
            {faceSubStep === 'capturing' && renderPhotoCaptureUI()}
            
            {faceSubStep === 'captured' && (
              <>
                <CardTitle>Ready to Submit?</CardTitle>
                <CardDescription>Review your captured photos below.</CardDescription>
                <div className='mt-4 space-y-2'>
                  <div className='grid grid-cols-3 gap-2'>
                    {Object.entries(capturedPhotos).map(([key, value]) => (
                      <div key={key} className='aspect-square bg-muted rounded-md flex items-center justify-center'>
                        {value ? <Image src={value} alt={`${key} profile`} width={100} height={100} className='rounded-md' /> : null}
                      </div>
                    ))}
                  </div>
                </div>
                <Button onClick={handleFaceSubmit} className="w-full mt-6" size="lg">Submit for Final Analysis</Button>
                <Button onClick={() => { setCurrentProfile('front'); setCapturedPhotos({ front: null, left: null, right: null }); setFaceSubStep('capturing'); }} variant="outline" className="w-full mt-2">
                    Recapture Photos
                </Button>
              </>
            )}
          </>
        );
      case 'verifying':
        return (
          <>
            <CardTitle>AI Verification In Progress...</CardTitle>
            <CardDescription>Our system is securing your profile. Please wait.</CardDescription>
            <div className="py-8 flex justify-center items-center flex-col gap-4">
              <Loader2 size={64} className="animate-spin text-primary" />
              <p className="text-lg font-semibold min-h-[28px]">{verificationStatusText}</p>
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
    <div className="flex flex-col min-h-screen bg-background">
      <MobileHeader title="Driver Signup" backPath="/signup" />
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

  