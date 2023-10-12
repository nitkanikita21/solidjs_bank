import { prisma } from '~/server/auth';
import { Prisma } from '@prisma/client';
import { APIEvent, json } from 'solid-start';
import { safeUserValidator } from '../../user/[id]';
import { safeCardValidator } from '../[id]';

export async function getCardByNumber(number: string) {
    const card = await prisma.card.findUnique({
        where: { numericalId: number },
        ...safeCardValidator,
    });
    return card!!;
}

export async function GET({ params }: APIEvent) {
    const card = await getCardByNumber(params.number);
    return json(card);
}
