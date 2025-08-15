import { useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { sendOTP } from '@/lib/api';
import { Phone, Send } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function PhoneInput() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { setPhoneNumber } = useAuth();
  const [phoneDigits, setPhoneDigits] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const sendOTPMutation = useMutation({
    mutationFn: sendOTP,
    onSuccess: () => {
      const fullPhone = `+91${phoneDigits}`;
      setPhoneNumber(fullPhone);
      setShowSuccess(true);
      toast({
        title: "OTP Sent!",
        description: "Check your WhatsApp for the verification code.",
      });
      setTimeout(() => {
        setLocation('/otp');
      }, 1500);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneDigits.match(/^\d{10}$/)) {
      toast({
        title: "Invalid Format",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive",
      });
      return;
    }

    const fullPhone = `+91${phoneDigits}`;
    sendOTPMutation.mutate(fullPhone);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background animate-fade-in">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      
      {/* Header */}
      <div className="text-center pt-16 pb-8">
        <div className="w-16 h-16 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center animate-gentle-bounce">
          <Phone className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="title-large text-foreground mb-2">
          Welcome
        </h1>
        <p className="body-text">Enter your phone number to get started</p>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 px-6 flex flex-col justify-center">
        <div className="clean-card p-8 mb-8 animate-slide-in">
          <div className="text-center mb-8">
            <h2 className="title-medium text-foreground mb-2">
              Enter Your Phone Number
            </h2>
            <p className="body-text">We'll send an OTP to your WhatsApp</p>
          </div>
          
          {/* Phone Input Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Phone Number (E.164 format)
              </label>
              <div className="flex">
                <div className="flex items-center bg-muted border border-r-0 border-border rounded-l-lg px-3 py-2 text-foreground font-medium">
                  +91
                </div>
                <Input
                  type="tel"
                  placeholder="1234567890"
                  value={phoneDigits}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setPhoneDigits(value);
                  }}
                  className="flex-1 border-l-0 rounded-l-none"
                  disabled={sendOTPMutation.isPending}
                  data-testid="phone-input"
                  maxLength={10}
                />
              </div>
              <p className="text-xs text-muted-foreground">OTP will be sent via WhatsApp</p>
            </div>
            
            {/* Send OTP Button */}
            <Button
              type="submit"
              disabled={sendOTPMutation.isPending || phoneDigits.length !== 10}
              className="w-full h-12 button-text"
              data-testid="send-otp-button"
            >
              {sendOTPMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send OTP
                </>
              )}
            </Button>
          </form>
          
          {/* Status Messages */}
          {showSuccess && (
            <div className="mt-4 text-center animate-fade-in">
              <div className="p-3 rounded-lg bg-green-50 border border-green-200 dark:bg-green-950 dark:border-green-800">
                <p className="text-green-700 dark:text-green-300 text-sm" data-testid="success-message">
                  OTP sent successfully to WhatsApp!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <div className="px-6 pb-8 text-center">
        <p className="text-muted-foreground text-xs">Secure • Fast • Simple</p>
      </div>
    </div>
  );
}
