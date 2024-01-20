'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { QuantitySelector } from "@/components";
import { useCartStore } from "@/store";
import { currencyFormat } from "@/utils";




export const ProductsInCart = () => {
    const [loaded, setLoaded] = useState(false)
    const productInCart = useCartStore(state => state.cart);
    const updateProductQuantity = useCartStore(state => state.updateProductQuantity);
    const removeProduct = useCartStore(state => state.removeProduct);


    useEffect(() => {
        setLoaded(true)
    }, [])


    if (!loaded) return <>Loading ...</>
    return (
        <>
            {
                productInCart.map(product => (
                    <div key={`${product.id}-${product.size}`} className="flex mb-5">
                        <Image
                            className="mr-5 rounded"
                            width={100}
                            height={100}
                            style={{
                                width: '100px',
                                height: '100px',
                            }}
                            alt={product.title}
                            src={`/products/${product.image}`}
                        />
                        <div>
                            <Link
                                className="hover:underline cursor-pointer"
                                href={`/product/${product.slug}`}>
                                {product.title}
                            </Link>
                            <p>Size: {product.size}</p>
                            <p>{currencyFormat(product.price)}</p>
                            <QuantitySelector
                                quantity={product.quantity}
                                onQuantityChange={(quantity) => updateProductQuantity(product, quantity)}
                            />
                            <button
                                className="underline mt-3"
                                onClick={() => removeProduct(product)}
                            >Remover</button>
                        </div>
                    </div>
                ))
            }
        </>
    )
}
