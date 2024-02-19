import { Title } from '@/components';
import { AddressForm } from './ui/AddressForm';
import { getAddressUser, getCountries } from '@/actions';
import { useSession } from 'next-auth/react';
import { auth } from '@/auth.config';

export default async function AddressPage() {

    const session = await auth();
    const userId = session?.user?.id || '';


    if (!session?.user) {
        return (
            <h3 className='text-5xl'>500 - No hay sesion de usuario</h3>
        )
    }

    const countries = await getCountries();
    const addressStored = await getAddressUser(userId);
    const address = addressStored ? addressStored.address : undefined;

    return (
        <div className="flex flex-col sm:justify-center sm:items-center mb-72 px-10 sm:px-0">

            <div className="w-full  xl:w-[1000px] flex flex-col justify-center text-left">

                <Title title="Dirección" subtitle="Dirección de entrega" />
                <AddressForm countries={countries} userStoredAddress={address} />
            </div>
        </div>
    );
}