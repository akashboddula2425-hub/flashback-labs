import React, { useEffect, useRef, useState } from 'react';
import { LivenessDetector, LivenessResult } from '@/lib/liveness';
import CameraComponent from './camera-component';

interface LivenessDetectorComponentProps {
  onLivenessResult: (result: LivenessResult) => void;
  isActive: boolean;
}

export default function LivenessDetectorComponent({ 
  onLivenessResult, 
  isActive 
}: LivenessDetectorComponentProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const detectorRef = useRef<LivenessDetector>();
  const intervalRef = useRef<NodeJS.Timeout>();
  const [status, setStatus] = useState<string>('Starting liveness check...');

  useEffect(() => {
    if (!detectorRef.current) {
      detectorRef.current = new LivenessDetector();
    }
  }, []);

  useEffect(() => {
    if (isActive && videoRef.current) {
      startLivenessDetection();
    } else {
      stopLivenessDetection();
    }

    return () => stopLivenessDetection();
  }, [isActive]);

  const startLivenessDetection = () => {
    if (!videoRef.current || !detectorRef.current) return;

    setStatus('Analyzing face...');
    
    intervalRef.current = setInterval(async () => {
      if (videoRef.current && detectorRef.current) {
        try {
          const result = await detectorRef.current.detectLiveness(videoRef.current);
          onLivenessResult(result);
          
          if (result.isLive) {
            setStatus('Liveness confirmed!');
          } else {
            setStatus(`Analyzing... (${Math.round(result.confidence * 100)}%)`);
          }
        } catch (error) {
          console.error('Liveness detection error:', error);
          setStatus('Detection error');
        }
      }
    }, 500); // Check every 500ms
  };

  const stopLivenessDetection = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
    if (detectorRef.current) {
      detectorRef.current.reset();
    }
  };

  const handleStreamReady = () => {
    setStatus('Camera ready');
  };

  const handleError = (error: string) => {
    setStatus(`Camera error: ${error}`);
  };

  return (
    <div className="relative">
      <div className="camera-frame w-64 h-64 mx-auto relative overflow-hidden">
        <CameraComponent
          ref={videoRef}
          className="w-full h-full rounded-full object-cover"
          onStreamReady={handleStreamReady}
          onError={handleError}
        />
        
        {/* Scanning Animation */}
        {isActive && <div className="scan-line"></div>}
        
        {/* Corner Markers */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-neon-cyan"></div>
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-neon-cyan"></div>
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-neon-cyan"></div>
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-neon-cyan"></div>
      </div>
      
      {/* Status Text */}
      <div className="text-center mt-4">
        <p className="text-neon-purple font-mono text-sm" data-testid="liveness-status">
          {status}
        </p>
        <div className="flex justify-center mt-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-neon-purple rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-neon-purple rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-neon-purple rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
