import { Prisma, User } from '@prisma/client';
import { APIEvent, json } from 'solid-start';
import { authOptions, prisma } from '~/server/auth';
import { safeUserValidator } from './[id]';
import { type } from 'os';
import { getSession } from '@solid-mediakit/auth';

export async function getUserCards(id: string) {
    const user = await prisma.card.findMany({
        where: { ownerId: id },
        include: {
            owner: true,
        },
    });
    return user!!;
}

export type FullCardWithUserData = Prisma.Result<
    typeof prisma.card,
    {
        include: {
            owner: true;
        };
    },
    'findFirst'
>;

export async function GET({ request }: APIEvent) {
    const session = await getSession(request, authOptions);

    console.log(session);

    return json(await getUserCards(session!!.user.id));
}
