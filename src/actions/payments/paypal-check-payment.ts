'use server';

import { PayPalOrderStatusResponse } from "@/interfaces";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const paypalCheckPayment = async (paypalTransactionId: string) => {
    const authToken = await getPayPalBaererToken();
    if (!authToken) {
        return {
            ok: false,
            message: 'No se pudo verificar el token',
        };
    }

    const resp = await verifyPayPalPayment(paypalTransactionId, authToken);
    if (!resp) {
        return {
            ok: false,
            message: 'Error al verficar el pago'
        }
    }

    // ===> Information about the payment that PayPal retrive
    const { status, purchase_units } = resp
    const { invoice_id: orderId } = purchase_units[0]
    if (status !== 'COMPLETED') {
        return {
            ok: false,
            message: 'Aun no se ha pagado en PayPal'
        }
    }

    // ===> Update payment order
    try {
        await prisma.order.update({
            where: { id: orderId },
            data: {
                isPaid: true,
                paidAt: new Date()
            }
        })

        // TODO: Revalidar un path
        revalidatePath(`/orders/${orderId}`)
        return {
            ok: true
        }

    } catch (error) {
        console.log(error)
        return {
            ok: false,
            message: '500 - El pago no se pudo realizar'
        }

    }
};

const getPayPalBaererToken = async (): Promise<string | null> => {
    // ===> Defining Variables
    const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET_KEY = process.env.PAYPAL_SECRET_KEY;
    const PAYPAL_OAUTH_URL = process.env.PAYPAL_OAUTH_URL || '';

    const base64Token = Buffer
        .from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET_KEY}`, 'utf-8')
        .toString('base64');

    const myHeaders = new Headers();
    const urlencoded = new URLSearchParams();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    myHeaders.append('Authorization', `Basic ${base64Token}`);
    urlencoded.append('grant_type', 'client_credentials');

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
    };

    try {
        const result = await fetch(PAYPAL_OAUTH_URL, {
            ...requestOptions,
            cache: 'no-cache',
        }).then(resp => resp.json());

        return result.access_token;
    } catch (error) {
        console.log(error);
        return null;
    }
};

const verifyPayPalPayment = async (paypalTransactionId: string, bearerToken: String): Promise<PayPalOrderStatusResponse | null> => {

    // ===> Defining Variables
    const PAYPAL_ORDERS_URL = `${process.env.PAYPAL_ORDERS_URL}/${paypalTransactionId}`;

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${bearerToken}`);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
    };

    try {
        const response = await fetch(PAYPAL_ORDERS_URL, {
            ...requestOptions,
            cache: 'no-cache',
        }).then(resp => resp.json());

        return response;
    } catch (error) {
        console.log(error)
        return null
    }

}


