// src/components/shopiggo/ContactSettings.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";

// Mock data has been removed. The contacts array is now empty.
const contacts: any[] = [];

export function ContactSettings() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Contacts</CardTitle>
                <CardDescription>Add or remove contacts to share deals and messages with.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <h3 className="font-medium">Add New Contact</h3>
                    <div className="flex gap-2">
                        <Input placeholder="Enter user's email address..." />
                        <Button>
                            <PlusCircle className="mr-2" /> Add
                        </Button>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <h3 className="font-medium">Your Contacts ({contacts.length})</h3>
                    {contacts.length > 0 ? (
                        contacts.map((contact) => (
                            <div key={contact.id} className="flex items-center gap-4 rounded-lg border p-3">
                                 <Avatar className="h-10 w-10">
                                    <AvatarImage src={`https://placehold.co/100x100.png?text=${contact.name.charAt(0)}`} alt={`${contact.name}'s Avatar`} />
                                    <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-grow">
                                    <p className="font-semibold">{contact.name}</p>
                                    <p className="text-sm text-muted-foreground">{contact.email}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="text-destructive">
                                    <Trash2 />
                                </Button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-muted-foreground border-dashed border-2 rounded-lg p-8">
                             <p>You haven't added any contacts yet.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
