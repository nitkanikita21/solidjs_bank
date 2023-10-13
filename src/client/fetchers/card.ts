import { Session } from '@auth/core/types';
import axios from 'axios';
import { SafeCardWithOwner } from '~/routes/api/card/[id]';
import { FullCardWithUserData } from '~/routes/api/user/cards';

export const fetchCardByNumber = async (number: string) => {
    /* return (await axios.get(`http://localhost:3000/api/card/${encodeURI(number)}/byNumber/`))
        .data as SafeCardWithOwner; */

    const data = await fetch(`/api/card/${encodeURI(number)}/byNumber/`);
    return (await data.json()) as SafeCardWithOwner;
};
export const fetchCardById = async (id: string) => {
    const data = await fetch(`${process.env.BASE_URL}/api/card/${encodeURI(id)}/`);
    return (await data.json()) as SafeCardWithOwner;
};
export const fetchCardsBySession = async (cookies: string) => {
    /* const data = (await (
        await fetch(`http://localhost:3000/api/user/cards/`, {
            method: 'GET',
            headers: {
                Cookie: cookies,
            },
        })
    ).json()) as FullCardWithUserData[]; */

    const data = await fetch(`${process.env.BASE_URL}/api/user/cards/`, {
        method: 'GET',
        headers: {
            Cookie: cookies,
        },
    });
    return (await data.json()) as FullCardWithUserData[];
};
