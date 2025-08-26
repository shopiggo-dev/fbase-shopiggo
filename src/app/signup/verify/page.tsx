
// src/app/signup/verify/page.tsx
'use client'

import { useState, useEffect, Suspense } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from 'next/link';
import { AuthLogo } from '@/components/shopiggo/Logo';
import { verifyEmailCodeAction, sendVerificationCodeAction } from '@/app/actions';

function VerifyPageComponent() {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const email = searchParams.get('email');

    useEffect(() => {
        if (!email) {
             toast({
                title: "Error",
                description: "Could not find your email. Please try signing up again.",
                variant: "destructive"
            });
            router.push('/signup');
        }
    }, [email, router, toast]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code || code.length !== 6 || !email) {
            toast({
                title: "Invalid Code",
                description: "Please enter a 6-digit verification code.",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);
        
        try {
            const result = await verifyEmailCodeAction(email, code);

            if (result.success) {
                toast({
                    title: "Account Created!",
                    description: "Your email has been verified. Please log in to continue.",
                    duration: 5000,
                });
                router.push('/login'); 
            } else {
                 toast({
                    title: "Verification Failed",
                    description: result.error || "An unknown error occurred. Please try again.",
                    variant: "destructive"
                });
            }
        } catch (error: any) {
             toast({
                title: "Verification Failed",
                description: error.message || "An unknown error occurred. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (!email) return;

        setIsResending(true);

        try {
            // A dummy password and name are sent here as the backend expects them for now, but they are not used.
            const result = await sendVerificationCodeAction(email, 'User', 'dummy-password');

            if (result.success) {
                 toast({
                    title: "Code Resent",
                    description: "A new verification code has been sent to your email.",
                });
            } else {
                 toast({
                    title: "Error",
                    description: result.error || "Could not resend verification code.",
                    variant: "destructive"
                });
            }
        } catch (error: any) {
             toast({
                title: "Error",
                description: error.message || "Could not resend verification code.",
                variant: "destructive"
            });
        }
        setIsResending(false);
    }

    return (
        <div className="container relative min-h-screen flex-col items-center justify-center grid">
             <div className="absolute left-4 top-4 md:left-8 md:top-8">
                <Link href="/">
                    <AuthLogo />
                </Link>
            </div>
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px]">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-semibold tracking-tight font-headline">Check your email</CardTitle>
                        <CardDescription>We've sent a 6-digit verification code to <span className="font-medium text-foreground">{email}</span>.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="verification-code">Verification Code</Label>
                                    <Input
                                        id="verification-code"
                                        placeholder="_ _ _ _ _ _"
                                        type="text"
                                        maxLength={6}
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                        disabled={isLoading}
                                        className="text-center text-lg tracking-[0.5em]"
                                    />
                                </div>
                                <Button disabled={isLoading || code.length !== 6}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Verify Account
                                </Button>
                            </div>
                        </form>
                        <div className="mt-4 text-center text-sm">
                            <p className="text-muted-foreground">Didn't receive the code?</p>
                             <Button
                                variant="link"
                                className="p-0"
                                onClick={handleResendCode}
                                disabled={isResending}
                            >
                                {isResending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Resend Code
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyPageComponent />
        </Suspense>
    )
}
