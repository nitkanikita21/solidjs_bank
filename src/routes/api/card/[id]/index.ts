import { prisma } from '~/server/auth';
import { safeUserValidator } from '../../user/[id]';
import { Prisma } from '@prisma/client';
import { APIEvent, json } from 'solid-start';

export async function getCardById(cardId: string) {
    const card = await prisma.card.findUnique({
        where: { id: cardId },
        ...safeCardValidator,
    });
    return card!!;
}

export const safeCardValidator = Prisma.validator<Prisma.CardDefaultArgs>()({
    select: {
        name: true,
        id: true,
        image: true,
        numericalId: true,
        owner: safeUserValidator,
    },
});

export type SafeCardWithOwner = Prisma.PromiseReturnType<typeof getCardById>;

export async function GET({ params }: APIEvent) {
    const card = await getCardById(params.id);
    return json(card);
}
