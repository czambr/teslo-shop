'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { useAddressStore, useCartStore } from "@/store";
import { placeOrder } from "@/actions";
import { currencyFormat } from "@/utils";



export const PlaceOrder = () => {

    const router = useRouter();
    const [loaded, setLoaded] = useState(false)
    const [errorMessage, setErrorMessage] = useState('');
    const [isPlacingOrder, setIsPlacingOrder] = useState(false)
    const address = useAddressStore(state => state.address)
    const { cart, clearCart } = useCartStore(state => state);
    const { itemsInCart, subTotal, tax, total } = useCartStore(state => state.getSummaryInformation());


    useEffect(() => {
        setLoaded(true)
    }, [])

    const onPlaceOrder = async () => {
        setIsPlacingOrder(true)
        const productsToOrder = cart.map(product => ({
            productId: product.id,
            quantity: product.quantity,
            size: product.size,
        }))

        // ! Server Action
        const resp = await placeOrder(productsToOrder, address)
        if (!resp.ok) {
            setIsPlacingOrder(false)
            setErrorMessage(resp.message)
            return
        }

        clearCart()
        setErrorMessage('')
        router.replace('/orders/' + resp.order!.id)
    }

    if (!loaded) return <p>Loading ....</p>
    return (
        <div className="bg-white rounded-xl shadow-xl p-7 h-fit">
            <h2 className="text-2xl mb-2 font-bold">Direccion de entrega</h2>
            <div className="mb-10">
                <p className="text-xl">{address.firstName} {address.lastName}</p>
                <p>{address.address}</p>
                <p>{address.address2}</p>
                <p>{address.postalCode}</p>
                <p>{address.city} {address.country}</p>
                <p>{address.phone}</p>
            </div>

            {/* ===> Divider */}
            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />


            <h2 className="text-2xl mb-2">Resumen de orden</h2>
            <div className="grid grid-cols-2">
                <span>No. Productos</span>
                <span className="text-right">{itemsInCart === 1 ? '1 articulo' : `${itemsInCart} articulos`}</span>

                <span>Subtotal</span>
                <span className="text-right">{currencyFormat(subTotal)}</span>

                <span>Impuesto (15%)</span>
                <span className="text-right">{currencyFormat(tax)}</span>

                <span className="mt-5 text-2xl">Total</span>
                <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>
            </div>

            <div className="mt-5 mb-2 w-full">
                <p className="mb-5">
                    <span className="text-xs">
                        Al hacer click en &quotColocar orden&quot, aceptas nuestros <a href="#" className="underline">terminos y condiciones</a> y <a href="#" className="underline">politica de privacidad</a>
                    </span>
                </p>

                {errorMessage && (<p className="my-2 text-red-500">{errorMessage}</p>)}
                <button
                    className={
                        clsx({
                            "btn-primary": !isPlacingOrder,
                            "btn-disabled": isPlacingOrder
                        })
                    }
                    onClick={onPlaceOrder}
                >
                    Colocar Orden
                </button>
            </div>
        </div>
    )
}
