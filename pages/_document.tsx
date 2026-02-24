import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en" data-theme="dark">
            <Head>
                <meta
                    name="description"
                    content="Folio UI - Neo Brutalism SaaS Template"
                />
            </Head>
            <body className="bg-background text-base antialiased dark:bg-n-2 text-primary ">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
