// src/app/blog/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const blogPosts = [
    {
        title: "10 AI-Powered Shopping Hacks to Save You Money",
        category: "Smart Shopping",
        excerpt: "Discover how you can leverage artificial intelligence, like our own Pixi AI, to find the best deals, track prices, and make smarter purchasing decisions.",
        image: "https://images.unsplash.com/photo-1680783954745-3249be59e527?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlfGVufDB8fHx8MTc1MzI5ODg4MHww&ixlib=rb-4.1.0&q=80&w=1080",
        aiHint: "artificial intelligence",
        href: "#"
    },
    {
        title: "The Future of E-Commerce: A Unified Cart Experience",
        category: "Industry Trends",
        excerpt: "Tired of juggling multiple checkouts? We dive into why a unified cart is the next big thing in online retail and how it benefits both shoppers and stores.",
        image: "https://images.unsplash.com/photo-1619191163420-4a7c0798b8a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxzaG9wcGluZyUyMGNhcnR8ZW58MHx8fHwxNzUzMjk4ODgwfDA&ixlib=rb-4.1.0&q=80&w=1080",
        aiHint: "shopping cart",
        href: "#"
    },
    {
        title: "Mastering the Hunt for Hot Deals",
        category: "Tips & Tricks",
        excerpt: "Learn the strategies the pros use to find the best discounts, from timing your purchases to using advanced filtering to uncover hidden gems.",
        image: "https://images.unsplash.com/photo-1605902711834-8b11c3e3ef2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxvbmxpbmUlMjBzaG9wcGluZ3xlbnwwfHx8fDE3NTMyOTg4ODF8MA&ixlib=rb-4.1.0&q=80&w=1080",
        aiHint: "online shopping",
        href: "#"
    },
     {
        title: "How GoCoins Revolutionize Loyalty Rewards",
        category: "Rewards",
        excerpt: "Not all loyalty programs are created equal. We explore how a consolidated rewards system like GoCoins offers more value and flexibility.",
        image: "https://images.unsplash.com/photo-1593678695897-305661babfbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxsb3lhbHR5JTIwcG9pbnRzfGVufDB8fHx8MTc1MzI5ODg4MXww&ixlib=rb-4.1.0&q=80&w=1080",
        aiHint: "loyalty points",
        href: "#"
    },
     {
        title: "Top 5 Features to Look For in a Shopping Assistant",
        category: "AI & Tech",
        excerpt: "From multi-store search to price drop alerts, find out what makes an AI shopping assistant truly powerful and how to get the most out of it.",
        image: "https://images.unsplash.com/photo-1655923570951-fd93db1152e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxyb2JvdCUyMGFzc2lzdGFudHxlbnwwfHx8fDE3NTMyOTg4ODF8MA&ixlib=rb-4.1.0&q=80&w=1080",
        aiHint: "robot assistant",
        href: "#"
    },
     {
        title: "Is Your Data Safe? A Look at Secure Online Shopping",
        category: "Security",
        excerpt: "We discuss the importance of security in online shopping and the measures platforms can take to protect your information, from checkout to delivery.",
        image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxjeWJlciUyMHNlY3VyaXR5fGVufDB8fHx8MTc1MzI5ODg4MHww&ixlib=rb-4.1.0&q=80&w=1080",
        aiHint: "cyber security",
        href: "#"
    }
];

export default function BlogPage() {
    return (
        <div className="bg-secondary/30">
            <div className="container text-center py-16 lg:py-24">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-headline">
                    The Shopiggo Blog
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                    Your source for shopping tips, deal-hunting strategies, and the latest e-commerce trends.
                </p>
            </div>

            <div className="container pb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post) => (
                        <Card key={post.title} className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow">
                            <CardHeader className="p-0">
                                <Link href={post.href}>
                                     <Image src={post.image} alt={post.title} width={600} height={400} className="w-full h-48 object-cover" data-ai-hint={post.aiHint} />
                                </Link>
                            </CardHeader>
                            <CardContent className="p-6 flex-grow">
                                <Badge variant="secondary" className="mb-2">{post.category}</Badge>
                                <CardTitle className="text-xl font-headline leading-snug">
                                    <Link href={post.href} className="hover:text-primary">{post.title}</Link>
                                </CardTitle>
                                <CardDescription className="mt-2">{post.excerpt}</CardDescription>
                            </CardContent>
                            <CardFooter className="p-6 pt-0">
                                <Link href={post.href}>
                                    <Button variant="link" className="p-0">
                                        Read More <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
