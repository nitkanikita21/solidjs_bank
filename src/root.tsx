// @refresh reload
import {
    A,
    Body,
    ErrorBoundary,
    FileRoutes,
    Head,
    Html,
    Meta,
    Routes,
    Scripts,
    Title,
} from 'solid-start';
import './root.css';
import { Suspense } from 'solid-js';
import { SessionProvider } from '@solid-mediakit/auth/client';

export default function Root() {
    return (
        <Html lang="en" data-theme="forest">
            <Head>
                <Title>SolidStart + AuthJS</Title>
                <Meta charset="utf-8" />
                <Meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Body>
                <SessionProvider>
                    <Suspense>
                        <ErrorBoundary>
                            <Routes>
                                <FileRoutes />
                            </Routes>
                        </ErrorBoundary>
                    </Suspense>
                </SessionProvider>
                <Scripts />
            </Body>
        </Html>
    );
}
