// src/app/signup/payment/page.tsx
'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Banknote, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function OnboardingPaymentPage() {
    const router = useRouter();

    return (
        <div className="container py-12">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight font-headline">
                        Add a Payment Method
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Your chosen plan requires a payment method.
                    </p>
                </div>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <CreditCard />
                            Credit or Debit Card
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                         <form className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="card-number">Card Number</Label>
                                <Input id="card-number" placeholder="•••• •••• •••• ••••" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                 <div className="space-y-2">
                                    <Label htmlFor="expiry">Expires</Label>
                                    <Input id="expiry" placeholder="MM / YY" />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="cvc">CVC</Label>
                                    <Input id="cvc" placeholder="•••" />
                                </div>
                            </div>
                            <Button className="w-full" onClick={() => router.push('/search')}>
                                Save Card and Finish <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </form>
                    </CardContent>
                </Card>
                 <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or
                        </span>
                    </div>
                </div>
                 <Button variant="outline">
                    <Banknote className="mr-2" /> Connect Bank Account
                </Button>
                <div className="flex justify-between items-center mt-8">
                     <Button variant="outline" onClick={() => router.push('/signup/membership')}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Link href="/search" className="text-sm text-muted-foreground hover:text-primary underline">
                        Skip for now
                    </Link>
                </div>
            </div>
        </div>
    )
}
