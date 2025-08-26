
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Phone, ShieldCheck, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { auth } from "@/lib/firebase"
import { signInWithEmailAndPassword, GoogleAuthProvider, OAuthProvider, signInWithPopup, getAdditionalUserInfo, updateProfile, sendPasswordResetEmail, type User as FirebaseUser, RecaptchaVerifier, PhoneAuthProvider, multiFactor, PhoneMultiFactorGenerator, type AuthError, setPersistence, browserLocalPersistence, signInWithRedirect } from "firebase/auth"
import { useUser } from "@/hooks/use-user"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { sendVerificationCodeAction } from "@/app/actions"
import { v4 as uuidv4 } from 'uuid';


interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
    isSignUp?: boolean
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" {...props}>
            <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 111.8 512 0 400.2 0 261.8 0 123.8 111.8 14.2 244 14.2c67.9 0 124.9 26.9 168.9 67.9L372.5 142c-43.3-41.2-96.9-66.2-128.5-66.2C167.3 75.8 98.7 141.5 98.7 225.2c0 83.7 68.6 149.4 145.3 149.4 79.2 0 114.5-58.4 118.9-89.4H244V261.8h244z"></path>
        </svg>
    )
}

function AppleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="apple" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" {...props}>
            <path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C39.2 141.1 0 183.2 0 241.2c0 61.6 31.5 117.4 58.8 152.4 14.9 19.3 32.8 39.2 55.8 39.2 25.2 0 43.3-17.7 75.8-17.7 31.8 0 48.3 17.7 75.8 17.7 21.2 0 38.2-17.2 53.7-35.4 16.5-19.8 25.2-40.3 25.2-61.4zM190.7 109.1c12.7-16.3 29.3-31.8 48.5-41.7-16.3-16.5-35.2-29.1-55.8-35.4-20.5-6.3-42.8-5.3-63.6 2.8-21.5 8.5-40.2 22.1-55.8 38.6-12.3 13.3-24.2 29.2-34.8 45.9-2.8-2.6-5.7-5.2-8.5-7.8-1.4-1.3-2.8-2.6-4.2-3.9-3.4-3.2-6.8-6.4-10.2-9.6-3.4-3.2-6.8-6.4-10.2-9.6-3.4-3.2-6.8-6.4-10.2-9.6-3.4-3.2-6.8-6.4-10.2-9.6-3.4-3.2-6.8-6.4-10.2-9.6C190.7 109.1 190.7 109.1 190.7 109.1z"></path>
        </svg>
    )
}

export function UserAuthForm({ className, isSignUp = false, ...props }: UserAuthFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false);
    const [isAppleLoading, setIsAppleLoading] = React.useState<boolean>(false);
    
    // Form States
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [fullName, setFullName] = React.useState('');

    // Flow states
    const [verificationCode, setVerificationCode] = React.useState('');
    const [showMfaPrompt, setShowMfaPrompt] = React.useState(false);
    const [mfaResolver, setMfaResolver] = React.useState<any>(null);


    const { toast } = useToast();
    const { handleAuthSuccess } = useUser();
    const router = useRouter();

    const handleAuthError = (error: any) => {
        let message = "An unexpected error occurred. Please try again.";
        const errorCode = error.code;

        switch (errorCode) {
            case 'auth/unauthorized-domain':
                message = "This domain is not authorized for authentication. Please contact support or add it to your Firebase project's allow list.";
                break;
            case 'auth/invalid-credential':
            case 'auth/wrong-password':
            case 'auth/user-not-found':
                message = "Invalid credentials. Please check your email and password.";
                break;
            case 'auth/email-already-in-use':
                 message = "An account with this email already exists. Please go to the login page.";
                break;
            case 'auth/weak-password':
                message = "The password is too weak. Please choose a stronger password.";
                break;
            case 'auth/popup-closed-by-user':
                message = "The sign-in window was closed before completing.";
                break;
            case 'auth/cancelled-popup-request':
                message = "Sign-in was cancelled. Please try again."
                break;
            case 'auth/operation-not-allowed':
                 message = "Sign-in with this provider is not enabled. Please contact support.";
                 break;
            case 'auth/missing-phone-number':
                message = "Phone number is required for this sign-in method.";
                break;
            case 'auth/multi-factor-auth-required':
                setMfaResolver((error as any).resolver);
                setShowMfaPrompt(true);
                return;
            default:
                message = error.message || "An internal error occurred. Please try again later.";
                console.error("Auth Error:", error);
                break;
        }

        toast({
            title: isSignUp ? "Sign Up Not Completed" : "Sign In Error",
            description: message,
            variant: "destructive"
        });
    };

    const handlePasswordReset = async () => {
        if (!email) {
            toast({
                title: "Email required",
                description: "Please enter your email address to reset your password.",
                variant: "destructive"
            });
            return;
        }
        
        setIsLoading(true);
        try {
            if (!auth || !auth.app) throw new Error("Auth service is not available.");
            await sendPasswordResetEmail(auth, email);
            toast({
                title: "Password Reset Email Sent",
                description: "Check your inbox for a link to reset your password."
            });
        } catch (error: any) {
            handleAuthError(error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleAuthAction(event: React.SyntheticEvent) {
        event.preventDefault();
        setIsLoading(true);

        try {
            if (isSignUp) {
                await handleSignUp();
            } else {
                await handleSignIn();
            }
        } catch (error: any) {
            handleAuthError(error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSignUp() {
        if (!fullName || !email || !password) {
            toast({ title: "Error", description: "Please fill in all fields.", variant: "destructive" });
            return;
        }
        
        try {
            const temporaryUserId = uuidv4();

            const formData = new FormData();
            formData.append('userId', temporaryUserId);
            formData.append('email', email);
            formData.append('fullName', fullName);
            formData.append('password', password);

            const result = await sendVerificationCodeAction(formData);

            if (result.success) {
                toast({
                    title: "Verification Required",
                    description: "A verification code has been sent to your email.",
                });
                router.push(`/signup/verify?userId=${temporaryUserId}&email=${encodeURIComponent(email)}&fullName=${encodeURIComponent(fullName)}`);
            } else {
                toast({ title: "Error", description: result.error || 'Failed to send verification code.', variant: "destructive" });
            }
        } catch (error: any) {
             toast({ title: "Sign Up Error", description: error.message || "An unknown error occurred.", variant: "destructive" });
        }
    }

    async function handleSignIn() {
        if (!email || !password) {
            toast({ title: "Error", description: "Please enter email and password.", variant: "destructive" });
            return;
        }
        try {
            if (!auth || !auth.app) throw new Error("Auth service is not available.");
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            
            await handleAuthSuccess(userCredential.user);

        } catch (error: any) {
            handleAuthError(error as AuthError);
        }
    }

    async function handleGoogleSignIn() {
        setIsGoogleLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            if (!auth || !auth.app) throw new Error("Auth service is not available.");
            await setPersistence(auth, browserLocalPersistence);
            const result = await signInWithPopup(auth, provider);
            const userInfo = getAdditionalUserInfo(result);
            await handleAuthSuccess(result.user, userInfo?.isNewUser);
        } catch (error: any) {
             if (error instanceof Error && (error as AuthError).code === 'auth/unauthorized-domain') {
                 toast({
                    title: "Configuration Error",
                    description: "This domain is not authorized for authentication. Please add it to your Firebase project's allow list in the Firebase Console under Authentication > Settings > Authorized domains.",
                    variant: "destructive",
                    duration: 10000,
                });
            } else {
                handleAuthError(error as AuthError);
            }
        } finally {
            setIsGoogleLoading(false);
        }
    }

    async function handleAppleSignIn() {
        setIsAppleLoading(true);
        const provider = new OAuthProvider('apple.com');
        provider.addScope('email');
        provider.addScope('name');
    
        try {
            if (!auth) throw new Error("Auth service is not available.");
            await signInWithRedirect(auth, provider);
        } catch (error: any)
{
            handleAuthError(error as AuthError);
        } finally {
            setIsAppleLoading(false);
        }
    }
    
    const handlePhoneSignIn = () => {
        toast({
            title: "Coming Soon!",
            description: "Phone sign-in is currently under development. Please use another method.",
        });
    }

    const handleMfaSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (!mfaResolver) {
                throw new Error("MFA resolver not found. Please try signing in again.");
            }
            
            // Re-authentication with reCAPTCHA is not implemented here for MFA
            // but would be required in a production scenario.
             const cred = PhoneMultiFactorGenerator.assertion(mfaResolver.hints[0].verificationId, verificationCode);
            const userCredential = await mfaResolver.resolveSignIn(cred);

            toast({ title: "Success!", description: "You have been signed in." });
            await handleAuthSuccess(userCredential.user);

        } catch (error: any) {
            handleAuthError(error as AuthError);
        } finally {
            setIsLoading(false);
        }
    }

    if (showMfaPrompt) {
        return (
             <div className="grid gap-6">
                 <div className="flex flex-col space-y-2 text-center">
                    <ShieldCheck className="mx-auto h-12 w-12 text-primary" />
                    <h1 className="text-2xl font-semibold tracking-tight font-headline">
                        Two-Factor Authentication
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        A verification code has been sent to your phone. Please enter it below.
                    </p>
                </div>
                <form onSubmit={handleMfaSignIn}>
                    <div className="grid gap-2">
                        <Label htmlFor="mfa-code">Verification Code</Label>
                        <Input
                            id="mfa-code"
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <Button disabled={isLoading} className="mt-4 w-full">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Verify & Sign In
                    </Button>
                </form>
             </div>
        )
    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <form onSubmit={handleAuthAction}>
                <div className="grid gap-4">
                    {isSignUp && (
                        <div className="grid gap-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                name="fullName"
                                placeholder="Sofia Davis"
                                type="text"
                                disabled={isLoading}
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>
                    )}
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            placeholder="name@example.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                         <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            {!isSignUp && (
                                 <button
                                    type="button"
                                    onClick={handlePasswordReset}
                                    className="text-sm font-medium text-primary hover:underline underline-offset-4"
                                >
                                    Forgot password?
                                </button>
                            )}
                        </div>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            disabled={isLoading}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                         {isSignUp && (
                            <p className="text-xs text-muted-foreground">
                                Suggested: one uppercase, one lowercase, one number, and 8-24 characters.
                            </p>
                        )}
                    </div>
                    <Button disabled={isLoading} className="w-full focus-visible:ring-ring">
                        {isLoading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {isSignUp ? "Create account" : "Sign In"}
                    </Button>
                </div>
            </form>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>
            <div className="grid gap-2">
                <Button variant="outline" type="button" disabled={isLoading || isGoogleLoading} onClick={handleGoogleSignIn}>
                    {isGoogleLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <GoogleIcon />
                    )}{" "}
                    Google
                </Button>
                <Button variant="outline" type="button" disabled={true}>
                    <AppleIcon /> Apple
                </Button>
                 <Button variant="outline" type="button" disabled={true}>
                    <Phone className="mr-2 h-4 w-4" /> Phone
                </Button>
            </div>
        </div>
    )
}
