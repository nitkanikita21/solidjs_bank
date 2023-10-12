import { Prisma } from '@prisma/client';
import { APIEvent, json } from 'solid-start';
import { prisma } from '~/server/auth';
import { SafeCardWithOwner, safeCardValidator } from '../../card/[id]';

export async function getUserSafeCards(ownerId: string) {
    const cards = await prisma.card.findMany({
        where: { ownerId: ownerId },
        ...safeCardValidator,
    });
    return cards!!;
}

export async function GET({ request, params }: APIEvent) {
    const id = params.id;
    const cards = (await getUserSafeCards(id!!)) as SafeCardWithOwner[];

    return json(cards);
}
