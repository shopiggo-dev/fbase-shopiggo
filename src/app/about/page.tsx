// src/app/about/page.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { Briefcase, Building, Target, Eye } from "lucide-react";

export default function AboutPage() {
    const { t } = useTranslation('about');

    if (!t) {
        return <div>Loading...</div>; // Or a skeleton loader
    }
    
    return (
        <div className="bg-secondary/30">
            <div className="container text-center py-16 lg:py-24">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-headline">
                    {t('title')}
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                    {t('subtitle')}
                </p>
            </div>

            <div className="pb-24">
                <div className="container grid md:grid-cols-2 gap-12">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <Target className="w-8 h-8 text-primary" />
                                <span>{t('mission.title')}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground leading-relaxed">
                            <p>{t('mission.content')}</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <Eye className="w-8 h-8 text-primary" />
                                <span>{t('vision.title')}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground leading-relaxed">
                             <p>{t('vision.content')}</p>
                        </CardContent>
                    </Card>
                </div>
                 <div className="container mt-12">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <Briefcase className="w-8 h-8 text-primary" />
                                <span>{t('details.title')}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid sm:grid-cols-2 gap-4 text-muted-foreground">
                            <div className="flex items-center gap-3">
                                <Building className="w-5 h-5"/>
                                <span>{t('details.location')}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Building className="w-5 h-5"/>
                                <span>{t('details.incorporation')}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
