// src/components/shopiggo/ProfileSettings.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/use-user";
import { Skeleton } from "../ui/skeleton";

export function ProfileSettings() {
    const { user, userTier, isLoaded } = useUser();

    if (!isLoaded || !user) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Update your profile information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-20 w-20 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-5 w-24" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const userInitial = user.name?.charAt(0).toUpperCase() || 'U';

    return (
        <Card>
            <CardHeader>
                <div>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Update your profile information.</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={`https://placehold.co/200x200?text=${userInitial}`} alt="User Avatar" />
                        <AvatarFallback>{userInitial}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="text-xl font-semibold">{user.name}</h3>
                        <p className="text-muted-foreground">{user.email}</p>
                        <Badge className="mt-2" variant="destructive">{userTier} Member</Badge>
                    </div>
                </div>
                
                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" defaultValue={user.name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" defaultValue={user.email || ''} disabled />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <textarea id="bio" className="w-full rounded-md border border-input bg-background p-2 text-sm" rows={3} defaultValue="Enthusiastic shopper and deal hunter. Pixi AI is my best friend!"></textarea>
                    </div>
                    <Button>Update Profile</Button>
                </form>
            </CardContent>
        </Card>
    )
}
