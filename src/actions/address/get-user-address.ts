import prisma from '@/lib/prisma';

export const getAddressUser = async (userId: string) => {
    try {
        const storedAddress = await prisma.userAddress.findUnique({
            where: { userId },
        });

        if (!storedAddress) return null;

        const { countryId, ...restAddress } = storedAddress;
        return {
            ok: true,
            address: {
                ...restAddress,
                country: countryId,
            },
        };
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'No tiene direccion almacenada',
        };
    }
};
