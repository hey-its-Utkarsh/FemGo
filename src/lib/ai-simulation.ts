'use client';

export function dummyFaceVerification(imageInput: any) {
  const success = Math.random() > 0.4;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: success ? "verified" : "failed",
        message: success 
          ? "Face match successful"
          : "Face mismatch. Please try again.",
        confidenceScore: success 
          ? (80 + Math.floor(Math.random() * 20))
          : (40 + Math.floor(Math.random() * 20))
      });
    }, 1500);
  });
}

export function dummySpeechSafety(audioSample: any) {
  const emergencyDetected = Math.random() > 0.7;
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        detected: emergencyDetected,
        message: emergencyDetected
          ? "Emergency keyword detected"
          : "No emergency activity detected",
        confidence: emergencyDetected
          ? (85 + Math.floor(Math.random() * 15))
          : (50 + Math.floor(Math.random() * 15))
      });
    }, 2000);
  });
}
