// src/components/shopiggo/ShoppingPreferences.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { retailers, categories } from "@/lib/data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export function ShoppingPreferences() {
    // In a real app, these would come from user data
    const favoriteStores = ['Target', 'Amazon', 'Nike', 'Sephora'];
    const favoriteCategories = ['Electronics', 'Fashion', 'Beauty'];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Shopping Preferences</CardTitle>
                <CardDescription>Help Pixi AI provide better recommendations by telling us what you love.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div>
                    <h3 className="font-semibold text-lg border-b pb-2 mb-4">Favorite Categories</h3>
                     <div className="space-y-3">
                        {categories.map(category => (
                            <div key={category} className="flex items-center space-x-3">
                                <Checkbox
                                    id={`category-${category}`}
                                    checked={favoriteCategories.includes(category)}
                                />
                                <Label htmlFor={`category-${category}`} className="font-normal cursor-pointer text-sm">{category}</Label>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold text-lg border-b pb-2 mb-4">Favorite Stores</h3>
                    <ScrollArea className="h-64 border rounded-md p-4">
                        <div className="space-y-3">
                             {retailers.map(store => (
                                <div key={store} className="flex items-center space-x-3">
                                    <Checkbox
                                        id={`store-${store}`}
                                        checked={favoriteStores.includes(store)}
                                    />
                                    <Label htmlFor={`store-${store}`} className="font-normal cursor-pointer text-sm">{store}</Label>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
                <Button>Save Preferences</Button>
            </CardContent>
        </Card>
    )
}
