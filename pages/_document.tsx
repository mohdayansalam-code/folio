import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en" data-theme="dark">
            <Head>
                <meta
                    name="description"
                    content="Folio UI - Neo Brutalism SaaS Template"
                />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                        try {
                            var stored = localStorage.getItem("theme");
                            if (stored) {
                                document.documentElement.setAttribute("data-theme", stored);
                            } else {
                                var pre = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
                                document.documentElement.setAttribute("data-theme", pre);
                            }
                        } catch (e) {}
                        `,
                    }}
                />
            </Head>
            <body className="bg-background text-base antialiased dark:bg-n-2 text-primary ">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
