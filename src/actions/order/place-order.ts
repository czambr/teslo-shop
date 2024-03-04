'use server';

import { auth } from '@/auth.config';
import { Address, Size } from '@/interfaces';
import prisma from '@/lib/prisma';

interface ProductToOrder {
    productId: string;
    quantity: number;
    size: Size;
}

export const placeOrder = async (productIds: ProductToOrder[], address: Address) => {
    const session = await auth();
    const userId = session?.user.id;

    // ===> Verificar la sesion del usuario
    if (!userId) {
        return {
            ok: false,
            message: 'No hay session de usuario',
        };
    }

    // ===> Obtener la informacion de los productos
    // Recordar: Se pueden llevar 2+ productos por el mismo ID
    const products = await prisma.product.findMany({
        where: {
            id: { in: productIds.map(p => p.productId) },
        },
    });

    // ===> Calcular los montos
    const itemsInOrder = productIds.reduce((count, p) => count + p.quantity, 0);

    // ===> Calculo de totales: Tax, SubTotal, Total
    const { subTotal, tax, total } = productIds.reduce(
        (totals, item) => {
            const productQuantity = item.quantity;
            const product = products.find(p => p.id === item.productId);
            if (!product) throw new Error(`${item.productId} no existe - 500`);

            const subTotal = product.price * productQuantity;
            totals.subTotal += subTotal;
            totals.tax += subTotal * 0.15;
            totals.total += subTotal + totals.tax;

            return totals;
        },
        { subTotal: 0, tax: 0, total: 0 }
    );

    // ===> Crear la transaccion de base de datos
    try {
        const primsaTX = await prisma.$transaction(async tx => {
            // 1. Actualizar el stock de los productos

            const updatedProductsPromises = products.map(async product => {
                // Acumular los valores
                const productQuantity = productIds
                    .filter(p => p.productId === product.id)
                    .reduce((acc, item) => item.quantity + acc, 0);

                if (productQuantity === 0) {
                    throw new Error(`El ${product.id} no tiene cantidad definida`);
                }

                return tx.product.update({
                    where: { id: product.id },
                    data: {
                        // inStock: product.inStock - productQuantity // No hacer,
                        inStock: {
                            decrement: productQuantity,
                        },
                    },
                });
            });
            const updatedProducts = await Promise.all(updatedProductsPromises);

            // Verificar valores negativos en la existencia del stock -> No existe stock
            updatedProducts.forEach(products => {
                if (products.inStock < 0) {
                    throw new Error(`${products.title} no tiene inventario suficiente`);
                }
            });

            // 2. Crear la orden - Encabezado/Detalle
            const order = await tx.order.create({
                data: {
                    userId: userId,
                    itemsInOrder: itemsInOrder,
                    subtTotal: subTotal,
                    tax: tax,
                    total: total,

                    OrderItem: {
                        createMany: {
                            data: productIds.map(p => ({
                                quantity: p.quantity,
                                size: p.size,
                                productId: p.productId,
                                price:
                                    products.find(producto => producto.id === p.productId)?.price ??
                                    0,
                            })),
                        },
                    },
                },
            });
            // 3. Crear la direccion de la orden
            const { country, ...restAddress } = address;
            const orderAddress = await tx.orderAddress.create({
                data: {
                    ...restAddress,
                    countryId: country,
                    orderId: order.id,
                },
            });

            // 4. Si todo sale bien, retornamos informacion de la orden
            return {
                order: order,
                orderAddress: orderAddress,
                updatedProducts: updatedProducts,
            };
        });

        return {
            ok: true,
            order: primsaTX.order,
            primsaTX: primsaTX,
        };
    } catch (error: any) {
        return {
            ok: false,
            message: error?.message,
        };
    }
};
