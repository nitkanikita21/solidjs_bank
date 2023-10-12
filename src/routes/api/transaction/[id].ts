import { Prisma } from '@prisma/client';
import { APIEvent, json } from 'solid-start';
import { prisma } from '~/server/auth';
import { SafeCardWithOwner, safeCardValidator } from '../card/[id]';

export type TransactionWithSafeCards = Prisma.PromiseReturnType<typeof getTransactionById>;
export const transactionWithSafeCardsValidator = Prisma.validator<Prisma.TransactionDefaultArgs>()({
    select: {
        id: true,
        fromCard: safeCardValidator,
        toCard: safeCardValidator,
        reason: true,
        summ: true,
        type: true,
        comment: true,
        date: true
    },
});

export async function getTransactionById(id: string) {
    const transaction = await prisma.transaction.findUnique({
        where: { id: id },
        ...transactionWithSafeCardsValidator,
    });
    return transaction!!;
}

export async function GET({ request, params }: APIEvent) {
    const id = params.id;
    const transaction = (await getTransactionById(id!!)) as TransactionWithSafeCards;
    console.log('BACK TR', transaction);

    return json(transaction);
}
