import { AiOutlineInfoCircle } from 'solid-icons/ai';
import { Accessor, For, Resource, Show, Suspense, createEffect, createResource } from 'solid-js';
import { authOptions } from '~/server/auth';
import { createRouteData, useRouteData } from 'solid-start';
import axios from 'axios';
import { getSession } from '@solid-mediakit/auth';
import { createSession } from '@solid-mediakit/auth/client';
import { createServerData$ } from 'solid-start/server';
import { Session } from 'inspector';
import ProtectedPage from '~/client/layouts/ProtectedPage';
import { Card } from '@prisma/client';
import CardComponent from '~/client/components/CardComponent';
import { fetchCardsBySession } from '~/client/fetchers/card';
import { getUserCards } from '../api/user/cards';

export function routeData() {
    return createServerData$(async (_, { request }) => {
        const session = await getSession(request, authOptions);
        return await getUserCards(session!!.user.id);
    });
}

export default function () {
    const session = createSession();
    if (!session()) return <></>;

    const cards = useRouteData<typeof routeData>();

    console.log('cardsData', cards());

    return (
        <>
            <ProtectedPage>
                <main class="pr-16 pt-16">
                    <h1 class="text-4xl font-bold">Ваші картки</h1>
                    <div class="divider"></div>

                    <Suspense>
                        <Show when={cards()}>
                            <div class="grid w-fit grid-cols-1 items-center gap-2 lg:grid-cols-2">
                                <For each={cards() ?? []}>
                                    {(card) => <CardComponent data={card} type="own" />}
                                </For>
                            </div>
                        </Show>
                    </Suspense>
                    <Show when={!cards()}>
                        <div class="alert">
                            <AiOutlineInfoCircle size={24} class="fill-sky-400" />
                            <div>
                                <span>У вас немає жодної картки</span>
                                <div class="text-xs">Ви можете оформити картку у філіалі банку</div>
                            </div>
                            <a href="/protected/info/points" class="btn btn-primary btn-sm">
                                Переглянути пункти
                            </a>
                        </div>
                    </Show>

                    {/* <div class="flex flex-row w-full justify-between">
                    <Card /> <Card /> <Card />
                </div> */}
                </main>
            </ProtectedPage>
        </>
    );
}
