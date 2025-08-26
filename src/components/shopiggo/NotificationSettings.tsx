// src/components/shopiggo/NotificationSettings.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function NotificationSettings() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Manage how you receive notifications from Shopiggo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="price-alerts" className="text-base">Price Drop Alerts</Label>
                            <p className="text-muted-foreground text-sm">
                                Get notified when items in your cart or wishlist drop in price.
                            </p>
                        </div>
                        <Switch id="price-alerts" defaultChecked/>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                         <div className="space-y-0.5">
                            <Label htmlFor="weekly-deals" className="text-base">Weekly Deals Digest</Label>
                             <p className="text-muted-foreground text-sm">
                               Receive a weekly email with the best deals from your favorite stores.
                            </p>
                        </div>
                        <Switch id="weekly-deals" />
                    </div>
                     <div className="flex items-center justify-between rounded-lg border p-4">
                         <div className="space-y-0.5">
                            <Label htmlFor="shipping-updates" className="text-base">Shipping Updates</Label>
                             <p className="text-muted-foreground text-sm">
                               Receive updates on your order status and tracking information.
                            </p>
                        </div>
                        <Switch id="shipping-updates" defaultChecked />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="frequency">Notification Frequency</Label>
                    <Select defaultValue="instant">
                        <SelectTrigger id="frequency" className="w-[200px]">
                            <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="instant">Instantly</SelectItem>
                            <SelectItem value="daily">Daily Digest</SelectItem>
                            <SelectItem value="weekly">Weekly Digest</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                
                <Button>Save Preferences</Button>
            </CardContent>
        </Card>
    )
}
