import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import LivenessDetectorComponent from '@/components/liveness-detector';
import { LivenessResult } from '@/lib/liveness';
import { ArrowLeft, Eye, Lightbulb, Smartphone, Play, Camera } from 'lucide-react';

export default function LivenessCheck() {
  const [, setLocation] = useLocation();
  const { phoneNumber } = useAuth();
  const [isCheckActive, setIsCheckActive] = useState(false);
  const [livenessResult, setLivenessResult] = useState<LivenessResult | null>(null);
  const [captureEnabled, setCaptureEnabled] = useState(false);

  useEffect(() => {
    if (!phoneNumber) {
      setLocation('/');
    }
  }, [phoneNumber, setLocation]);

  const handleLivenessResult = (result: LivenessResult) => {
    setLivenessResult(result);
    
    if (result.isLive && result.confidence > 0.8) {
      setCaptureEnabled(true);
    }
  };

  const startLivenessCheck = () => {
    setIsCheckActive(true);
    setCaptureEnabled(false);
    setLivenessResult(null);
  };

  const proceedToCapture = () => {
    setLocation('/selfie');
  };

  const goBack = () => {
    setLocation('/otp');
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
          <ArrowLeft className="text-neon-purple" size={16} />
        </button>
        <h1 className="font-orbitron text-lg font-bold text-neon-purple">LIVENESS CHECK</h1>
        <div className="w-10"></div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 px-6 flex flex-col justify-center">
        {/* Instructions */}
        <div className="cyberpunk-card glassmorphism rounded-xl p-6 mb-6">
          <h2 className="font-orbitron text-lg font-bold text-neon-purple mb-4 text-center">
            Face Verification
          </h2>
          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-neon-purple/20 flex items-center justify-center">
                <Eye className="text-neon-purple" size={12} />
              </div>
              <span>Look directly at the camera</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-neon-purple/20 flex items-center justify-center">
                <Lightbulb className="text-neon-purple" size={12} />
              </div>
              <span>Ensure good lighting</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-neon-purple/20 flex items-center justify-center">
                <Smartphone className="text-neon-purple" size={12} />
              </div>
              <span>Hold device steady</span>
            </div>
          </div>
        </div>
        
        {/* Camera Frame */}
        <div className="relative mb-6">
          <LivenessDetectorComponent
            onLivenessResult={handleLivenessResult}
            isActive={isCheckActive}
          />
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-4">
          {!isCheckActive ? (
            <Button
              onClick={startLivenessCheck}
              className="w-full bg-gradient-to-r from-neon-purple to-neon-cyan py-3 rounded-lg font-semibold text-black transition-all duration-300 transform hover:scale-105"
              data-testid="start-liveness-button"
            >
              <Play className="mr-2 h-4 w-4" />
              START LIVENESS CHECK
            </Button>
          ) : (
            <Button
              onClick={proceedToCapture}
              disabled={!captureEnabled}
              className={`w-full py-3 rounded-lg font-semibold text-black transition-all duration-300 transform hover:scale-105 ${
                captureEnabled 
                  ? 'bg-gradient-to-r from-green-500 to-neon-cyan' 
                  : 'bg-gray-600 opacity-50 cursor-not-allowed'
              }`}
              data-testid="capture-selfie-button"
            >
              <Camera className="mr-2 h-4 w-4" />
              CAPTURE SELFIE
            </Button>
          )}
        </div>
        
        {/* Result Display */}
        {livenessResult && (
          <div className="mt-4 text-center">
            <div className={`p-3 rounded-lg border ${
              livenessResult.isLive 
                ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
            }`}>
              <p className="text-sm font-mono" data-testid="liveness-result">
                {livenessResult.reason} ({Math.round(livenessResult.confidence * 100)}%)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
