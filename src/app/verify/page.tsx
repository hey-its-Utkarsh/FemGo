'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { verifyUser } from '@/ai/flows/verify-user-flow';


export default function VerifyPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasPermission(true);
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing microphone:', error);
        setHasPermission(false);
        toast({
          variant: 'destructive',
          title: 'Microphone Access Denied',
          description: 'Please enable microphone permissions in your browser settings.',
        });
      }
    };

    getCameraPermission();
  }, [toast]);
  
  const phraseToRead = "The quick brown fox jumps over the lazy dog.";

  const handleRecord = async () => {
    if (isRecording) return;
    
    setIsRecording(true);
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
        }
      } catch (error) {
        setVerificationStatus('error');
        toast({
          variant: 'destructive',
          title: 'Verification Error',
          description: 'An unexpected error occurred.',
        });
      } finally {
        setIsVerifying(false);
      }
    }, 3000);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-background">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Voice Verification</CardTitle>
            <CardDescription>Please read the following phrase aloud:</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <p className="text-lg font-semibold text-primary">
              "{phraseToRead}"
            </p>

            {hasPermission === false && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Microphone Access Required</AlertTitle>
                    <AlertDescription>
                    Please grant microphone access to proceed.
                    </AlertDescription>
                </Alert>
            )}

            <Button onClick={handleRecord} disabled={isRecording || isVerifying || hasPermission === false} size="lg" className="w-48">
              {isRecording ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Recording...
                </>
              ) : isVerifying ? (
                 <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-4 w-4" />
                  {verificationStatus === 'idle' ? 'Start Recording' : 'Record Again'}
                </>
              )}
            </Button>
            
            {verificationStatus === 'success' && (
              <div className="flex items-center text-green-600">
                <CheckCircle className="mr-2 h-5 w-5" />
                <span>Verification successful! Redirecting...</span>
              </div>
            )}
            {verificationStatus === 'error' && (
              <div className="flex items-center text-destructive">
                <AlertCircle className="mr-2 h-5 w-5" />
                <span>Verification failed. Please try again.</span>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
