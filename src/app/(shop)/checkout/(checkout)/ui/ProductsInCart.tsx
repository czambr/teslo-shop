'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/store";
import { currencyFormat } from "@/utils";




export const ProductsInCart = () => {
    const [loaded, setLoaded] = useState(false)
    const productInCart = useCartStore(state => state.cart);


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
                            <span>{product.title} ({product.quantity})</span>
                            <p>Size: {product.size}</p>
                            <p className="font-bold">{currencyFormat(product.price * product.quantity)}</p>
                        </div>
                    </div >
                ))
            }
        </>
    )
}
