// src/app/careers/page.tsx

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Briefcase, Users, Code, Megaphone, PenTool, Handshake, MapPin, Globe } from "lucide-react";
import Link from "next/link";

const jobOpenings = [
    { title: "Full-Stack Software Engineer", icon: <Code />, tags: ["Engineering", "Full-time", "Contract"] },
    { title: "Product Manager", icon: <Briefcase />, tags: ["Product", "Full-time"] },
    { title: "UX/UI Designer", icon: <PenTool />, tags: ["Design", "Part-time", "Contract"] },
    { title: "Digital Marketing Lead", icon: <Megaphone />, tags: ["Marketing", "Full-time"] },
];

const leadershipOpportunities = [
     { title: "Co-Founder", description: "Seeking a passionate and driven individual to join the founding team. Help shape the future of Shopiggo and revolutionize the e-commerce landscape.", icon: <Handshake /> },
     { title: "Advisory Board Member", description: "We are looking for experienced industry experts to provide strategic guidance and mentorship as we scale.", icon: <Users /> },
]

export default function CareersPage() {
    return (
        <div className="bg-secondary/5">
            <div className="container text-center py-16 lg:py-24">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-headline">
                    Build the Future of Shopping With Us
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                    We're a passionate team on a mission to simplify e-commerce. If you're excited by innovation and big challenges, you've come to the right place.
                </p>
            </div>

            <div className="pb-24">
                <div className="container max-w-5xl mx-auto">
                    
                    <Card className="mb-12 shadow-lg">
                        <CardHeader>
                            <CardTitle>Our Work Culture</CardTitle>
                        </CardHeader>
                        <CardContent className="grid sm:grid-cols-2 gap-6 text-muted-foreground">
                             <div className="flex items-start gap-4">
                                <MapPin className="w-8 h-8 text-primary mt-1" />
                                <div>
                                    <h4 className="font-semibold text-foreground">Dallas Hub</h4>
                                    <p>Our main hub is in the vibrant city of Dallas, TX, offering a fantastic environment for collaboration and innovation.</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-4">
                                <Globe className="w-8 h-8 text-primary mt-1" />
                                <div>
                                    <h4 className="font-semibold text-foreground">Remote & Hybrid Flexibility</h4>
                                    <p>We embrace a modern work style, offering remote and hybrid options depending on your location and role to ensure work-life balance.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <h2 className="text-3xl font-bold text-center mb-4 font-headline">Leadership Opportunities</h2>
                     <div className="grid md:grid-cols-2 gap-8 mb-12">
                        {leadershipOpportunities.map(opp => (
                            <Card key={opp.title}>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3">
                                        {opp.icon}
                                        <span>{opp.title}</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{opp.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <h2 className="text-3xl font-bold text-center mb-8 font-headline">Open Positions</h2>
                    <div className="space-y-4">
                        {jobOpenings.map((job) => (
                            <Card key={job.title} className="hover:shadow-md transition-shadow">
                                <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <h3 className="text-xl font-semibold flex items-center gap-3">
                                            {job.icon}
                                            <span>{job.title}</span>
                                        </h3>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {job.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                                        </div>
                                    </div>
                                    <Button asChild className="shrink-0 mt-4 sm:mt-0">
                                        <Link href="mailto:careers@shopiggo.com">Apply Now</Link>
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                     <p className="text-center text-muted-foreground mt-8">
                        We also partner with skilled developers on a contract basis. If you're a contractor, we'd love to hear from you.
                    </p>

                    <div className="text-center mt-16 bg-card p-8 rounded-lg">
                        <h3 className="text-2xl font-bold font-headline">Don't see your role?</h3>
                        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
                            We're always looking for talented individuals. Send your resume to us and we'll be in touch if a fitting role opens up.
                        </p>
                        <Button asChild size="lg" className="mt-6">
                            <Link href="mailto:careers@shopiggo.com">
                                <Mail className="mr-2" /> Contact Us
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
