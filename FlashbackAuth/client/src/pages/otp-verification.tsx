import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { verifyOTP, createSession } from '@/lib/api';
import { ArrowLeft, Shield, Check } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function OTPVerification() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { phoneNumber, setToken, setSession } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!phoneNumber) {
      setLocation('/');
    } else {
      // Focus first input on load
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [phoneNumber, setLocation]);

  const verifyOTPMutation = useMutation({
    mutationFn: ({ phoneNumber, otp }: { phoneNumber: string; otp: string }) => 
      verifyOTP(phoneNumber, otp),
    onSuccess: async (data) => {
      const token = data.token || data.accessToken || data.jwt;
      setToken(token);
      
      // Create session
      const loginTime = new Date().toLocaleTimeString();
      await createSession(phoneNumber, token, loginTime);
      
      toast({
        title: "Verification Successful!",
        description: "OTP verified successfully.",
      });
      
      setTimeout(() => {
        setLocation('/liveness');
      }, 1000);
    },
    onError: (error: any) => {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid or expired OTP. Please try again.",
        variant: "destructive",
      });
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    },
  });

  const handleOTPChange = (index: number, value: string) => {
    // Only allow numeric digits and limit to 1 character
    const numericValue = value.replace(/[^0-9]/g, '').slice(0, 1);
    
    const newOtp = [...otp];
    newOtp[index] = numericValue;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (numericValue && index < 5) {
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 0);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      toast({
        title: "Incomplete OTP",
        description: "Please enter the complete 6-digit OTP.",
        variant: "destructive",
      });
      return;
    }

    verifyOTPMutation.mutate({ phoneNumber, otp: otpValue });
  };

  const goBack = () => {
    setLocation('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background animate-fade-in">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <button 
          onClick={goBack}
          className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center hover:bg-accent transition-colors"
          data-testid="back-button"
        >
          <ArrowLeft className="text-foreground" size={16} />
        </button>
        <h1 className="title-medium">Verification</h1>
        <div className="w-10"></div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 px-6 flex flex-col justify-center">
        <div className="clean-card p-8 mb-8 animate-slide-in">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center animate-gentle-bounce">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="title-medium text-foreground mb-2">
              Enter OTP
            </h2>
            <p className="body-text">Check your WhatsApp for the 6-digit code</p>
            <p className="text-primary text-sm mt-1 font-mono" data-testid="phone-display">
              {phoneNumber}
            </p>
          </div>
          
          {/* OTP Input Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center space-x-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => inputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={(e) => {
                    e.preventDefault();
                    const pastedData = e.clipboardData.getData('text');
                    const digits = pastedData.replace(/\D/g, '').slice(0, 6);
                    if (digits.length > 0) {
                      const newOtp = [...otp];
                      for (let i = 0; i < Math.min(digits.length, 6); i++) {
                        newOtp[i] = digits[i];
                      }
                      setOtp(newOtp);
                      // Focus the next empty input or the last one
                      const nextIndex = Math.min(digits.length, 5);
                      inputRefs.current[nextIndex]?.focus();
                    }
                  }}
                  className="w-12 h-12 bg-background border-2 border-border rounded-lg text-center text-xl font-mono text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                  disabled={verifyOTPMutation.isPending}
                  data-testid={`otp-input-${index}`}
                />
              ))}
            </div>
            
            {/* Verify Button */}
            <Button
              type="submit"
              disabled={verifyOTPMutation.isPending}
              className="w-full h-12 button-text"
              data-testid="verify-button"
            >
              {verifyOTPMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Verifying...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Verify OTP
                </>
              )}
            </Button>
            
            {/* Resend Option */}
            <div className="text-center">
              <p className="body-text">Didn't receive the code?</p>
              <button 
                type="button"
                className="text-primary text-sm hover:text-primary/80 transition-colors mt-1"
                onClick={() => setLocation('/')}
                data-testid="resend-button"
              >
                Resend OTP
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
