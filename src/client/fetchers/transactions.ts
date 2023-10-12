import { Session } from '@auth/core/types';
import axios from 'axios';
import { TransactionWithSafeCards } from '~/routes/api/transaction/[id]';

export const fetchTransactionsBySession = async (cookies: string) => {
    /* return (
        await axios.get(`/api/user/transactions`, {
            headers: { Cookie: cookies },
            withCredentials: true,
        })
    ).data as TransactionWithSafeCards[]; */

    const data = await fetch(
        `/api/user/transactions`,
        {
            method: 'GET',
            headers: {
                Cookie: cookies,
            }
        }
    )
    return await data.json() as TransactionWithSafeCards[]
};
