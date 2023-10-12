import { JSX, Show } from 'solid-js';
import { AiFillCreditCard } from 'solid-icons/ai';
import { AiFillHome } from 'solid-icons/ai';
import { AiOutlineUser } from 'solid-icons/ai';
import { FiBox } from 'solid-icons/fi';
import { AiOutlineInfoCircle } from 'solid-icons/ai';
import { FaSolidMapLocationDot } from 'solid-icons/fa';
import { createSession, signOut } from '@solid-mediakit/auth/client';
import { AiOutlineTransaction } from 'solid-icons/ai';

export default function (props: { children: JSX.Element }) {
    const session = createSession();

    return (
        <div class="flex flex-row">
            <nav class="drawer drawer-open">
                <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
                <div class="drawer-content">{props.children}</div>
                <div class="drawer-side">
                    <div class="sticky top-0 z-10 flex flex-row items-center gap-2 bg-opacity-90 px-4 py-2 pt-4 backdrop-blur">
                        <Show when={session()}>
                            <div class="avatar px-2">
                                <div class="w-12 rounded-full">
                                    <img src={session()!!.user.image!!} />
                                </div>
                            </div>
                            <div class="text-lg font-bold">{session()!!.user.name!!}</div>
                        </Show>
                    </div>
                    <ul class="menu min-h-full w-80 p-4 text-base-content">
                        <li>
                            <a class="font-bold" href="/">
                                <FiBox class="text-secondary" size={24} />
                                На головну
                            </a>
                        </li>

                        <li></li>
                        <li class="menu-title flex flex-row items-center gap-4">
                            <span>
                                <AiFillHome class="text-secondary" size={24} />
                            </span>
                            <span>Ваш кабінет</span>
                        </li>
                        <li>
                            <a href="/protected" class="font-bold">
                                <AiOutlineUser size={24} /> Ваш профіль
                            </a>
                        </li>
                        <li>
                            <a href="/protected/cards" class="font-bold">
                                <AiFillCreditCard size={24} /> Картки
                            </a>
                        </li>
                        <li>
                            <a href="/protected/transactions" class="font-bold">
                                <AiOutlineTransaction size={24} /> Транзакції
                            </a>
                        </li>

                        <li></li>
                        <li class="menu-title flex flex-row items-center gap-4">
                            <span>
                                <AiOutlineInfoCircle class="text-secondary" size={24} />
                            </span>
                            <span>Інформація</span>
                        </li>
                        <li>
                            <a href="/protected/info/points" class="font-bold">
                                <FaSolidMapLocationDot size={24} /> Філіали
                            </a>
                        </li>

                        <li></li>
                        <li class="menu-title flex flex-row items-center gap-4">
                            <span>
                                <AiOutlineUser class="text-secondary" size={24} />
                            </span>
                            <span>Аккаунт</span>
                        </li>
                        <li>
                            <button
                                class="font-bold"
                                onClick={() => signOut({ redirect: true, redirectTo: '/' })}
                            >
                                <FiBox class="text-error" size={24} />
                                Вийти з аккаунту
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    );
}
