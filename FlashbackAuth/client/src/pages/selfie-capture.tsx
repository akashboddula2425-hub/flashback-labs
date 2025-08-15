import { useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import CameraComponent from '@/components/camera-component';
import { useCamera } from '@/hooks/use-camera';
import { ArrowLeft, Camera } from 'lucide-react';

export default function SelfieCapture() {
  const [, setLocation] = useLocation();
  const { phoneNumber, setSelfieBlob } = useAuth();
  const { videoRef, isStreamActive, error, startCamera, capturePhoto } = useCamera();
  const [isCapturing, setIsCapturing] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  const handleCameraReady = () => {
    if (!isStreamActive) {
      startCamera();
    }
  };

  const handleCapture = async () => {
    try {
      setIsCapturing(true);
      
      // Flash effect
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 150);
      
      // Capture photo
      const blob = await capturePhoto();
      setSelfieBlob(blob);
      
      setTimeout(() => {
        setLocation('/upload');
      }, 500);
    } catch (err) {
      console.error('Capture error:', err);
    } finally {
      setIsCapturing(false);
    }
  };

  const goBack = () => {
    setLocation('/liveness');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <button 
          onClick={goBack}
          className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center hover:bg-accent transition-colors"
          data-testid="back-button"
        >
          <ArrowLeft className="text-neon-cyan" size={16} />
        </button>
        <h1 className="font-orbitron text-lg font-bold neon-text">CAPTURE SELFIE</h1>
        <div className="w-10"></div>
      </div>
      
      {/* Camera View */}
      <div className="flex-1 px-6 flex flex-col justify-center">
        <div className="relative mb-6">
          {/* Camera Preview */}
          <div className="w-80 h-80 mx-auto rounded-2xl overflow-hidden border-2 border-neon-cyan shadow-lg shadow-neon-cyan/20 relative">
            {error ? (
              <div className="w-full h-full bg-dark-card flex items-center justify-center text-center text-gray-500">
                <div>
                  <Camera className="text-4xl mb-2 mx-auto" />
                  <p className="text-sm">Camera Error:</p>
                  <p className="text-xs">{error}</p>
                </div>
              </div>
            ) : (
              <CameraComponent
                ref={videoRef}
                className="w-full h-full object-cover"
                onStreamReady={handleCameraReady}
                onError={() => {}}
              />
            )}
            
            {/* Camera Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <Button
                onClick={handleCapture}
                disabled={!isStreamActive || isCapturing}
                className="w-16 h-16 bg-gradient-to-br from-neon-cyan to-neon-pink rounded-full border-4 border-white/20 flex items-center justify-center shadow-lg shadow-neon-cyan/30 transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="capture-button"
              >
                <Camera className="text-white text-xl" />
              </Button>
            </div>
            
            {/* Flash Effect */}
            {showFlash && (
              <div 
                className="absolute inset-0 bg-white opacity-70 rounded-2xl pointer-events-none transition-opacity duration-150"
                data-testid="flash-effect"
              />
            )}
          </div>
        </div>
        
        {/* Instructions */}
        <div className="cyberpunk-card glassmorphism rounded-xl p-4">
          <div className="text-center">
            <p className="text-gray-300 text-sm mb-2">Position your face in the center</p>
            <p className="text-neon-cyan text-xs">Tap the camera button to capture</p>
          </div>
        </div>
      </div>
    </div>
  );
}
