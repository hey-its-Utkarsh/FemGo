'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, Loader2, CheckCircle, AlertCircle, Camera } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { verifyUser } from '@/ai/flows/verify-user-flow';
import { verifyUserByImage } from '@/ai/flows/verify-user-by-image-flow';


export default function VerifyPage() {
  const [step, setStep] = useState<'voice' | 'image' | 'verified'>('voice');
  const [isRecording, setIsRecording] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [imageCapture, setImageCapture] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const getPermissions = async () => {
      // Mic permission
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasMicPermission(true);
      } catch (error) {
        console.error('Error accessing microphone:', error);
        setHasMicPermission(false);
        toast({
          variant: 'destructive',
          title: 'Microphone Access Denied',
          description: 'Please enable microphone permissions in your browser settings.',
        });
      }
      // Camera permission
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
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings.',
        });
      }
    };

    getPermissions();
  }, [toast]);
  
  const phraseToRead = "The quick brown fox jumps over the lazy dog.";

  const handleRecord = async () => {
    if (isRecording) return;
    
    setIsRecording(true);
    setVerificationStatus('idle');
    // Simulate recording for 3 seconds
    setTimeout(async () => {
      setIsRecording(false);
      setIsVerifying(true);
      
      try {
        // Dummy audio data
        const result = await verifyUser({ audioDataUri: 'dummy-data' });
        if (result.isFemale) {
          setVerificationStatus('success');
          toast({
            title: 'Voice Verification Successful',
            description: "Now, let's verify your image.",
          });
          setStep('image');
        } else {
          setVerificationStatus('error');
          toast({
            variant: 'destructive',
            title: 'Verification Failed',
            description: result.reason,
          });
        }
      } catch (error) {
        setVerificationStatus('error');
        toast({
          variant: 'destructive',
          title: 'Verification Error',
          description: 'An unexpected error occurred during voice verification.',
        });
      } finally {
        setIsVerifying(false);
      }
    }, 3000);
  };

  const handleCaptureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUri = canvas.toDataURL('image/png');
        setImageCapture(dataUri);
      }
    }
  };

  const handleVerifyImage = async () => {
    if (!imageCapture) return;

    setIsVerifying(true);
    setVerificationStatus('idle');
    try {
      const result = await verifyUserByImage({ imageDataUri: imageCapture });
      if (result.isFemale) {
        setVerificationStatus('success');
        setStep('verified');
        toast({
          title: 'Verification Successful',
          description: "You've been successfully verified.",
        });
        setTimeout(() => router.push('/ride'), 2000);
      } else {
        setVerificationStatus('error');
        toast({
          variant: 'destructive',
          title: 'Verification Failed',
          description: result.reason,
        });
        setImageCapture(null); // Allow retake
      }
    } catch (error) {
      setVerificationStatus('error');
      toast({
        variant: 'destructive',
        title: 'Verification Error',
        description: 'An unexpected error occurred during image verification.',
      });
      setImageCapture(null); // Allow retake
    } finally {
      setIsVerifying(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-background">
        <Card className="w-full max-w-md text-center">
          {step === 'voice' && (
            <>
              <CardHeader>
                <CardTitle>Step 1: Voice Verification</CardTitle>
                <CardDescription>Please read the following phrase aloud:</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-6">
                <p className="text-lg font-semibold text-primary">
                  "{phraseToRead}"
                </p>

                {hasMicPermission === false && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Microphone Access Required</AlertTitle>
                        <AlertDescription>
                        Please grant microphone access to proceed.
                        </AlertDescription>
                    </Alert>
                )}

                <Button onClick={handleRecord} disabled={isRecording || isVerifying || hasMicPermission === false} size="lg" className="w-48">
                  {isRecording ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Recording...</>
                  ) : isVerifying ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</>
                  ) : (
                    <><Mic className="mr-2 h-4 w-4" /> Start Recording</>
                  )}
                </Button>
                
                {verificationStatus === 'error' && (
                  <div className="flex items-center text-destructive">
                    <AlertCircle className="mr-2 h-5 w-5" />
                    <span>Verification failed. Please try again.</span>
                  </div>
                )}
              </CardContent>
            </>
          )}

          {step === 'image' && (
             <>
              <CardHeader>
                <CardTitle>Step 2: Image Verification</CardTitle>
                <CardDescription>Please take a clear photo of your face.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-6">
                <div className="w-full aspect-video rounded-md bg-muted overflow-hidden relative">
                  {hasCameraPermission === false ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <Alert variant="destructive" className="w-auto">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Camera Access Required</AlertTitle>
                        </Alert>
                      </div>
                  ) : imageCapture ? (
                      <img src={imageCapture} alt="User capture" className="w-full h-full object-cover" />
                  ) : (
                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                  )}
                  <canvas ref={canvasRef} className="hidden" />
                </div>

                {imageCapture ? (
                   <div className='flex gap-2 w-full'>
                    <Button onClick={() => setImageCapture(null)} variant="outline" className="w-full" disabled={isVerifying}>Retake</Button>
                    <Button onClick={handleVerifyImage} className="w-full" disabled={isVerifying}>
                      {isVerifying ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</>
                      ) : (
                        'Verify Image'
                      )}
                    </Button>
                   </div>
                ) : (
                  <Button onClick={handleCaptureImage} disabled={isVerifying || hasCameraPermission === false} size="lg" className="w-48">
                    <Camera className="mr-2 h-4 w-4" />
                    Capture Image
                  </Button>
                )}

                {verificationStatus === 'error' && (
                  <div className="flex items-center text-destructive">
                    <AlertCircle className="mr-2 h-5 w-5" />
                    <span>Verification failed. Please try again.</span>
                  </div>
                )}
              </CardContent>
            </>
          )}

          {step === 'verified' && (
             <CardContent className="flex flex-col items-center gap-6 pt-6">
                <CheckCircle className="h-16 w-16 text-green-600" />
                <div className="text-center">
                    <CardTitle>Verification Complete</CardTitle>
                    <CardDescription className="mt-2">You will be redirected shortly.</CardDescription>
                </div>
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </CardContent>
          )}

        </Card>
      </main>
      <Footer />
    </div>
  );
}
