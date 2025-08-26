// src/components/shopiggo/AnalyticsDashboard.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

export function AnalyticsDashboard() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity />
                        Dashboard Analytics
                    </CardTitle>
                    <CardDescription>
                        Detailed analytics for your shopping activity will be available here soon.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                        <h3 className="text-lg font-semibold">Coming Soon!</h3>
                        <p>We're working hard to bring you insightful data about your spending, savings, and more.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
