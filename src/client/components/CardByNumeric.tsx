import axios from 'axios';
import { FaSolidDiamond } from 'solid-icons/fa';
import { Accessor, Setter, Show, Suspense, createEffect, createResource } from 'solid-js';
import { Card } from '@prisma/client';
import CardComponent from './CardComponent';
import { fetchCardByNumber } from '../fetchers/card';
import { SafeCardWithOwner } from '~/routes/api/card/[id]';

export default function (props: {
    cardNumber: Accessor<string | null>;
    cardSetter: Setter<SafeCardWithOwner | undefined | null>;
    class?: string;
}) {
    const [toCardData] = createResource(props.cardNumber, fetchCardByNumber);
    createEffect(() => {
        props.cardSetter(toCardData());
    });
    return (
        <>
            <Show when={toCardData()} fallback={<div class="h-40 w-80"></div>}>
                <Suspense>
                    <CardComponent data={toCardData()!!} type="other" class={props.class} />
                </Suspense>
            </Show>
        </>
    );
}
