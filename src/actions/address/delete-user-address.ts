'use server';

import prisma from '@/lib/prisma';

export const deleteUserAddress = async (userId: string) => {
    try {
        const addressDeleted = await prisma.userAddress.delete({
            where: { userId },
        });

        return {
            ok: true,
            address: addressDeleted,
        };
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'No se pudo borrar la direccion el usuario de la BD',
        };
    }
};
