'use client';

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { SessionProvider } from "next-auth/react";

interface Props {
    children: React.ReactNode
}

export const Providers = ({ children }: Props) => {

    const optionsPaypalProvider = {
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
        currency: 'USD',
        intent: 'capture',
    }

    return (
        <PayPalScriptProvider options={optionsPaypalProvider}>
            <SessionProvider>
                {children}
            </SessionProvider>
        </PayPalScriptProvider>
    )
}
