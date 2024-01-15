import { redirect } from 'next/navigation';
import { getPaginateProductsWithImages } from '@/actions';
import { Pagination, ProductGrid, Title } from '@/components';
import { Gender } from '@prisma/client';


interface Props {
    params: {
        gender: string;
    };
    searchParams: {
        page?: string
    }
}


export default async function PageByGender({ params, searchParams }: Props) {
    const gender = params.gender || 'men';
    const page = searchParams.page ? parseInt(searchParams.page) : 1;

    const { products, totalPages } = await getPaginateProductsWithImages({ page, gender: gender as Gender });
    if (products.length === 0) redirect(`/gender/${gender}'`)

    const labels: Record<string, string> = {
        men: 'para Hombres',
        women: 'para Mujeres',
        kid: 'para Niños',
        unisex: 'para Todos',
    };


    return (
        <>
            <Title
                title={`Articulos ${labels[gender]}`}
                subtitle=''
                className='mb-3'
            />

            <ProductGrid products={products} />
            <Pagination totalPages={totalPages} />
        </>
    );
}
