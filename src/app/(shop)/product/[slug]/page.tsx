export const revalidate = 10; // 7 dias aprox

import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/actions';
import { ProductMobileSlideshow, ProductSlideshow, QuantitySelector, SizeSelector, StockLabel } from '@/components';
import { titleFont } from '@/config/fonts';
import { AddToCart } from './ui/AddToCart';


export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    // read route params
    const slug = params.slug

    // fetch data
    const product = await getProductBySlug(slug)

    // optionally access and extend (rather than replace) parent metadata
    // const previousImages = (await parent).openGraph?.images || []

    return {
        title: product?.title || 'Producto no encontrado',
        description: product?.description || '',
        openGraph: {
            title: product?.title || 'Producto no encontrado',
            description: product?.description || '',
            images: [`/products/${product?.images[1]}`],
        },
    }
}

interface Props {
    params: { slug: string };
}

export default async function ProductBySlugPage({ params }: Props) {
    const { slug } = params;
    const product = await getProductBySlug(slug);
    console.log(product)

    if (!product) {
        notFound();
    }

    return (
        <div className='mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3'>
            {/*===> SlideShow */}
            <div className='col-span-1 md:col-span-2'>

                {/* ===> Desktop Slideshow */}
                <ProductSlideshow
                    className='hidden md:block'
                    title={product.title}
                    images={product.images}
                />


                {/* ===> Mobile Slideshow */}
                <ProductMobileSlideshow
                    className='block md:hidden'
                    title={product.title}
                    images={product.images}
                />

            </div>

            {/*===> Detalles del producto */}
            <div className='col-span-1 px-5'>
                <StockLabel slug={product.slug} />

                <h1 className={`${titleFont.className} antialiased font-bold text-xl`}>
                    {product.title}
                </h1>
                <p className='text-lg mb-5'>${product.price}</p>

                {/*===> Selector de tallas y cantidad*/}
                <AddToCart product={product} />

                {/*====> Description */}
                <h3 className='font-bold text-sm'>Descripcion</h3>
                <p className='font-ligth'>{product.description}</p>
            </div>
        </div>
    );
}
