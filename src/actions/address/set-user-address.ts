'use server';

import { Address } from '@/interfaces';
import prisma from '@/lib/prisma';

const createOrReplaceAddress = async (address: Address, userId: string) => {
    const addressToSave = {
        userId: userId,
        address: address.address,
        address2: address.address2,
        countryId: address.country,
        city: address.city,
        firstName: address.firstName,
        lastName: address.lastName,
        phone: address.phone,
        postalCode: address.postalCode,
    };

    try {
        const storedAddress = await prisma.userAddress.findUnique({
            where: { userId },
        });

        if (!storedAddress) {
            const newAddress = await prisma.userAddress.create({
                data: addressToSave,
            });
            return newAddress;
        }

        const updatedAddress = await prisma.userAddress.update({
            data: addressToSave,
            where: { userId: userId },
        });
        return updatedAddress;
    } catch (error) {
        console.log(error);
        throw new Error('No se pudo grabar la direccion');
    }
};

export const setUserAddress = async (address: Address, userId: string) => {
    try {
        const addressSaved = await createOrReplaceAddress(address, userId);

        return {
            ok: true,
            address: addressSaved,
        };
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'No se pudo grabar la direccion',
        };
    }
};
