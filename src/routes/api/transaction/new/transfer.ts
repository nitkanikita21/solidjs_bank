import { Prisma } from '@prisma/client';
import { getSession } from '@solid-mediakit/auth';
import { APIEvent, json } from 'solid-start';
import { authOptions, prisma } from '~/server/auth';

export type TransactionDataPayload = Prisma.Args<typeof prisma.transaction, 'create'>['data'];

export async function createTransferTransaction(data: TransactionDataPayload) {
    await prisma.$transaction([
        prisma.transaction.create({
            data: {
                ...data,
            },
        }),
        prisma.card.update({
            where: {
                id: data.fromCardId,
            },
            data: {
                balance: {
                    decrement: data.summ,
                },
            },
        }),
        prisma.card.update({
            where: {
                id: data.toCardId!!,
            },
            data: {
                balance: {
                    increment: data.summ,
                },
            },
        }),
    ]);
}

export async function POST({ request }: APIEvent) {
    const session = await getSession(request, authOptions);

    if (session?.user == null) return json({});

    const body = (await request.json()) as TransactionDataPayload;

    createTransferTransaction(body);

    return json({});
}
