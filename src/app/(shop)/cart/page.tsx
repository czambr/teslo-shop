import Link from "next/link";
import { Title } from "@/components";
import { redirect } from "next/navigation";
import { ProductsInCart } from "./ui/ProductsInCart";
import { OrderSumary } from "./ui/OrderSumary";




export default function CartPage() {

    // if (productInCart.length === 0) redirect('/empty')

    return (
        <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
            <div className="flex flex-col w-[1000px]">
                <Title
                    title="Carrito"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

                    {/*===> Carrito */}
                    <div className="flex flex-col mt-5">
                        <span className="text-xl">Agregar mas items</span>
                        <Link className="underline mb-5" href="/" >Continua comprando</Link>



                        {/*===> Items */}
                        <ProductsInCart />
                    </div>




                    {/*===> Checkout/Resumen */}
                    <div className="bg-white rounded-xl shadow-xl p-7 h-fit">
                        <h2 className="text-2xl mb-2">Resumen de orden</h2>
                        <OrderSumary />

                        <div className="mt-5 mb-2 w-full">
                            <Link
                                className="flex btn-primary justify-center"
                                href='/checkout/address'
                            >Checkout</Link>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
