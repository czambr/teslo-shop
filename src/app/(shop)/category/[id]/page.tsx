import { ProductGrid, Title } from '@/components';
import { Category } from '@/interfaces';
import { initialData } from '@/seed/seed';
import { notFound } from 'next/navigation';

const seedProducts = initialData.products;

interface Props {
    params: {
        id: Category;
    };
}

export default function ({ params }: Props) {
    const { id } = params;
    const products = seedProducts.filter(product => product.gender === id);
    const labels: Record<Category, string> = {
        men: 'para Hombres',
        women: 'para Mujeres',
        kid: 'para Niños',
        unisex: 'para Todos',
    };

    // if (id === 'kids') {
    //     notFound();
    // }

    return (
        <>
            <Title
                title={`Articulos ${labels[id]}`}
                subtitle=''
                className='mb-3'
            />

            <ProductGrid products={products} />
        </>
    );
}
