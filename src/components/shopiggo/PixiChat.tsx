
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, X, Sparkles, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser } from '@/hooks/use-user';
import { Badge } from '../ui/badge';
import Link from 'next/link';

type Message = {
    sender: 'user' | 'pixi';
    text: string;
}

export function PixiChat() {
    const { user, userTier, hyperSearchCredits, isPixiChatOpen, setPixiChatOpen } = useUser();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
        if (isPixiChatOpen && messages.length === 0) {
            setMessages([
                { sender: 'pixi', text: "Hi! I'm Pixi, your AI shopping assistant. How can I help you find the perfect deal today?" }
            ]);
        }
    }, [isPixiChatOpen, messages.length]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Simulate AI response
        setTimeout(() => {
            const aiResponse: Message = { sender: 'pixi', text: "I'm still learning! My full capabilities are coming soon. For now, you can use the search bar to find products and deals." };
            setMessages(prev => [...prev, aiResponse]);
            setIsLoading(false);
        }, 1500);
    };

    if (!isPixiChatOpen || !user) {
        return null;
    }

    const hasCredits = userTier !== 'Free' || hyperSearchCredits > 0;

    return (
        <AnimatePresence>
            {isPixiChatOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed bottom-4 right-4 w-full max-w-md h-[70vh] bg-card border rounded-lg shadow-2xl flex flex-col z-50"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <div className="flex items-center gap-2">
                             <div className="p-2 bg-primary/10 rounded-full text-primary">
                                <Bot className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg font-headline">Pixi AI</h3>
                                {userTier === 'Free' ? (
                                    <Badge variant={hasCredits ? "secondary" : "destructive"}>
                                        {hyperSearchCredits} / 2 Credits Remaining
                                    </Badge>
                                ) : (
                                     <Badge variant="secondary">
                                        {userTier} Plan
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setPixiChatOpen(false)}>
                            <X />
                        </Button>
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-grow p-4">
                        <div className="space-y-4">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.sender === 'pixi' && <Bot className="w-6 h-6 text-primary shrink-0" />}
                                    <div className={`max-w-xs md:max-w-sm rounded-lg px-4 py-2 ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                        <p className="text-sm">{msg.text}</p>
                                    </div>
                                     {msg.sender === 'user' && <User className="w-6 h-6 text-muted-foreground shrink-0" />}
                                </div>
                            ))}
                            {isLoading && (
                                 <div className="flex items-end gap-2 justify-start">
                                    <Bot className="w-6 h-6 text-primary shrink-0" />
                                    <div className="max-w-xs md:max-w-sm rounded-lg px-4 py-2 bg-muted">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    {/* Input */}
                    {hasCredits ? (
                        <form onSubmit={handleSendMessage} className="p-4 border-t">
                            <div className="relative">
                                <Textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about products, deals, or specs..."
                                    className="pr-12 resize-none"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            handleSendMessage(e);
                                        }
                                    }}
                                />
                                <Button type="submit" size="icon" className="absolute right-2 bottom-2" disabled={isLoading || !input.trim()}>
                                    <Send />
                                </Button>
                            </div>
                        </form>
                    ) : (
                         <div className="p-4 border-t text-center">
                            <p className="text-sm text-muted-foreground">You've used all your free Pixi AI credits for this month.</p>
                            <Link href="/membership">
                                <Button size="sm" className="mt-2">Upgrade Your Plan</Button>
                            </Link>
                        </div>
                    )}

                </motion.div>
            )}
        </AnimatePresence>
    );
}
