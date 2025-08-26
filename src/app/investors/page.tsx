// src/app/investors/page.tsx

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Handshake, Layers, Mail, Package } from "lucide-react";
import Link from "next/link";

export default function InvestorsPage() {
    return (
        <div className="bg-background">
            <div className="container text-center py-16 lg:py-24">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-headline">
                    Investor Relations
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                    Join us in revolutionizing the future of online retail.
                </p>
            </div>

            <div className="pb-24">
                <div className="container max-w-4xl mx-auto">
                    <Card className="shadow-lg mb-12">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <Handshake className="w-8 h-8 text-primary" />
                                <span>Open to Investment</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground leading-relaxed space-y-4">
                            <p>Shopiggo is currently in a fundraising phase and we are actively seeking strategic investors and partners to accelerate our growth and expand our platform's capabilities. We are open to various investment vehicles to suit different investor profiles and objectives.</p>
                        </CardContent>
                    </Card>
                    
                    <h2 className="text-3xl font-bold text-center mb-8 font-headline">Investment Vehicles</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Package className="w-6 h-6 text-accent"/>
                                    Common Shares
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                Directly invest in the equity of Shopiggo and become a shareholder in our company's future success.
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Layers className="w-6 h-6 text-accent"/>
                                    SAFE Agreements
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                A Simple Agreement for Future Equity (SAFE) offers a flexible and streamlined way to invest in our early-stage growth.
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Handshake className="w-6 h-6 text-accent"/>
                                    Other Structures
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                We are open to discussing other investment structures that align with our long-term vision and your financial goals.
                            </CardContent>
                        </Card>
                    </div>

                    <div className="text-center mt-16">
                        <p className="text-lg text-muted-foreground mb-4">Interested in learning more?</p>
                        <Button asChild size="lg">
                            <Link href="mailto:investor@shopiggo.com">
                                <Mail className="mr-2" /> Contact Our Team
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
