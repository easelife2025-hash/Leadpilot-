'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Link as LinkIcon, RefreshCw, MessageSquare, Play, UploadCloud, Smartphone, ArrowRight, ArrowLeft, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const steps = [
  { id: 1, title: 'Create Account', icon: Zap },
  { id: 2, title: 'Connect WhatsApp', icon: MessageSquare },
  { id: 3, title: 'Verify Business Number', icon: ShieldCheck },
  { id: 4, title: 'Import Leads', icon: UploadCloud },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [hasInitializedUrl, setHasInitializedUrl] = useState(false);
  
  // Auth state
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // WhatsApp state
  const [isConnected, setIsConnected] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !hasInitializedUrl) {
      const params = new URLSearchParams(window.location.search);
      const stepParam = params.get('step');
      if (stepParam) {
        const s = Number(stepParam);
        if (s >= 1 && s <= 4) {
          setCurrentStep(s);
          setHasInitializedUrl(true);
          window.history.replaceState({}, '', '/onboarding');
          return;
        }
      }
      setHasInitializedUrl(true);
    }
  }, [hasInitializedUrl]);

  useEffect(() => {
    if (!hasInitializedUrl) return;

    // Check if user is already logged in
    if (!loading && user && currentStep === 1) {
      handleNext(2);
    }
  }, [user, loading, currentStep, hasInitializedUrl]);

  useEffect(() => {
    if (!hasInitializedUrl) return;

    // Check local storage for connection state
    const connected = localStorage.getItem('whatsapp_connected') === 'true';
    // Only auto-forward if we are moving forwards (direction > 0)
    // This prevents the "Back" button from getting stuck
    if (connected && currentStep === 2 && direction > 0) {
      setIsConnected(true);
      handleNext(3);
    }
  }, [currentStep, direction, hasInitializedUrl]);

  const handleNext = (targetStep: number) => {
    setDirection(targetStep > currentStep ? 1 : -1);
    setCurrentStep(targetStep);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes('dummy')) {
      setTimeout(() => {
        handleNext(2);
        setAuthLoading(false);
      }, 800);
      return;
    }
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      handleNext(2);
    } catch (error) {
      console.error(error);
      alert('Authentication failed. Please check your credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes('dummy')) {
      handleNext(2);
      return;
    }
    try {
      await signInWithPopup(auth, googleProvider);
      handleNext(2);
    } catch (error) {
      console.error(error);
      alert('Google authentication failed.');
    }
  };

  const connectWhatsApp = () => {
    setIsConnecting(true);
    localStorage.setItem('whatsapp_connected', 'true');
    window.location.href = '/api/whatsapp/auth?redirect=/onboarding?step=3';
  };

  const verifyNumber = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      handleNext(4);
    }, 1500);
  };

  const finishOnboarding = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      router.push('/dashboard');
    }, 1200);
  };

  const slideVariants: any = {
    hidden: (direction: number) => ({
      x: direction > 0 ? 40 : -40,
      opacity: 0,
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -40 : 40,
      opacity: 0,
      transition: { duration: 0.2 }
    })
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-indigo-300/20 blur-[100px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[50%] rounded-full bg-sky-300/20 blur-[120px]" />
      </div>

      <div className="z-10 w-full max-w-xl mx-auto mb-8 relative">
        <div className="flex items-center justify-center font-display font-bold text-2xl text-slate-900 mb-10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-sky-400 flex items-center justify-center mr-3 shadow-md shadow-indigo-500/20">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          LeadPilot
        </div>

        {/* Progress Timeline */}
        <div className="flex items-center justify-between relative px-4">
          <div className="absolute left-8 right-8 top-1/2 h-0.5 bg-slate-200 -z-10 -translate-y-1/2"></div>
          <motion.div 
            className="absolute left-8 h-0.5 bg-indigo-600 -z-10 -translate-y-1/2 origin-left"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ width: "calc(100% - 4rem)" }}
          />

          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="flex flex-col items-center">
                <motion.div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm z-10 transition-colors duration-300 ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-indigo-200' 
                      : isCompleted
                        ? 'bg-emerald-500 text-white shadow-emerald-200'
                        : 'bg-white border-2 border-slate-200 text-slate-400'
                  }`}
                  animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                </motion.div>
                <div className="absolute mt-14 text-xs font-medium text-slate-500 hidden sm:block whitespace-nowrap">
                  {step.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl z-10 relative mt-4 sm:mt-10">
        <AnimatePresence mode="wait" custom={direction}>
          {currentStep === 1 && (
            <motion.div
               key="step1"
               custom={direction}
               variants={slideVariants}
               initial="hidden"
               animate="visible"
               exit="exit"
            >
              <Card className="border-white/80 bg-white/70 backdrop-blur-xl shadow-xl shadow-indigo-100">
                <CardHeader className="text-center space-y-2 pb-6">
                  <CardTitle className="text-2xl font-bold font-display">Create your account</CardTitle>
                  <CardDescription className="text-slate-500 font-medium">Get started with AI-automated WhatsApp out-reach in minutes.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <form onSubmit={handleAuth} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" required placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <Button type="submit" className="w-full font-bold h-11 text-base mt-2" disabled={authLoading || loading}>
                      {authLoading ? 'Setting up...' : (isLogin ? 'Sign In & Continue' : 'Create Account')}
                    </Button>
                  </form>
                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">Or</span>
                    <div className="flex-grow border-t border-slate-200"></div>
                  </div>
                  <Button onClick={handleGoogleAuth} variant="outline" type="button" className="w-full font-semibold h-11 bg-white/50 text-slate-700 hover:bg-white/90">
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                  </Button>
                  <p className="text-center text-sm text-slate-500 font-medium">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                    <button type="button" onClick={() => setIsLogin(!isLogin)} className="font-bold text-indigo-600 hover:text-indigo-700">
                      {isLogin ? 'Sign up' : 'Sign in'}
                    </button>
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
               key="step2"
               custom={direction}
               variants={slideVariants}
               initial="hidden"
               animate="visible"
               exit="exit"
            >
              <Card className="border-white/80 bg-white/70 backdrop-blur-xl shadow-xl shadow-indigo-100">
                <CardHeader className="text-center space-y-2 pb-2">
                  <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                     <MessageSquare className="w-8 h-8 text-emerald-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold font-display">Connect Meta Business</CardTitle>
                  <CardDescription className="text-slate-500 font-medium px-4">
                    Link your Meta Business Account to enable the WhatsApp Cloud API for LeadPilot.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6 text-center">
                   <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 text-left">
                     <p className="font-bold text-slate-900 mb-2">You will need:</p>
                     <ul className="list-disc pl-5 space-y-1">
                        <li>A valid Meta Business portfolio</li>
                        <li>A phone number not currently used on personal WhatsApp</li>
                        <li>Company legal details</li>
                     </ul>
                   </div>
                   <Button onClick={connectWhatsApp} disabled={isConnecting} className="w-full font-bold h-12 text-base bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20">
                      {isConnecting ? (
                        <> <RefreshCw className="w-5 h-5 mr-2 animate-spin" /> Connecting... </>
                      ) : (
                        <>
                          <LinkIcon className="w-5 h-5 mr-2" />
                          Connect via Facebook
                        </>
                      )}
                   </Button>
                   <div className="flex items-center justify-between w-full mt-2">
                     <button onClick={() => handleNext(1)} className="flex items-center text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
                       <ArrowLeft className="w-4 h-4 mr-1" /> Back
                     </button>
                     <button onClick={() => handleNext(3)} className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
                       Skip for now (Preview)
                     </button>
                   </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
               key="step3"
               custom={direction}
               variants={slideVariants}
               initial="hidden"
               animate="visible"
               exit="exit"
            >
              <Card className="border-white/80 bg-white/70 backdrop-blur-xl shadow-xl shadow-indigo-100">
                <CardHeader className="text-center space-y-2 pb-2">
                  <div className="mx-auto w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                     <Smartphone className="w-8 h-8 text-indigo-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold font-display">Verify Phone Number</CardTitle>
                  <CardDescription className="text-slate-500 font-medium px-4">
                    Send a test message to ensure the cloud integration is listening correctly.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                   <div className="space-y-2 text-left">
                      <Label>Test Phone Number</Label>
                      <Input 
                        placeholder="+1 555-0123" 
                        value={phoneNumber} 
                        onChange={(e) => setPhoneNumber(e.target.value)} 
                        className="bg-white"
                      />
                   </div>
                   <Button 
                      onClick={verifyNumber} 
                      disabled={isVerifying || !phoneNumber} 
                      className="w-full font-bold h-12 text-base"
                   >
                      {isVerifying ? (
                        <> <RefreshCw className="w-5 h-5 mr-2 animate-spin" /> Verifying Connection... </>
                      ) : (
                        'Verify Number'
                      )}
                   </Button>
                   <div className="flex justify-start w-full mt-2">
                     <button onClick={() => handleNext(2)} className="flex items-center text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
                       <ArrowLeft className="w-4 h-4 mr-1" /> Back
                     </button>
                   </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
               key="step4"
               custom={direction}
               variants={slideVariants}
               initial="hidden"
               animate="visible"
               exit="exit"
            >
              <Card className="border-white/80 bg-white/70 backdrop-blur-xl shadow-xl shadow-indigo-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-sky-500/5 pointer-events-none" />
                <CardHeader className="text-center space-y-2 pb-2">
                  <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 border border-slate-200">
                     <UploadCloud className="w-8 h-8 text-slate-700" />
                  </div>
                  <CardTitle className="text-2xl font-bold font-display">Import your first leads</CardTitle>
                  <CardDescription className="text-slate-500 font-medium px-4">
                    You're all set! Let's populate your dashboard by bringing in your contacts.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6 text-center">
                   <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors cursor-pointer flex flex-col items-center justify-center">
                     <UploadCloud className="w-8 h-8 text-indigo-400 mb-3" />
                     <p className="font-bold text-slate-700 mb-1">Click to upload CSV</p>
                     <p className="text-xs font-medium text-slate-500">Supports Hubspot & Salesforce exports</p>
                   </div>
                   <Button 
                      onClick={finishOnboarding} 
                      className="w-full font-bold h-12 text-base shadow-lg shadow-indigo-600/20 bg-indigo-600 hover:bg-indigo-700"
                   >
                      {isUploading ? (
                        <> <RefreshCw className="w-5 h-5 mr-2 animate-spin" /> Preparing Dashboard... </>
                      ) : (
                        <> Launch Dashboard <ArrowRight className="w-5 h-5 ml-2" /> </>
                      )}
                   </Button>
                   <div className="flex items-center justify-between w-full mt-2">
                     <button onClick={() => handleNext(3)} disabled={isUploading} className="flex items-center text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50">
                       <ArrowLeft className="w-4 h-4 mr-1" /> Back
                     </button>
                     <button onClick={finishOnboarding} disabled={isUploading} className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50">
                       Skip for now
                     </button>
                   </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
