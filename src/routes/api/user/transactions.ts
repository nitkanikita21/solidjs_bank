import { Prisma, User } from '@prisma/client';
import { getSession } from '@solid-mediakit/auth';
import { APIEvent, json } from 'solid-start';
import { authOptions, prisma } from '~/server/auth';
import { safeUserValidator } from './[id]';
import { type } from 'os';
import { safeCardValidator } from '../card/[id]';
import { TransactionWithSafeCards, transactionWithSafeCardsValidator } from '../transaction/[id]';

export async function getUserTransactions(id: string) {
    const transactions = await prisma.transaction.findMany({
        where: {
            toCard: {
                ownerId: id,
            },
            OR: [
                {
                    toCard: {
                        ownerId: id,
                    },
                },
            ],
        },
        ...transactionWithSafeCardsValidator,
    });
    return transactions as TransactionWithSafeCards[];
}

export async function GET({ request }: APIEvent) {
    const session = await getSession(request, authOptions);

    console.log(session);

    return json(await getUserTransactions(session!!.user.id));
}
