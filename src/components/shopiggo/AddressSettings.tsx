// src/components/shopiggo/AddressSettings.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

// Mock data has been removed. The addresses array is now empty.
const addresses: any[] = [];

export function AddressSettings() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Delivery Addresses</CardTitle>
                <CardDescription>Manage where your orders will be shipped.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 {addresses.length > 0 ? (
                    <div className="space-y-4">
                        {addresses.map((addr, index) => (
                            <div key={index} className="flex items-center gap-4 rounded-lg border p-4">
                                <div className="flex-grow">
                                    <p className="font-medium">{addr.name}</p>
                                    <p className="text-sm text-muted-foreground">{addr.address}</p>
                                </div>
                                {addr.default && <span className="text-xs text-primary font-semibold">DEFAULT</span>}
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm">Edit</Button>
                                    <Button variant="ghost" size="sm" className="text-destructive">Remove</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                 ) : (
                    <div className="text-center text-muted-foreground border-dashed border-2 rounded-lg p-8">
                        <p>You haven't added any delivery addresses yet.</p>
                    </div>
                 )}
                 <Button variant="outline">
                    <PlusCircle className="mr-2"/>
                    Add New Address
                </Button>
            </CardContent>
        </Card>
    )
}
