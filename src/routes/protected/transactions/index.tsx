import ProtectedPage from '~/client/layouts/ProtectedPage';
import { AiOutlinePlus } from 'solid-icons/ai';
import axios from 'axios';
import { Accessor, For, Match, Resource, Suspense, Switch, createResource } from 'solid-js';
import { createSession } from '@solid-mediakit/auth/client';
import { FaSolidMoneyBillTransfer } from 'solid-icons/fa';
import { AiFillBank } from 'solid-icons/ai';
import { balanceFormat } from '~/client/components/CardComponent';
import { fetchTransactionsBySession } from '~/client/fetchers/transactions';
import { createServerData$ } from 'solid-start/server';
import { getSession } from '@solid-mediakit/auth';
import { getUserTransactions } from '~/routes/api/user/transactions';
import { authOptions } from '~/server/auth';
import { useRouteData } from 'solid-start';
import { TransactionWithSafeCards } from '~/routes/api/transaction/[id]';
import { Session } from '@auth/core/types';

/* export function routeData() {
    return createServerData$(async (_, { request }) => {
        const session = await getSession(request, authOptions);
        return await getUserTransactions(session!!.user.id);
    });
} */

export function routeData() {
    return createServerData$(async (_, { request }) => {
        return await request.headers.get('Cookie');
    });
}

export default function () {
    const session = createSession();
    const cookies = useRouteData<typeof routeData>();
    const [transactions] = createResource(cookies, fetchTransactionsBySession)

    console.log('transactions', transactions());

    return (
        <>
            <ProtectedPage>
                <main class="pr-16 pt-16">
                    <div class="flex flex-row items-center justify-between">
                        <h1 class="text-4xl font-bold">Ваші транзакції</h1>
                        <a href="/protected/transactions/new" class="btn btn-primary">
                            <AiOutlinePlus size={24} />
                            Нова транзакція
                        </a>
                    </div>
                    <div class="divider"></div>

                    <div class="overflow-y-auto">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Тип</th>
                                    <th>Відовості</th>
                                    <th>Дата</th>
                                    <th>Коментар</th>
                                </tr>
                            </thead>
                            <tbody>
                                <Suspense>
                                    <For each={transactions()}>
                                        {(transaction) => (
                                            <TransactionTableRow
                                                data={transaction}
                                                session={session}
                                            />
                                        )}
                                    </For>
                                </Suspense>
                            </tbody>
                        </table>
                    </div>
                </main>
            </ProtectedPage>
        </>
    );
}

function TransactionTableRow(props: {
    data: TransactionWithSafeCards;
    session: Resource<Session | null>;
}) {
    const transaction = props.data;
    const session = props.session;
    return (
        <>
            <tr>
                <td>
                    <div class='flex justify-center'>
                        <Switch>
                            <Match when={transaction!!.type == 'TRANSFER'}>
                                <FaSolidMoneyBillTransfer
                                    size={32}
                                />
                            </Match>
                            <Match when={transaction!!.type == 'SYSTEM'}>
                                <AiFillBank size={32} />
                            </Match>
                        </Switch>
                    </div>
                </td>
                <td>
                    <div class='flex justify-center'>
                        <Switch>
                            <Match when={transaction!!.fromCard.owner.id == transaction!!.toCard?.owner.id}>
                                <div class="font-bold text-blue-500">
                                    {balanceFormat.format(transaction!!.summ)}
                                </div>
                            </Match>
                            <Match when={transaction!!.fromCard.owner.id == session()?.user.id}>
                                <div class="font-bold text-error">
                                    - {balanceFormat.format(transaction!!.summ)}
                                </div>
                            </Match>
                            <Match when={transaction!!.toCard?.owner.id == session()?.user.id}>
                                <div class="font-bold text-success">
                                    + {balanceFormat.format(transaction!!.summ)}
                                </div>
                            </Match>
                        </Switch>
                    </div>
                </td>
                <td>
                    <Switch>
                        <Match when={transaction!!.type == 'TRANSFER'}>
                            <div class="font-extrabold">Переказ коштів</div>
                        </Match>
                        <Match when={transaction!!.type == 'SYSTEM'}>
                            <div class="font-extrabold">Системне зняття</div>
                        </Match>
                    </Switch>
                    <div class="text-sm opacity-50">{transaction!!.reason}</div>
                </td>
                <td>
                    <div class="text-sm opacity-50">{new Date(transaction!!.date).toLocaleString()}</div>
                </td>
                <td>
                    <div class="text-sm opacity-50">{transaction!!.comment ?? "Відсутній"}</div>
                </td>
            </tr>
        </>
    );
}
