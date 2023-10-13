import ProtectedPage from '~/client/layouts/ProtectedPage';
import { AiOutlinePlus } from 'solid-icons/ai';
import { createSession } from '@solid-mediakit/auth/client';
import {
    For,
    Show,
    Suspense,
    createEffect,
    createMemo,
    createResource,
    createSignal,
} from 'solid-js';
import axios from 'axios';
import CardByNumeric from '~/client/components/CardByNumeric';
import { redirect, useNavigate, useParams, useRouteData, useSearchParams } from 'solid-start';
import { Card } from '@prisma/client';
import CardComponent from '~/client/components/CardComponent';
import { FaSolidArrowRightLong } from 'solid-icons/fa';
import { twMerge } from 'tailwind-merge';
import { BiRegularError } from 'solid-icons/bi';
import { AiOutlineCheck } from 'solid-icons/ai';
import { fetchCardsBySession } from '~/client/fetchers/card';
import { SafeCardWithOwner } from '~/routes/api/card/[id]';
import { createServerData$ } from 'solid-start/server';
import { getSession } from '@solid-mediakit/auth';
import { getUserCards } from '~/routes/api/user/cards';
import { authOptions } from '~/server/auth';
import { TransactionDataPayload } from '~/routes/api/transaction/new/transfer';
import { TransactionModel } from 'prisma/zod';

/* export function routeData() {
    return createServerData$(async (_, { request }) => {
        const session = await getSession(request, authOptions)
        return await getUserCards(session!!.user.id)
    });
} */

export function routeData() {
    return createServerData$(async (_, { request }) => {
        return await request.headers.get('Cookie');
    });
}

export default function () {
    const navigate = useNavigate();

    const [params] = useSearchParams();

    const session = createSession();

    console.log('session', session());

    if (!session()) return <></>;
    const cookies = useRouteData<typeof routeData>();
    const [cards] = createResource(cookies, fetchCardsBySession);
    if (!cards()) return <></>;

    const [cardId, setCardId] = createSignal(cards()!![0]!!.id);
    const card = createMemo(() => cards()!!.find((c) => c!!.id == cardId()));

    const [targetCardNumber, setTargetCardNumber] = createSignal<string | null>(
        params.to ? decodeURI(params.to) : null
    );
    const [targetCard, setTargetCard] = createSignal<SafeCardWithOwner | undefined | null>(
        undefined
    );

    const [summ, setSumm] = createSignal<number>(NaN);
    const [comment, setComment] = createSignal<string | undefined>(params.comment);

    const errorMsg = createMemo<string | null>(() => {
        if (!summ()) return 'Не вказана сумма переказу';
        if (summ()!! < 60) return 'Мінімальна сума переказу: 60';
        if (card()!!.balance - summ() < 0) return 'Не достатньо коштів';
        if (!targetCard()) return 'Не вказана карта для переказу';

        return null;
    });

    /* const allowSend = createMemo<boolean>(() => {
        return targetCard() != null && card() != null && !Number.isNaN(summ())
    }) */

    function createTransaction() {
        console.log('aboba');
        axios
            .post(
                '/api/transaction/new/transfer',
                TransactionModel.parse({
                    reason: `Переказ коштів на карту ${targetCard()!!.numericalId
                        } користувачем ${session()?.user!!.name} з карти ${card()!!.numericalId}`,
                    summ: summ(),
                    fromCardId: cardId(),
                    toCardId: targetCard()?.id,
                    type: 'TRANSFER',
                    comment: comment(),
                } as TransactionDataPayload),
                { headers: { cookies: cookies() } }
            )
            .catch((e) => console.log(e))
            .finally(() => {
                navigate('/protected/transactions/', { replace: true });
            });
    }

    return (
        <>
            <ProtectedPage>
                <main class="pr-16 pt-16">
                    <div class="flex flex-row items-center justify-between">
                        <h1 class="text-4xl font-bold">Нова транзація</h1>
                        <button
                            class={twMerge(
                                'btn btn-primary gap-2',
                                errorMsg() ? 'btn-disabled' : ''
                            )}
                            onClick={createTransaction}
                        >
                            Переказати
                            <FaSolidArrowRightLong size={24} />
                        </button>
                    </div>
                    <div class="divider"></div>
                    <div class="flex flex-col items-center gap-3">
                        <div>
                            <Show when={errorMsg()}>
                                <div class="flex flex-row items-center gap-2 font-bold text-error">
                                    <BiRegularError size={24} /> {errorMsg()}
                                </div>
                            </Show>
                            <Show when={!errorMsg()}>
                                <div class="flex flex-row items-center gap-2 font-bold text-success">
                                    <AiOutlineCheck size={22} /> Настисніть кнопку для переказу
                                    коштів
                                </div>
                            </Show>
                        </div>
                        <div class="join">
                            <select
                                class="select join-item select-bordered"
                                onChange={(e) => {
                                    setCardId(e.target.value.replace(' ', ''));
                                }}
                            >
                                <Suspense>
                                    <Show when={cards()}>
                                        <For each={cards()}>
                                            {(card) => (
                                                <option value={card!!.id}>
                                                    {card!!.numericalId.replace(
                                                        /(\d{4})(\d{4})(\d{4})/gm,
                                                        '$1 $2 $3 '
                                                    )}
                                                </option>
                                            )}
                                        </For>
                                    </Show>
                                </Suspense>
                            </select>
                            <input
                                onInput={(e) => {
                                    const s = e.target.valueAsNumber;
                                    setSumm(s);
                                }}
                                min="0"
                                step="1"
                                pattern="[0-9]"
                                value={summ()}
                                type="number"
                                class="input join-item input-bordered"
                                placeholder="Сумма"
                            />
                            <input
                                type="text"
                                placeholder="Номер карти"
                                class="input join-item input-bordered"
                                onInput={(e) =>
                                    setTargetCardNumber(
                                        e.target.value.replace(/[ \D]/gm, '').slice(0, 16)
                                    )
                                }
                                value={targetCardNumber()!!}
                            />
                        </div>
                        <textarea
                            class="textarea textarea-bordered w-96"
                            placeholder="Коментар"
                            onInput={(e) => setComment(e.target.value)}
                            value={comment() ?? ''}
                        ></textarea>
                    </div>
                    <div class="my-5 grid grid-flow-col grid-cols-2 items-center gap-5 px-32">
                        <div class="flex flex-col items-start">
                            {/* <h2 class="text-2xl mb-4 max-w-xs">Ваша карта</h2> */}
                            <Suspense>
                                <Show when={card()}>
                                    <CardComponent data={card()!!} type="own" />
                                </Show>
                            </Suspense>
                        </div>
                        <div class="flex flex-col items-end">
                            <Suspense>
                                <Show when={targetCardNumber()}>
                                    {/* <h2 class="text-2xl mb-4 max-w-xs">Вказана карта</h2> */}
                                    <CardByNumeric
                                        cardNumber={targetCardNumber}
                                        cardSetter={setTargetCard}
                                    />
                                </Show>
                            </Suspense>
                        </div>
                    </div>
                </main>
            </ProtectedPage>
        </>
    );
}
