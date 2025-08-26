// src/components/shopiggo/SecuritySettings.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { useState } from "react";
import { useUser } from "@/hooks/use-user";
import { Loader2, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


function AccountDeletionDialogContent() {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const { userTier, handleTierChange, deleteAccount } = useUser();
    const { toast } = useToast();

    const handleDowngrade = async () => {
        setIsLoading(true);
        try {
             await handleTierChange('Free');
             toast({
                title: "Membership Downgraded",
                description: "Your plan has been changed to our Free tier.",
            });
        } catch (error) {
             toast({
                title: "Error",
                description: "There was an error downgrading your plan.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        setIsLoading(true);
        try {
            await deleteAccount();
        } catch (error: any) {
            toast({
                title: "Error",
                description: "There was a problem deleting your account. Please try again or contact support.",
                variant: "destructive"
            });
            setIsLoading(false);
        }
    }

    return (
        <DialogContent onEscapeKeyDown={() => setStep(1)} onInteractOutside={(e) => e.preventDefault()}>
            {step === 1 && (
                <>
                    <DialogHeader>
                        <DialogTitle>Are you sure you want to close your account?</DialogTitle>
                        <DialogDescription>
                            Instead of closing your account, you can downgrade to our Free plan. You'll keep your order history and GoCoins balance, but lose access to premium features.
                        </DialogDescription>
                    </DialogHeader>
                     <div className="pt-2 grid sm:grid-cols-2 gap-2">
                        {userTier !== 'Free' && (
                            <Button
                                onClick={handleDowngrade}
                                disabled={isLoading}
                                variant="destructive"
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : "Downgrade to Free"}
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            onClick={() => setStep(2)}
                            className="w-full"
                        >
                            No, Close My Account
                        </Button>
                    </div>
                </>
            )}
            {step === 2 && (
                <>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2"><ShieldAlert className="text-destructive"/>Final Confirmation</DialogTitle>
                        <DialogDescription>
                            This action is permanent and cannot be undone. All your data, including order history, preferences, and GoCoins will be permanently deleted.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="pt-2 grid sm:grid-cols-2 gap-2">
                         <Button
                            onClick={() => setStep(1)}
                        >
                            Go Back
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleDeleteAccount}
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : "Yes, Permanently Delete"}
                        </Button>
                    </div>
                </>
            )}
        </DialogContent>
    );
}


export function SecuritySettings() {
    const { userTier } = useUser();

    return (
        <>
        <Card>
            <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage your password and account security settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <form className="space-y-6">
                    <h3 className="font-semibold text-lg border-b pb-2">Change Password</h3>
                    <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                    </div>
                    <Button>Update Password</Button>
                </form>

                <Separator />

                <div className="space-y-6">
                    <h3 className="font-semibold text-lg border-b pb-2">Multi-Factor Authentication (MFA)</h3>
                    <div className="flex items-start justify-between rounded-lg border p-4">
                        <div className="space-y-1">
                            <Label htmlFor="mfa" className="text-base">Enable MFA</Label>
                            <p className="text-muted-foreground text-sm">
                                Secure your account with an additional layer of protection via SMS.
                            </p>
                        </div>
                        <Switch id="mfa" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                       Once enabled, you will be required to enter a code sent to your phone number when you sign in.
                    </p>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline">Configure Phone Number</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Set Up SMS Authentication</DialogTitle>
                                <DialogDescription>
                                    Enter your phone number to receive a verification code.
                                </DialogDescription>
                            </DialogHeader>
                            {/* This would contain the form to set up MFA */}
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>

        <Card className="mt-8 border-destructive">
            <CardHeader>
                <CardTitle>Danger Zone</CardTitle>
                 <CardDescription>These actions are permanent and cannot be undone.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-2">
                 <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="destructive">Downgrade to Free</Button>
                    </DialogTrigger>
                    <AccountDeletionDialogContent />
                </Dialog>
                 <Dialog>
                    <DialogTrigger asChild>
                         <Button variant="outline">Close Account</Button>
                    </DialogTrigger>
                   <AccountDeletionDialogContent />
                </Dialog>
            </CardContent>
        </Card>
        </>
    )
}
