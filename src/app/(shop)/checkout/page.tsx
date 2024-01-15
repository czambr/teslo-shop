import Link from "next/link";
import Image from "next/image";
import { QuantitySelector, Title } from "@/components";
import { initialData } from '@/seed/seed'


const productInCart = [
    initialData.products[0],
    initialData.products[1],
    initialData.products[2],
    initialData.products[3],
]

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
                        {
                            productInCart.map(product => (
                                <div key={product.slug} className="flex mb-5">
                                    <Image
                                        className="mr-5 rounded"
                                        width={100}
                                        height={100}
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                        }}
                                        alt={product.title}
                                        src={`/products/${product.images[0]}`}
                                    />
                                    <div>
                                        <p>{product.title}</p>
                                        <p>{product.price} x 3</p>
                                        <p className="font-bold">Subtotal: ${product.price} x3</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>




                    {/*===> Checkout/Resumen */}
                    <div className="bg-white rounded-xl shadow-xl p-7 h-fit">
                        <h2 className="text-2xl mb-2 font-bold">Direccion de entrega</h2>
                        <div className="mb-10">
                            <p className="text-xl">Carlos Zambrano</p>
                            <p>Av. Centro</p>
                            <p>Col. Centro</p>
                            <p>Alcaldia Guayaquil</p>
                            <p>Ciudad de Guayaquil</p>
                            <p>ZIPCODE 132665</p>
                            <p>Telf. 098898989554</p>
                        </div>

                        {/* ===> Divider */}
                        <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />


                        <h2 className="text-2xl mb-2">Resumen de orden</h2>
                        <div className="grid grid-cols-2">
                            <span>No. Productos</span>
                            <span className="text-right">3 articulos</span>

                            <span>Subtotal</span>
                            <span className="text-right">$ 100</span>

                            <span>Impuesto (15%)</span>
                            <span className="text-right">$ 100</span>

                            <span className="mt-5 text-2xl">Total</span>
                            <span className="mt-5 text-2xl text-right">$ 100</span>
                        </div>

                        <div className="mt-5 mb-2 w-full">
                            <p className="mb-5">
                                <span className="text-xs">
                                    Al hacer click en &quotColocar orden&quot, aceptas nuestros <a href="#" className="underline">terminos y condiciones</a> y <a href="#" className="underline">politica de privacidad</a>
                                </span>
                            </p>
                            <Link
                                className="flex btn-primary justify-center"
                                href='/orders/123'
                            >
                                Colocar Orden
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
