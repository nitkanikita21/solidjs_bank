import { getSession } from '@solid-mediakit/auth';
import { redirect } from 'solid-start';
import { createHandler, renderAsync, StartServer } from 'solid-start/entry-server';
import { authOptions } from './server/auth';
import { Role } from '@prisma/client';
import axios from 'axios';

interface RoleProtectedRoute {
    role: Role;
    redirectTo: string;
}

const protectedPaths = ['/protected']; // add any route you wish in here
const roleRequiredPages: { [key: string]: RoleProtectedRoute } = {
    '/protected/operates.{0,}': {
        role: 'OPERATOR',
        redirectTo: '/protected',
    },
};

export default createHandler(
    ({ forward }) => {
        return async (event) => {
            const path = new URL(event.request.url).pathname;
            if (protectedPaths.includes(path)) {
                const session = await getSession(event.request, authOptions);
                if (!session) {
                    return redirect('/'); // a page for a non logged in user
                }
                for (const key in roleRequiredPages) {
                    if (RegExp(key).test(path)) {
                        redirect(roleRequiredPages[key].redirectTo);
                        break;
                    }
                }
            }
            return forward(event); // if we got here, and the pathname is inside the `protectedPaths` array - a user is logged in
        };
    },
    renderAsync((event) => <StartServer event={event} />)
);
