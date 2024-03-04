import Link from "next/link";
import { ProductsInCart } from "./ui/ProductsInCart";
import { Title } from "@/components";
import { PlaceOrder } from "./ui/PlaceOrder";



export default function CheckoutPage() {
    return (
        <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
            <div className="flex flex-col w-[1000px]">
                <Title
                    title="Verificar Orden"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

                    {/*===> Carrito */}
                    <div className="flex flex-col mt-5">
                        <span className="text-xl">Ajustar elementos</span>
                        <Link className="underline mb-5" href="/cart" >Editar orden</Link>
                        {/*===> Items */}
                        <ProductsInCart />
                    </div>

                    {/*===> Checkout/Resumen */}
                    <PlaceOrder />
                </div>
            </div>

        </div>
    );
}
