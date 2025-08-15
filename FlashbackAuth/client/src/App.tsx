import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/auth-context";
import PhoneInput from "@/pages/phone-input";
import OTPVerification from "@/pages/otp-verification";
import LivenessCheck from "@/pages/liveness-check";
import SelfieCapture from "@/pages/selfie-capture";
import UploadProgress from "@/pages/upload-progress";
import Welcome from "@/pages/welcome";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={PhoneInput} />
      <Route path="/otp" component={OTPVerification} />
      <Route path="/liveness" component={LivenessCheck} />
      <Route path="/selfie" component={SelfieCapture} />
      <Route path="/upload" component={UploadProgress} />
      <Route path="/welcome" component={Welcome} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
