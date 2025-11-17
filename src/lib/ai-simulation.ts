'use client';

export function dummyFaceVerification(imageInput: any) {
  // Always return success for the prototype
  const success = true;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: "verified",
        message: "Face match successful",
        confidenceScore: (80 + Math.floor(Math.random() * 20))
      });
    }, 1500);
  });
}

export function dummySpeechSafety(audioSample: any) {
  // Always return false for emergency detection during signup
  const emergencyDetected = false;
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        detected: emergencyDetected,
        message: "No emergency activity detected",
        confidence: (50 + Math.floor(Math.random() * 15))
      });
    }, 2000);
  });
}
