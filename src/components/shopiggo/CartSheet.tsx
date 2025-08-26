// src/components/shopiggo/CartSheet.tsx
'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { ScrollArea } from "../ui/scroll-area";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Trash2 } from "lucide-react";

export function CartSheet({ children }: { children: React.ReactNode }) {
    const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent className="flex flex-col">
                <SheetHeader>
                    <SheetTitle>Shopping Cart ({cartItems.length})</SheetTitle>
                </SheetHeader>
                {cartItems.length === 0 ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-center">
                        <h3 className="text-xl font-semibold">Your cart is empty</h3>
                        <p className="text-muted-foreground mt-2">Add some items to get started.</p>
                        <SheetClose asChild>
                           <Link href="/search">
                                <Button className="mt-6">Start Shopping</Button>
                           </Link>
                        </SheetClose>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="flex-grow my-4 pr-6 -mr-6">
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <Image
                                            src={item.imageURL}
                                            alt={item.title}
                                            width={80}
                                            height={80}
                                            className="rounded-md object-cover w-20 h-20"
                                        />
                                        <div className="flex-grow">
                                            <Link href={`/product/${item.id}`} className="hover:text-primary">
                                                <h4 className="font-semibold text-sm line-clamp-2">{item.title}</h4>
                                            </Link>
                                            <p className="text-sm text-muted-foreground mt-1">${item.price.toFixed(2)}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
                                                    className="w-16 h-8"
                                                />
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeFromCart(item.id)}>
                                                    <Trash2 className="text-destructive h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                        <SheetFooter className="mt-auto">
                            <div className="w-full space-y-4">
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <SheetClose asChild>
                                    <Link href="/cart" className="w-full">
                                        <Button className="w-full" size="lg">View Cart & Checkout</Button>
                                    </Link>
                                </SheetClose>
                                <Button variant="outline" className="w-full" onClick={clearCart}>
                                    Clear Cart
                                </Button>
                            </div>
                        </SheetFooter>
                    </>
                )}
            </SheetContent>
        </Sheet>
    )
}
