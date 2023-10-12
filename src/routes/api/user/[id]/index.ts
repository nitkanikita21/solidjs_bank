import { Prisma } from '@prisma/client';
import { APIEvent, json } from 'solid-start';
import { prisma } from '~/server/auth';

export async function getUserById(id: string) {
    const user = await prisma.user.findUnique({
        where: { id: id },
        ...safeUserValidator,
    });
    return user!!;
}

export type SafeUser = Prisma.PromiseReturnType<typeof getUserById>;
export const safeUserValidator = Prisma.validator<Prisma.UserDefaultArgs>()({
    select: {
        name: true,
        id: true,
        image: true,
        role: true,
    },
});
export async function GET({ request, params }: APIEvent) {
    const id = params.id;
    const user = await getUserById(id!!);

    return json(user);
}
