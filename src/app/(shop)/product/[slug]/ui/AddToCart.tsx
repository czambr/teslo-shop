'use client';

import { useState } from "react";
import { QuantitySelector, SizeSelector } from "@/components"
import type { CartProduct, Product, Size } from "@/interfaces"
import { useCartStore } from "@/store";

interface Props {
    product: Product,
}
export const AddToCart = ({ product }: Props) => {
    const [posted, setPosted] = useState(false);
    const addProductCart = useCartStore(state => state.addProductToCart);
    const [size, setSize] = useState<Size | undefined>()
    const [quantity, setQuantity] = useState<number>(1)

    const addToCart = () => {
        setPosted(true);
        if (!size) return

        const cartProduct: CartProduct = {
            id: product.id,
            slug: product.slug,
            title: product.title,
            price: product.price,
            quantity: quantity,
            size: size,
            image: product.images[0]
        };

        addProductCart(cartProduct);
        setPosted(false);
        setSize(undefined);
        setQuantity(1);
    }


    return (
        <>
            {
                posted && !size && (
                    <span className="mt-2 text-red-500 fade-in">**Debe seleccionar una talla</span>
                )
            }

            {/*====> Selector de tallas */}
            <SizeSelector
                selectedSize={size}
                availableSizes={product.sizes}
                onSizeChanged={setSize}
            />

            {/*====> Selector de cantidad */}
            <QuantitySelector
                quantity={quantity}
                onQuantityChange={setQuantity}
            />

            {/*====> Button */}
            <button
                className='btn-primary my-5'
                onClick={addToCart}
            >Agregar al carrito</button>
        </>
    )
}
