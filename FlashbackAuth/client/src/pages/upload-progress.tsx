import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/context/auth-context';
import { uploadSelfie, updateSessionWithSelfie } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { CloudUpload } from 'lucide-react';

export default function UploadProgress() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { phoneNumber, token, selfieBlob } = useAuth();
  const [progress, setProgress] = useState(0);

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!selfieBlob || !phoneNumber || !token) {
        throw new Error('Missing required data for upload');
      }
      
      const result = await uploadSelfie(selfieBlob, phoneNumber, token);
      
      // Update session with selfie URL if provided
      if (result.imageUrl || result.url) {
        await updateSessionWithSelfie(phoneNumber, result.imageUrl || result.url);
      }
      
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Upload Complete!",
        description: "Your selfie has been uploaded successfully.",
      });
      
      setTimeout(() => {
        setLocation('/welcome');
      }, 1000);
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload selfie. Please try again.",
        variant: "destructive",
      });
      
      setTimeout(() => {
        setLocation('/selfie');
      }, 2000);
    },
  });

  useEffect(() => {
    if (!phoneNumber || !token || !selfieBlob) {
      setLocation('/');
      return;
    }

    // Start upload
    uploadMutation.mutate();
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [phoneNumber, token, selfieBlob]);

  return (
    <div className="min-h-screen flex flex-col bg-background animate-fade-in">
      {/* Header */}
      <div className="text-center pt-16 pb-8">
        <h1 className="title-large text-foreground">Uploading</h1>
        <p className="body-text mt-2">Processing your selfie...</p>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 px-6 flex flex-col justify-center">
        <div className="cyberpunk-card glassmorphism rounded-xl p-8">
          {/* Upload Icon */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center animate-float">
              <CloudUpload className="text-2xl text-white" />
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Upload Progress</span>
              <span data-testid="upload-progress">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-dark-card rounded-full h-2 overflow-hidden">
              <div 
                className="h-2 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
                data-testid="progress-bar"
              />
            </div>
          </div>
          
          {/* Upload Status */}
          <div className="text-center space-y-2">
            <p className="text-gray-300 text-sm" data-testid="upload-status">
              {uploadMutation.isPending ? 'Uploading to secure servers...' : 
               uploadMutation.isError ? 'Upload failed' : 
               'Upload complete!'}
            </p>
            <p className="text-xs text-gray-500 font-mono">ENC_SELFIE_2024.jpg</p>
          </div>
          
          {/* Loading Animation */}
          <div className="flex justify-center mt-6">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-neon-purple rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-neon-pink rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
          
          {/* Error Display */}
          {uploadMutation.isError && (
            <div className="mt-4 text-center">
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                <p className="text-red-400 text-sm" data-testid="error-message">
                  {uploadMutation.error?.message || 'Upload failed. Redirecting...'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
