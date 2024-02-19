import prisma from '../lib/prisma';
import { initialData } from './seed';
import { countries } from './seed-countries';

async function main() {
    // ===> Borrado de registros privos
    await prisma.userAddress.deleteMany();
    await prisma.user.deleteMany();
    await prisma.country.deleteMany();

    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();

    // ===> Initial Data
    const { categories, products, users } = initialData;

    // ===> Insersion de users
    await prisma.user.createMany({
        data: users,
    });

    // ===> Insersion de paises
    await prisma.country.createMany({
        data: countries,
    });

    // ===> Insersion de categorias
    const categoriesData = categories.map(category => ({
        name: category,
    }));
    await prisma.category.createMany({
        data: categoriesData,
    });

    // ===> Obtenecion de IDs de categorias
    const categoriesDB = await prisma.category.findMany();
    const categoriesMap = categoriesDB.reduce((map, category) => {
        map[category.name.toLowerCase()] = category.id;
        return map;
    }, {} as Record<string, string>); //<string=TypeCategory, string=categoryId>

    // ===> Insersion de productos e imagenes
    products.forEach(async prodcut => {
        const { type, images, ...rest } = prodcut;
        const dbProduct = await prisma.product.create({
            data: {
                ...rest,
                categoryId: categoriesMap[type],
            },
        });

        const imagesData = images.map(image => ({
            url: image,
            productId: dbProduct.id,
        }));
        await prisma.productImage.createMany({
            data: imagesData,
        });
    });

    console.log('Seed Ejecutado Correctamente');
}

(() => {
    if (process.env.NODE_ENV === 'production') return;
    main();
})();
