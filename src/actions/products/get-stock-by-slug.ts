'use server';

import prisma from '@/lib/prisma';
import { sleep } from '@/utils';

export const getStockBySlug = async (slug: string): Promise<number> => {
    try {
        sleep(3);
        const product = await prisma.product.findFirst({
            where: { slug: slug },
            select: { inStock: true },
        });

        return product?.inStock || 0;
    } catch (error) {
        console.log(error);
        return 0;
    }
};
