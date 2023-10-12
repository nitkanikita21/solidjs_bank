import { Show, onMount } from 'solid-js';
import { createSession, signIn } from '@solid-mediakit/auth/client';
import { redirect } from 'solid-start';

export default function () {
    const session = createSession();

    function login() {
        signIn('discord', {
            redirectTo: '/protected/',
        });
    }

    return (
        <>
            <div class="hero min-h-screen">
                <div class="hero-content text-center">
                    <div class="max-w-md">
                        <h1 class="text-5xl font-bold text-primary">Моно Бокс</h1>
                        <p class="py-6">Простий майнкрафт банк для майнкрафт проектів</p>
                        <Show
                            when={session()}
                            fallback={
                                <button class="btn btn-primary px-10" onClick={login}>
                                    Почати зараз
                                </button>
                            }
                        >
                            <a class="btn btn-neutral px-10" href="/protected">
                                Особистий кабінет
                            </a>
                        </Show>
                    </div>
                </div>
            </div>
        </>
    );
}
