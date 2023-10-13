import { Card, User } from '@prisma/client';
import axios from 'axios';
import { FaSolidDiamond } from 'solid-icons/fa';
import { Show, Suspense, createMemo, createResource, createSignal } from 'solid-js';
import { AiOutlineLink } from 'solid-icons/ai';
import { twMerge } from 'tailwind-merge';
import CopyButton from './CopyButton';
import { AiOutlineCopy } from 'solid-icons/ai';
import { SafeCardWithOwner } from '~/routes/api/card/[id]';
import { FullCardWithUserData } from '~/routes/api/user/cards';

const fetchOwnerById = async (numbers: string) => {
    return (await axios.get(`http://localhost:3000/api/user/${encodeURI(numbers)}/info`))
        .data as User;
};

export const balanceFormat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    minimumFractionDigits: 2,
    currency: 'USD',
});

export default function (props: {
    data: SafeCardWithOwner | FullCardWithUserData;
    type: 'own' | 'other';
    class?: string;
}) {
    const separatedNumber = createMemo(() =>
        props.data!!.numericalId.replace(/(\d{4})(\d{4})(\d{4})/gm, '$1 $2 $3 ')
    );

    return (
        <div class={twMerge('card image-full aspect-[3.5/2] h-48 w-min shadow-xl', props.class)}>
            <Show when={props.data!!.image}>
                <figure>
                    <img
                        class="h-auto w-min select-none"
                        src={props.data!!.image!!}
                        alt="Card Background"
                    />
                </figure>
            </Show>
            <div class="card-body p-4">
                <h2 class="card-title">{props.data!!.name}</h2>
                <div class="flex flex-row items-center justify-between gap-0.5 font-mono text-xl">
                    <span class="select-all">{separatedNumber()}</span>
                    <div class="flex flex-row gap-2">
                        <CopyButton
                            tooltipText="Скопіювати посилання на переказ"
                            copyText={`http://localhost:3000/protected/transactions/new?to=${encodeURI(
                                props.data!!.numericalId
                            )}`}
                        >
                            <AiOutlineLink
                                class="transition-all duration-100 active:scale-90"
                                size={22}
                            />
                        </CopyButton>
                        <CopyButton
                            tooltipText="Скопіювати номер карти"
                            copyText={props.data!!.numericalId}
                        >
                            <AiOutlineCopy
                                class="transition-all duration-100 active:scale-90"
                                size={22}
                            />
                        </CopyButton>
                    </div>
                </div>
                <p class="select-all font-mono text-sm">{props.data!!.owner.name}</p>

                <Show when={props.type == 'own'}>
                    <div class="card-actions justify-between">
                        <div class="flex flex-row items-center gap-2 font-mono">
                            <span class="">
                                {new Date(
                                    (props.data as FullCardWithUserData)!!.createTime
                                ).toLocaleDateString()}
                            </span>
                        </div>
                        <div class="flex flex-row items-center gap-2 font-mono">
                            {balanceFormat.format((props.data as FullCardWithUserData)!!.balance)}
                        </div>
                    </div>
                </Show>
            </div>
        </div>
    );
}
