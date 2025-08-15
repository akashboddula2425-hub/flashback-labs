export interface LivenessResult {
  isLive: boolean;
  confidence: number;
  reason?: string;
}

export class LivenessDetector {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private lastFrameTime = 0;
  private motionHistory: number[] = [];
  private faceDetectionCount = 0;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  async detectLiveness(videoElement: HTMLVideoElement): Promise<LivenessResult> {
    if (!videoElement.videoWidth || !videoElement.videoHeight) {
      return {
        isLive: false,
        confidence: 0,
        reason: 'No video input detected'
      };
    }

    // Set canvas size to match video
    this.canvas.width = videoElement.videoWidth;
    this.canvas.height = videoElement.videoHeight;

    // Draw current frame
    this.ctx.drawImage(videoElement, 0, 0);

    // Simple liveness checks
    const motionDetected = this.detectMotion();
    const faceDetected = this.detectFace();
    const blinkDetected = this.detectBlink();

    let confidence = 0;
    let isLive = false;

    if (faceDetected) {
      confidence += 0.3;
      this.faceDetectionCount++;
    }

    if (motionDetected) {
      confidence += 0.4;
    }

    if (blinkDetected) {
      confidence += 0.3;
    }

    // Consider live if confidence is above 0.6 and we've detected a face for at least 10 frames
    isLive = confidence > 0.6 && this.faceDetectionCount > 10;

    return {
      isLive,
      confidence,
      reason: isLive ? 'Liveness confirmed' : 'Insufficient liveness indicators'
    };
  }

  private detectMotion(): boolean {
    const currentTime = Date.now();
    if (currentTime - this.lastFrameTime < 100) return false; // Throttle to 10fps

    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const pixels = imageData.data;
    
    // Simple motion detection based on pixel changes
    let totalChange = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      const brightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
      totalChange += Math.abs(brightness - (this.motionHistory[Math.floor(i / 4)] || 0));
      this.motionHistory[Math.floor(i / 4)] = brightness;
    }

    this.lastFrameTime = currentTime;
    
    // Threshold for motion detection
    return totalChange > 1000;
  }

  private detectFace(): boolean {
    // Simple face detection based on color distribution
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const pixels = imageData.data;
    
    let skinPixels = 0;
    let totalPixels = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      
      // Simple skin tone detection
      if (r > 95 && g > 40 && b > 20 && 
          r > g && r > b && 
          Math.abs(r - g) > 15) {
        skinPixels++;
      }
      totalPixels++;
    }

    const skinRatio = skinPixels / totalPixels;
    return skinRatio > 0.02; // At least 2% skin pixels
  }

  private detectBlink(): boolean {
    // Simplified blink detection based on overall brightness changes in eye region
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 3; // Upper third for eyes
    const eyeRegionSize = 50;

    const imageData = this.ctx.getImageData(
      centerX - eyeRegionSize, 
      centerY - eyeRegionSize/2, 
      eyeRegionSize * 2, 
      eyeRegionSize
    );
    
    const pixels = imageData.data;
    let brightness = 0;
    
    for (let i = 0; i < pixels.length; i += 4) {
      brightness += (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
    }
    
    brightness /= (pixels.length / 4);
    
    // This is a very basic implementation - in a real app you'd want more sophisticated blink detection
    return Math.random() > 0.7; // Simulate random blink detection
  }

  reset() {
    this.motionHistory = [];
    this.faceDetectionCount = 0;
    this.lastFrameTime = 0;
  }
}
