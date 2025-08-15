import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { Check, Phone, Clock, Home, LogOut, User, Zap, Shield, Cpu } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Welcome() {
  const [, setLocation] = useLocation();
  const { phoneNumber, session, selfieBlob } = useAuth();

  useEffect(() => {
    if (!phoneNumber) {
      setLocation('/');
    }
  }, [phoneNumber, setLocation]);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const goToHome = () => {
    // In a real app, this would navigate to the main dashboard
    alert('Welcome to Flashback! Main app features would be available here.');
  };

  const logout = () => {
    // Clear all auth data and return to login
    setLocation('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background animate-fade-in">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      {/* Header */}
      <div className="text-center pt-16 pb-8 relative z-10">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
            <Shield className="text-white text-3xl" />
          </div>
        </div>
        <h1 className="title-large text-foreground mb-2">
          FLASHBACK LABS
        </h1>
        <h2 className="title-medium text-primary mb-4">
          WELCOMES YOU TO THE NEW WORLD
        </h2>
        <p className="body-text">Authentication Complete</p>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 px-6 relative z-10">
        {/* Success Message */}
        <div className="clean-card p-8 mb-6 animate-slide-in">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center animate-pulse">
              <Shield className="text-2xl text-white" />
            </div>
            <h2 className="title-medium text-foreground mb-2">
              Authentication Complete!
            </h2>
            <p className="body-text">Your identity has been verified</p>
            <div className="flex justify-center space-x-4 mt-4">
              <div className="flex items-center space-x-2">
                <Zap className="text-blue-500" size={16} />
                <span className="text-xs text-blue-500">ACTIVE</span>
              </div>
              <div className="flex items-center space-x-2">
                <Cpu className="text-green-500" size={16} />
                <span className="text-xs text-green-500">VERIFIED</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="text-green-500" size={16} />
                <span className="text-xs text-green-500">SECURE</span>
              </div>
            </div>
          </div>
          
          {/* User Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Phone className="text-blue-500" size={16} />
                <span className="text-foreground">Phone Number</span>
              </div>
              <span className="text-blue-500 font-medium" data-testid="user-phone">
                {phoneNumber}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="text-green-500" size={16} />
                <span className="text-foreground">Login Time</span>
              </div>
              <span className="text-green-500 font-medium" data-testid="login-time">
                {getCurrentTime()}
              </span>
            </div>
          </div>
        </div>
        
        {/* Uploaded Selfie */}
        <div className="clean-card p-6 mb-6">
          <h3 className="title-medium text-foreground mb-4 text-center">
            Profile Photo
          </h3>
          <div className="relative">
            <div className="w-32 h-32 mx-auto rounded-full border-4 border-green-500 overflow-hidden shadow-lg relative">
              {selfieBlob ? (
                <img
                  src={URL.createObjectURL(selfieBlob)}
                  alt="User profile photo"
                  className="w-full h-full object-cover"
                  data-testid="user-selfie"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <User className="text-3xl text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center border-2 border-background">
              <Check className="text-white" size={16} />
            </div>
          </div>
          <p className="text-center text-xs text-green-500 mt-3 font-medium" data-testid="upload-status">
            Photo Verified ✓
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            onClick={goToHome}
            className="w-full h-12 bg-gradient-to-r from-blue-500 to-green-500 text-white button-text hover:from-blue-600 hover:to-green-600 transition-all duration-300"
            data-testid="continue-button"
          >
            <Home className="mr-2 h-5 w-5" />
            Continue to App
          </Button>
          
          <Button
            onClick={logout}
            variant="outline"
            className="w-full h-12 button-text"
            data-testid="logout-button"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
      
      {/* Footer */}
      <div className="px-6 pb-8 text-center relative z-10">
        <div className="flex justify-center space-x-4 mb-2">
          <span className="text-blue-500 text-xs font-medium">SECURE</span>
          <span className="text-green-500 text-xs font-medium">VERIFIED</span>
          <span className="text-blue-500 text-xs font-medium">TRUSTED</span>
        </div>
        <p className="text-muted-foreground text-xs">© 2024 FLASHBACK LABS</p>
      </div>
    </div>
  );
}
