// src/app/cart/page.tsx
'use client';

import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Trash2, Gem } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '@/hooks/use-user';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const { userTier, isLoaded } = useUser();

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxes = subtotal * 0.08; // Example tax rate
  const shipping = subtotal > 50 ? 0 : 9.99; // Example shipping rule
  const total = subtotal + taxes + shipping;

  if (!isLoaded) {
      return <div>Loading...</div>; // Or a skeleton loader
  }

  if (userTier === 'Free') {
    return (
        <div className="container py-12 text-center">
            <div className="max-w-md mx-auto bg-card p-8 rounded-lg shadow-lg">
                <Gem className="h-16 w-16 mx-auto text-primary" />
                <h2 className="mt-6 text-2xl font-bold font-headline">Unlock Your Cart</h2>
                <p className="mt-2 text-muted-foreground">
                    The unified cart is a premium feature. Upgrade your membership to add items from any store and checkout in one place.
                </p>
                <Link href="/membership">
                    <Button size="lg" className="mt-6">View Membership Plans</Button>
                </Link>
            </div>
        </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8 font-headline">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-lg">
          <h3 className="text-2xl font-semibold">Your cart is empty</h3>
          <p className="text-muted-foreground mt-2">Looks like you haven't added anything to your cart yet.</p>
          <Link href="/search">
            <Button className="mt-6">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="flex items-center p-4 gap-4">
                  <Image
                    src={item.imageURL}
                    alt={item.title}
                    width={100}
                    height={100}
                    className="rounded-md object-cover w-24 h-24"
                  />
                  <div className="flex-grow">
                    <Link href={`/product/${item.id}`}>
                      <h4 className="font-semibold hover:text-primary">{item.title}</h4>
                    </Link>
                    <p className="text-sm text-muted-foreground">{item.storeName}</p>
                    <p className="text-lg font-bold text-primary mt-1">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
                      className="w-20"
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                      <Trash2 className="text-destructive" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
            <Button variant="outline" className="mt-6" onClick={clearCart}>
                Clear Cart
            </Button>
          </div>

          <div className="lg:col-span-1 sticky top-24">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span>${taxes.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <Button className="w-full" size="lg">Proceed to Checkout</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
