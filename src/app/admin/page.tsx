// src/app/admin/page.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/hooks/use-user";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldAlert } from "lucide-react";


export default function AdminPage() {
    const { user, isLoaded } = useUser();
    const isAdmin = user?.email === 'dev@shopiggo.com';

    if (!isLoaded) {
        return (
             <div className="container py-12">
                <div className="max-w-3xl mx-auto">
                    <Skeleton className="h-10 w-1/2 mb-2" />
                    <Skeleton className="h-6 w-3/4 mb-8" />
                    <div className="space-y-6">
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-48 w-full" />
                    </div>
                </div>
            </div>
        )
    }

    if (!isAdmin) {
        return (
            <div className="container py-24 text-center">
                 <div className="max-w-md mx-auto bg-card p-8 rounded-lg shadow-lg">
                    <ShieldAlert className="h-16 w-16 mx-auto text-destructive" />
                    <h2 className="mt-6 text-2xl font-bold font-headline">Access Denied</h2>
                    <p className="mt-2 text-muted-foreground">
                        You do not have permission to view this page.
                    </p>
                    <Link href="/">
                        <Button variant="outline" className="mt-6">Go to Homepage</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="container py-12">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-2 font-headline">Admin Dashboard</h1>
                <p className="text-muted-foreground mb-8">
                    Manually trigger data synchronization and management tasks.
                </p>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Synchronization</CardTitle>
                            <CardDescription>
                                Backend data synchronization will be managed via Cloud Run.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </div>
        </div>
    );
}
