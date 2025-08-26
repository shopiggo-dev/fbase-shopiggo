
// src/components/shopiggo/SyncLinksCard.tsx
'use client'

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { syncCjLinks } from "@/ai/flows/sync-cj-links";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Link as LinkIcon } from 'lucide-react';

export function SyncLinksCard() {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSync = async () => {
        setIsLoading(true);
        try {
            // const result = await syncCjLinks();
            // if (result.success) {
            //     toast({
            //         title: "Link Sync Successful",
            //         description: `${result.linksSynced} links have been synced from ${result.advertisersChecked} advertisers.`,
            //     });
            // } else {
            //     throw new Error(result.message);
            // }
            console.log("Link sync is currently disabled from the UI.");
        } catch (error: any) {
            console.error("Link sync failed:", error);
            toast({
                title: "Link Sync Failed",
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
                <CardTitle>Promotional Link Sync</CardTitle>
                <CardDescription>
                    Pull all available promotional links from your joined CJ advertisers into the 'cj-links' Firestore collection.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handleSync} disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Syncing Links...
                        </>
                    ) : (
                        <>
                            <LinkIcon className="mr-2 h-4 w-4" />
                            Sync Links from CJ
                        </>
                    )}
                </Button>
                 {isLoading && (
                    <p className="text-sm text-muted-foreground mt-2">
                        This may take a few minutes depending on the number of advertisers and links...
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
