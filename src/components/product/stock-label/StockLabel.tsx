'use client';

import { useEffect, useState } from "react";
import { titleFont } from "@/config/fonts"
import { getStockBySlug } from "@/actions";


interface Props {
    slug: string
}



export const StockLabel = ({ slug }: Props) => {

    const [StockLabel, setStockLabel] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const getStock = async () => {
        const stock = await getStockBySlug(slug);
        setStockLabel(stock)
        setIsLoading(false);
    }

    useEffect(() => {
        getStock();
    }, [])


    return (
        <> {
            (isLoading)
                ? (
                    < h1 className={`${titleFont.className} antialiased font-bold text-lg animate-pulse bg-gray-300`}>
                        &nbsp;
                    </h1 >
                ) : (
                    <h1 className={`${titleFont.className} antialiased font-bold text-lg`}>
                        Stock: {StockLabel}
                    </h1>
                )
        }
        </>
    )
}
