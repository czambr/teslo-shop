'use server';

import { revalidate } from "@/app/(shop)/page";
import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";


export const changeUserRole = async (userId: string, role: string) => {

    const sessin = await auth()
    if (sessin?.user.role !== 'admin') {
        return {
            ok: false,
            message: 'Debe estar autenticado como admin '
        }
    }

    try {
        const newRole = role === 'admin' ? 'admin' : 'user';
        const user = await prisma.user.update({
            where: { id: userId },
            data: { role: newRole }
        })

        revalidatePath('/admin/users')
        return {
            ok: true,
            user: user
        }

    } catch (error) {
        console.log(error)
        return {
            ok: false,
            message: 'No se pudo actualzir el role, revisar logs'
        }
    }



}