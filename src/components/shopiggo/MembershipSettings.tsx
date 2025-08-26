// src/components/shopiggo/MembershipSettings.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { MembershipDropdown } from "./MembershipDropdown";
import { useUser } from "@/hooks/use-user";
import { Label } from "@/components/ui/label";

export function MembershipSettings() {
    const { userTier } = useUser();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Membership</CardTitle>
                <CardDescription>View your current plan and explore other options.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold text-lg">Your Current Plan</h3>
                    <div className="flex items-center gap-4 mt-2 rounded-lg border p-4 bg-primary/5">
                        <div className="flex-grow">
                            <h4 className="text-xl font-bold">{userTier} Member</h4>
                            <p className="text-muted-foreground">Manage your subscription and billing details.</p>
                        </div>
                        <Badge variant="destructive" className="text-lg">{userTier}</Badge>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Manage Your Plan</Label>
                    <MembershipDropdown />
                </div>

                 <p className="text-xs text-muted-foreground">
                    Upgrades take effect immediately. Downgrades are effective at the end of the current billing cycle.
                </p>
            </CardContent>
            <CardFooter>
                 <Link href="/membership">
                    <Button variant="link" className="p-0">
                        Compare all membership plans
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}
