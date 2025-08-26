// src/app/product/[id]/page.tsx
'use client'

import { getProductById, products } from '@/lib/data';
import { notFound, useParams } from 'next/navigation';
import { ProductDetails } from '@/components/shopiggo/ProductDetails';
import { useUser } from '@/hooks/use-user';


export default function ProductPage() {
    const params = useParams();
    const id = typeof params.id === 'string' ? params.id : '';
    const product = getProductById(id);
    const { user, userTier, isLoaded } = useUser();

    if (!product) {
        notFound();
    }
    
    const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

    return <ProductDetails product={product} relatedProducts={relatedProducts} userTier={userTier} isLoaded={isLoaded} />;
}
