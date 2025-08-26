// src/app/contact/page.tsx
'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LifeBuoy, Lightbulb, Mail } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
    return (
        <div className="bg-secondary/30">
            <div className="container text-center py-16 lg:py-24">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-headline">
                    Contact Us
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                    Have a question or a great idea? We'd love to hear from you.
                </p>
            </div>

            <div className="container pb-24 max-w-4xl mx-auto">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Send us a message</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" placeholder="John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" type="email" placeholder="john.doe@example.com" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="inquiry-type">Reason for Contact</Label>
                                <Select>
                                    <SelectTrigger id="inquiry-type">
                                        <SelectValue placeholder="Select a reason..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="support">
                                            <div className="flex items-center gap-2">
                                                <LifeBuoy className="w-4 h-4" />
                                                <span>General Support</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="feature">
                                             <div className="flex items-center gap-2">
                                                <Lightbulb className="w-4 h-4" />
                                                <span>Feature Request</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="other">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4" />
                                                <span>Other</span>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea id="message" placeholder="Tell us how we can help..." rows={5} />
                            </div>
                            <Button asChild size="lg">
                               <Link href="mailto:contact@shopiggo.com">Send Message</Link>
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
