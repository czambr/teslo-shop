'use server';
import prisma from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import { Gender, Product, Size } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';


// ====> Cloudinary
cloudinary.config(process.env.CLOUDINARY_URL || '');

// ====> Esquema para validar el form
const productSchema = z.object({
    id: z.string().uuid().optional().nullable(),
    title: z.string().min(3).max(255),
    slug: z.string().min(3).max(255),
    description: z.string(),
    price: z.coerce
        .number()
        .min(0)
        .transform(val => Number(val.toFixed(2))),
    inStock: z.coerce
        .number()
        .min(0)
        .transform(val => Number(val)),
    categoryId: z.string().uuid(),
    sizes: z.coerce
        .string()
        .transform(val => val.split(',')),
    tags: z.string(),
    gender: z.nativeEnum(Gender),
})

export const createUpdateProduct = async (formData: FormData) => {
    const data = Object.fromEntries(formData)
    const productParsed = productSchema.safeParse(data);

    // ===> Comprobaciones de las validaciones del esquema
    if (!productParsed.success) {
        console.log(productParsed.error)
        return { ok: false }
    }


    // ===> Ajustes en la data previo a generar la transaccion
    const product = productParsed.data;
    product.slug = product.slug
        .toLowerCase()
        .replace(/ /g, '-')
        .trim();

    try {
        const { id, ...restProduct } = product
        const prismaTX = await prisma.$transaction(async (tx) => {

            let product: Product;
            const tagsArray = restProduct.tags.split(',').map(tag => tag.toLocaleLowerCase().trim())

            // ===> Actualizamos
            if (id) {
                product = await prisma.product.update({
                    where: { id },
                    data: {
                        ...restProduct,
                        sizes: { set: restProduct.sizes as Size[] },
                        tags: { set: tagsArray }
                    }
                })

            } else {
                // ===> Creamos
                product = await prisma.product.create({
                    data: {
                        ...restProduct,
                        sizes: { set: restProduct.sizes as Size[] },
                        tags: { set: tagsArray }
                    }
                })

            }

            // ===> Proceso de carga y guardado de imagenes
            if (formData.getAll('images')) {
                const images = await uploadImages(formData.getAll('images') as File[])
                if (!images) throw new Error('No se pudo cargar las imagenes, rollingback')

                await prisma.productImage.createMany({
                    data: images.map((image) => ({
                        url: image!,
                        productId: product.id,
                    }))
                });
            }

            return {
                product
            }
        })

        // ===> Revalidate paths
        revalidatePath('/admin/products')
        revalidatePath(`/admin/product/${product.slug}`)
        revalidatePath(`/products/${product.slug}`)

        return {
            ok: true,
            product: prismaTX.product
        }
    } catch (error) {
        return {
            ok: false,
            message: 'Revisar logs, no se pudo realizar la transaccion'
        }

    }
}


const uploadImages = async (images: File[]) => {

    try {
        const uploadPromises = images.map(async (image) => {
            try {
                const buffer = await image.arrayBuffer();
                const base64Image = Buffer.from(buffer).toString('base64');

                return cloudinary.uploader.upload(`data:image/png;base64,${base64Image}`)
                    .then(resp => resp.secure_url);

            } catch (error) {
                console.log(error)
                return null;
            }
        })

        const uploadedImages = await Promise.all(uploadPromises);
        return uploadedImages;

    } catch (error) {
        console.log(error)
        return null;
    }

}