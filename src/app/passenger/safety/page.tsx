
'use client';
import MobileHeader from "@/components/femgo/layout/MobileHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, ShieldAlert, Users, Loader2, CheckCircle, Mic, Camera } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

type SOSState = 'idle' | 'sending' | 'capturing';

export default function SafetyCenterPage() {
    const [sosState, setSosState] = useState<SOSState>('idle');
    const [hasPermissions, setHasPermissions] = useState(false);
    const { toast } = useToast();

    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const photoIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const audioTimerIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const [photoCount, setPhotoCount] = useState(0);
    const [audioDuration, setAudioDuration] = useState(0);


    useEffect(() => {
        const getPermissions = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                setHasPermissions(true);
            } catch (error) {
                console.error("Error accessing media devices:", error);
                setHasPermissions(false);
                toast({
                    variant: "destructive",
                    title: "Permissions Denied",
                    description: "Camera and microphone access are required for SOS features.",
                });
            }
        };

        getPermissions();

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            if (photoIntervalRef.current) clearInterval(photoIntervalRef.current);
            if (audioTimerIntervalRef.current) clearInterval(audioTimerIntervalRef.current);
            
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop();
            }
        };
    }, [toast]);

    const startCapturing = () => {
        if (!streamRef.current) {
            toast({ variant: 'destructive', title: 'Media stream not available.' });
            return;
        }
        
        mediaRecorderRef.current = new MediaRecorder(streamRef.current);
        mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };
        mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            console.log("Audio recorded:", audioBlob);
        };
        mediaRecorderRef.current.start();
        console.log("Audio recording started.");
        
        audioTimerIntervalRef.current = setInterval(() => {
            setAudioDuration(prev => prev + 1);
        }, 1000);

        photoIntervalRef.current = setInterval(() => {
             setPhotoCount(prev => prev + 1);
            if (videoRef.current) {
                const canvas = document.createElement('canvas');
                canvas.width = videoRef.current.videoWidth;
                canvas.height = videoRef.current.videoHeight;
                const context = canvas.getContext('2d');
                if (context) {
                    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                    const photoDataUrl = canvas.toDataURL('image/jpeg');
                    console.log("Photo captured:", photoDataUrl.substring(0, 50) + "...");
                }
            }
        }, 10000); 
        console.log("Periodic photo capture started.");
        setTimeout(() => setPhotoCount(1), 100);

        toast({
            title: "Live Capture Started",
            description: "Recording audio and taking periodic photos for your safety."
        })
    };


    const handleSendSOS = () => {
        if (!hasPermissions) {
            toast({
                variant: "destructive",
                title: "Cannot send SOS",
                description: "Camera and microphone permissions are required.",
            });
            return;
        }

        setSosState('sending');
        setTimeout(() => {
            setSosState('capturing');
            startCapturing();
        }, 2000);
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <MobileHeader title="Safety Center" backPath="/passenger" />
            <main className="flex-1 p-4 text-center">
                <Card className={`p-6 transition-all duration-300 ${sosState === 'capturing' ? 'bg-green-50 dark:bg-green-900/20 border-green-500' : 'bg-red-50 dark:bg-red-900/20 border-destructive'}`}>
                    {sosState === 'idle' && <ShieldAlert className="w-16 h-16 text-destructive mx-auto" />}
                    {sosState === 'sending' && <Loader2 className="w-16 h-16 text-destructive mx-auto animate-spin" />}
                    {sosState === 'capturing' && <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />}
                    
                    <h1 className={`text-2xl font-bold mt-4 ${sosState === 'capturing' ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>
                        {sosState === 'idle' && "Emergency - SOS"}
                        {sosState === 'sending' && "Sending Alert..."}
                        {sosState === 'capturing' && "Alert Sent & Recording Active"}
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        {sosState === 'idle' && "Press the button to alert emergency contacts and start recording."}
                        {sosState === 'sending' && "Connecting to emergency services. Stand by."}
                        {sosState === 'capturing' && "Live audio and periodic photos are being captured for your safety."}
                    </p>
                    <Button 
                        size="lg" 
                        variant={sosState === 'capturing' ? "default" : "destructive"}
                        className={`w-full mt-6 h-16 text-lg transition-all duration-300 ${sosState === 'capturing' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                        onClick={handleSendSOS}
                        disabled={sosState !== 'idle' || !hasPermissions}
                    >
                        {sosState === 'idle' && <><Phone className="mr-2"/> Send SOS Alert</>}
                        {sosState === 'sending' && <><Loader2 className="mr-2 animate-spin"/> Connecting...</>}
                        {sosState === 'capturing' && <><CheckCircle className="mr-2"/> Alert Confirmed</>}
                    </Button>
                </Card>
                 
                 {sosState === 'capturing' && (
                    <div className="mt-8 space-y-4 text-left">
                        <h2 className="text-xl font-bold">Live Capture Status</h2>
                        <Card>
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Mic className="w-8 h-8 text-primary"/>
                                    <div>
                                        <p className="font-semibold">Capturing Audio</p>
                                        <p className="text-sm text-muted-foreground">Recording in progress...</p>
                                    </div>
                                </div>
                                <p className="font-mono text-lg">{formatDuration(audioDuration)}</p>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Camera className="w-8 h-8 text-primary"/>
                                    <div>
                                        <p className="font-semibold">Taking Pictures</p>
                                        <p className="text-sm text-muted-foreground">Photos are taken every 10 seconds.</p>
                                    </div>
                                </div>
                                <p className="font-mono text-lg">{photoCount}</p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                 <video ref={videoRef} className="absolute w-px h-px opacity-0 -z-10" autoPlay muted playsInline />

                {!hasPermissions && sosState !== 'capturing' && (
                    <div className="mt-8 space-y-4 text-left">
                         <Alert variant="destructive">
                            <AlertTitle>Permissions Required</AlertTitle>
                            <AlertDescription>
                                Please grant camera and microphone access in your browser settings to enable all safety features.
                            </AlertDescription>
                        </Alert>
                    </div>
                )}

                <div className="mt-8 space-y-4 text-left">
                    <h2 className="text-xl font-bold">Safety Toolkit</h2>
                    <Link href="/passenger/emergency">
                         <Card>
                            <CardContent className="p-4 flex items-center gap-4">
                                <Users className="w-8 h-8 text-primary"/>
                                <div>
                                    <p className="font-semibold">Manage Emergency Contacts</p>
                                    <p className="text-sm text-muted-foreground">Add or update your trusted contacts.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </main>
        </div>
    )
}
