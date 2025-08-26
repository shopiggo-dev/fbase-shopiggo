
// src/components/shopiggo/DeleteRetailersCard.tsx
'use client'

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
// import { deleteAllRetailers } from "@/ai/flows/delete-all-retailers";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2 } from 'lucide-react';

export function DeleteRetailersCard() {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            // const result = await deleteAllRetailers();
            // if (result.success) {
            //     toast({
            //         title: "Deletion Successful",
            //         description: `${result.deletedCount} retailers have been deleted from Firestore.`,
            //     });
            // } else {
            //     throw new Error(result.message);
            // }
            console.log("Deletion of retailers is currently disabled from the UI.");
        } catch (error: any) {
            console.error("Retailer deletion failed:", error);
            toast({
                title: "Deletion Failed",
                description: error.message || "An unknown error occurred during the deletion.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="border-destructive">
            <CardHeader>
                <CardTitle>Delete All Retailers</CardTitle>
                <CardDescription>
                    This is a destructive action. It will permanently remove all retailer documents from your Firestore database. Use this to clear out old or duplicate data before running a fresh sync.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                         <Button variant="destructive" disabled={isLoading}>
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Trash2 className="mr-2 h-4 w-4" />
                            )}
                            Delete All Retailer Data
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete all documents from the 'retailers' collection in your Firestore database.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Yes, delete all
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
    )
}
