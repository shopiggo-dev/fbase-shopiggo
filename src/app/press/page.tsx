// src/app/press/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Linkedin, Newspaper } from "lucide-react";
import Link from "next/link";

export default function PressPage() {
    return (
        <div className="bg-secondary/30">
            <div className="container text-center py-16 lg:py-24">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-headline">
                    Press & Media
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                    Information and resources for journalists, bloggers, and media professionals.
                </p>
            </div>

            <div className="container pb-24 max-w-4xl mx-auto grid gap-12">
                 <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                           <Newspaper className="w-8 h-8 text-primary" />
                           <span>About Shopiggo</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground leading-relaxed space-y-4">
                        <p>Shopiggo is simplifying online shopping by unifying access to the world’s leading retailers in a single smart store. Our AI-powered platform empowers consumers to save time and money with one-click checkout, consolidated rewards through GoCoins, and a seamless shopping experience.</p>
                        <p>Our mission is to bridge the gap between shoppers and retailers with a single payment platform and intelligent rewards, creating a future where convenience, choice, and efficiency define every shopping journey.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Resources</CardTitle>
                        <CardDescription>Download our official press kit for logos, brand guidelines, and more.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline">
                            <Download className="mr-2" /> Download Press Kit
                        </Button>
                    </CardContent>
                </Card>
                
                <div className="text-center">
                    <h2 className="text-3xl font-bold font-headline">Stay Connected</h2>
                    <p className="mt-2 text-muted-foreground">
                        Follow us on LinkedIn for the latest company updates, news, and insights.
                    </p>
                    <div className="mt-6">
                        <Button asChild size="lg">
                            <Link href="https://www.linkedin.com/company/shopiggo/" target="_blank" rel="noopener noreferrer">
                                <Linkedin className="mr-2" /> Follow us on LinkedIn
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
