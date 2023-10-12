import { createSession } from '@solid-mediakit/auth/client';
import { Show } from 'solid-js';
import ProtectedPage from '~/client/layouts/ProtectedPage';

export default function () {
    const session = createSession();

    return (
        <>
            <ProtectedPage>
                <main class="pr-16 pt-16">
                    <Show when={!session.loading}>
                        <h1>ROLE: {session()?.user.role}</h1>
                    </Show>
                </main>
            </ProtectedPage>
        </>
    );
}
