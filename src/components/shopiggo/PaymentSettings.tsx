// src/components/shopiggo/PaymentSettings.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Banknote, PlusCircle } from "lucide-react";

// Mock data has been removed. The paymentMethods array is now empty.
const paymentMethods: any[] = [];

const VenmoIcon = () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.345 2.502c-2.454 2.13-4.908 4.26-7.362 6.392-1.227 1.065-2.454 2.13-3.681 3.194l-1.391-.973c-1.34-1.29-2.28-1.57-2.67-1.424C1.98 10.519.8 12.65.8 14.545c0 1.988 1.133 4.215 4.301 4.215 2.147 0 3.326-1.134 4.09-2.124.764-.99 1.133-1.636 1.637-2.909.503-1.273.872-2.124 1.34-2.818.468-.694 1.11-1.364 2.013-1.364.903 0 1.258.59 1.404 1.364.146.772.292 1.544.438 2.316.146.772.438 2.044 2.67 2.044 2.232 0 3.49-2.068 3.49-4.045 0-2.316-2.147-3.613-3.832-4.135z" />
    </svg>
)

export function PaymentSettings() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Payment Options</CardTitle>
                <CardDescription>Manage your saved payment methods for quick and easy checkout.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {paymentMethods.length > 0 ? (
                    <div className="space-y-4">
                        {paymentMethods.map((method, index) => (
                            <div key={index} className="flex items-center gap-4 rounded-lg border p-4">
                                {method.type === 'Credit Card' && <CreditCard className="w-6 h-6 text-muted-foreground" />}
                                {method.type === 'Bank Account' && <Banknote className="w-6 h-6 text-muted-foreground" />}
                                {method.type === 'Venmo' && <VenmoIcon />}
                                <div className="flex-grow">
                                    <p className="font-medium">{method.type}</p>
                                    <p className="text-sm text-muted-foreground">{method.details}</p>
                                </div>
                                {method.default && <span className="text-xs text-primary font-semibold">DEFAULT</span>}
                                <div className="flex gap-2">
                                    {!method.default && <Button variant="ghost" size="sm">Set as Default</Button>}
                                    <Button variant="ghost" size="sm" className="text-destructive">Remove</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                     <div className="text-center text-muted-foreground border-dashed border-2 rounded-lg p-8">
                        <p>You haven't added any payment methods yet.</p>
                    </div>
                )}
                 <Button variant="outline">
                    <PlusCircle className="mr-2"/>
                    Add New Payment Method
                </Button>
            </CardContent>
        </Card>
    )
}
