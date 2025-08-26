
// src/components/shopiggo/SyncRetailersCard.tsx
'use client'

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { syncRetailers } from "@/ai/flows/sync-retailers";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw } from 'lucide-react';

export function SyncRetailersCard() {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSync = async () => {
        setIsLoading(true);
        try {
            // const result = await syncRetailers();
            // if (result.success) {
            //     toast({
            //         title: "Sync Successful",
            //         description: `${result.retailersSynced} retailers have been synced to Firestore.`,
            //     });
            // } else {
            //     throw new Error(result.message);
            // }
            console.log("Retailer sync is currently disabled from the UI.");
        } catch (error: any) {
            console.error("Retailer sync failed:", error);
            toast({
                title: "Sync Failed",
                description: error.message || "An unknown error occurred during the sync.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Retailer Data Sync</CardTitle>
                <CardDescription>
                    Pull the latest advertiser data from the CJ API directly into your Firestore database. This should be done periodically to keep retailer information up-to-date.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handleSync} disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Syncing...
                        </>
                    ) : (
                        <>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Sync Retailers from CJ
                        </>
                    )}
                </Button>
                 {isLoading && (
                    <p className="text-sm text-muted-foreground mt-2">
                        This may take a minute or two depending on the number of advertisers...
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
