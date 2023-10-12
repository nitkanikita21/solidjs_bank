import { JSX, createSignal } from 'solid-js';
import { twMerge } from 'tailwind-merge';

export default function (props: {
    copyText: string;
    tooltipText: string;
    class?: string;
    children: JSX.Element;
}) {
    const [showCopiedTooltip, setShowCopiedTooltip] = createSignal(false);
    const [timeoutVar, setTimeoutVar] = createSignal<any | undefined>(undefined);

    async function clickCopy() {
        setShowCopiedTooltip(true);
        if (timeoutVar()) {
            clearTimeout(timeoutVar());
        }
        const t = setTimeout(() => {
            setShowCopiedTooltip(false);
        }, 1500);
        setTimeoutVar(t);
        await navigator.clipboard.writeText(props.copyText);
    }

    return (
        <>
            <span
                onClick={clickCopy}
                class={twMerge(
                    'tooltip font-sans',
                    props.class,
                    showCopiedTooltip() ? 'tooltip-open tooltip-success' : 'tooltip-info'
                )}
                data-tip={showCopiedTooltip() ? 'Скопійовано в буффер' : props.tooltipText}
            >
                {props.children}
            </span>
        </>
    );
}
