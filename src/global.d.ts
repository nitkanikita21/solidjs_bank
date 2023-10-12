/// <reference types="solid-start/env" />

import { JWT } from '@auth/core/jwt';
import { DefaultSession, User } from '@auth/core/types';
import { Role } from '@prisma/client';

declare module '@auth/core/types' {
    interface Session {
        user: {
            role: Role;
            id: string;
        } & DefaultSession['user'];
        accessToken: string;
    }
    interface User {
        role: Role;
        id: string;
    }
}
declare module '@auth/core/jwt' {
    interface JWT {
        role: Role;
        id: string;
        accessToken: string;
    }
}
