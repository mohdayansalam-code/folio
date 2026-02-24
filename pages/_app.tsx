import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { useTheme } from "@/hooks/useTheme";
import ErrorBoundary from "@/components/ErrorBoundary";
import PageLoader from "@/components/PageLoader";
import { ToastProvider } from "@/components/Toast";
import { AuthProvider } from "@/context/AuthProvider";
import "@/styles/app.css";

const inter = Inter({
    weight: ["400", "500", "600", "700", "800"],
    subsets: ["latin"],
    display: "block",
    variable: "--font-roboto",
});

export default function App({ Component, pageProps }: AppProps) {
    useTheme();

    return (
        <ErrorBoundary>
            <AuthProvider>
                <ToastProvider>
                    <main className={`${inter.variable} font-sans`}>
                        <PageLoader />
                        <Component {...pageProps} />
                    </main>
                </ToastProvider>
            </AuthProvider>
        </ErrorBoundary>
    );
}
