# Descripcion

## Correr en Dev

1. Clonar el repositorio.
2. Levantar la base de datos.
    - Para el levantamiento de la base de datos (Postgres), se ha usado un sistema cloud gratuito.
      En este caso, se ha usado [Vercel](https://vercel.com). De aqui puedes obtener las variables
      de entorno que usa el archivo `.env`.
3. Crear una copia del archivo `.env-template` y renombrarlo como `.env` y cambiar las variables de
   entorno.
4. Instalar dependencias `npm install`.
5. Correr las migraciones de Prima `npx prisma migrate dev`.
6. Ejecutar seed para cargar data inicial en la base `npm run seed`.
7. Correr el proyecto `npm run dev`.

## Correr en Prod
