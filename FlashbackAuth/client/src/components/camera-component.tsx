import { forwardRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface CameraComponentProps {
  className?: string;
  onStreamReady?: () => void;
  onError?: (error: string) => void;
}

const CameraComponent = forwardRef<HTMLVideoElement, CameraComponentProps>(
  ({ className, onStreamReady, onError }, ref) => {
    useEffect(() => {
      const startStream = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' },
            audio: false
          });

          if (ref && typeof ref !== 'function' && ref.current) {
            ref.current.srcObject = stream;
            await ref.current.play();
            onStreamReady?.();
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to access camera';
          onError?.(errorMessage);
        }
      };

      startStream();

      return () => {
        if (ref && typeof ref !== 'function' && ref.current?.srcObject) {
          const stream = ref.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
        }
      };
    }, [ref, onStreamReady, onError]);

    return (
      <video
        ref={ref}
        className={cn("w-full h-full object-cover", className)}
        autoPlay
        muted
        playsInline
        data-testid="camera-video"
      />
    );
  }
);

CameraComponent.displayName = 'CameraComponent';

export default CameraComponent;
