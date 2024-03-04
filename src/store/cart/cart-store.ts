import { create } from 'zustand';
import { CartProduct } from '@/interfaces';
import { persist } from 'zustand/middleware';

interface State {
    cart: CartProduct[];

    getTotalItems: () => number;
    getSummaryInformation: () => {
        subTotal: number;
        tax: number;
        total: number;
        itemsInCart: number;
    };
    addProductToCart: (product: CartProduct) => void;
    updateProductQuantity: (product: CartProduct, quantity: number) => void;
    removeProduct: (product: CartProduct) => void;
    clearCart: () => void;
}

export const useCartStore = create<State>()(
    persist(
        (set, get) => ({
            cart: [],

            getTotalItems: () => {
                const { cart } = get();
                return cart.reduce((total, item) => total + item.quantity, 0);
            },

            getSummaryInformation: () => {
                const { cart } = get();
                const subTotal = cart.reduce(
                    (subTotal, product) => subTotal + product.quantity * product.price,
                    0
                );
                const tax = subTotal * 0.15;
                const total = subTotal + tax;
                const itemsInCart = cart.reduce((total, item) => total + item.quantity, 0);
                return { subTotal, tax, total, itemsInCart };
            },

            addProductToCart: (product: CartProduct) => {
                const { cart } = get();

                //1. ===> Revisar si el producto existe en el carrito con la talla seleccionada
                const productInCart = cart.some(
                    item => item.id === product.id && item.size === product.size
                );

                if (!productInCart) {
                    set({ cart: [...cart, product] });
                    return;
                }

                // 2. El producto existe por talla y hay que incrementarlo
                const updatedCartProducts = cart.map(item => {
                    if (item.id === product.id && item.size === product.size) {
                        return { ...item, quantity: item.quantity + product.quantity };
                    }
                    return item;
                });
                set({ cart: updatedCartProducts });
            },

            updateProductQuantity: (product: CartProduct, quantity: number) => {
                const { cart } = get();
                const updatedCartProducts = cart.map(item => {
                    if (item.id === product.id && item.size === product.size) {
                        return { ...item, quantity };
                    }
                    return item;
                });

                set({ cart: updatedCartProducts });
            },

            removeProduct: (product: CartProduct) => {
                const { cart } = get();
                const cleanedCartProducts = cart.filter(
                    item => item.id !== product.id || item.size !== product.size
                );

                set({ cart: cleanedCartProducts });
            },

            clearCart: () => {
                set({ cart: [] });
            },
        }),

        {
            name: 'shopping-cart',
        }
    )
);
