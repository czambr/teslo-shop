'use client';

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import { CreateOrderData, CreateOrderActions, OnApproveData, OnApproveActions } from "@paypal/paypal-js"
import { paypalCheckPayment, setTransactionId } from "@/actions";


interface Props {
    orderId: string,
    amount: number
}

export const PayPalButton = ({ orderId, amount }: Props) => {
    const [{ isPending }] = usePayPalScriptReducer();
    const roundedAmount = (Math.round(amount * 100)) / 100

    if (isPending) {
        return (
            <div className="animate-pulse mb-16">
                <div className="h-11 bg-gray-300 rounded" />
                <div className="h-11 mt-2 bg-gray-300 rounded" />
            </div>
        )
    }

    // ===> Crea la orden en Paypal para generar el pago.
    //      Genera el ID de la transacion
    const createOrder = async (data: CreateOrderData, actions: CreateOrderActions): Promise<string> => {

        // ===> Genera la transaccion del lado de Paypal: Id de Paypal
        const transactionId = await actions.order.create({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    invoice_id: orderId,
                    amount: {
                        value: `${roundedAmount}`,
                        currency_code: 'USD',
                    }
                }
            ]
        });

        // ====> Guardar el ID de la transaccion en nuestros registros
        const { ok } = await setTransactionId(orderId, transactionId);
        if (!ok) throw new Error('No se pudo actualizar la orden');

        return transactionId;
    }

    // ===> Se ejecuta cuando el ciclo de la transaccion fue completado.
    const onApprove = async (data: OnApproveData, actions: OnApproveActions): Promise<void> => {
        const details = await actions.order?.capture();
        if (!details) return;

        const paypalTransactionId = details.id || '';
        await paypalCheckPayment(paypalTransactionId)
    }

    return (
        <PayPalButtons
            createOrder={createOrder}
            onApprove={onApprove}
        />
    )
}
