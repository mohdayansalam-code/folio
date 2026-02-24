import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const PageLoader = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleStart = (url: string) => {
            if (url !== router.asPath) setIsLoading(true);
        };
        const handleComplete = () => setIsLoading(false);

        router.events.on("routeChangeStart", handleStart);
        router.events.on("routeChangeComplete", handleComplete);
        router.events.on("routeChangeError", handleComplete);

        return () => {
            router.events.off("routeChangeStart", handleStart);
            router.events.off("routeChangeComplete", handleComplete);
            router.events.off("routeChangeError", handleComplete);
        };
    }, [router.asPath, router.events]);

    if (!isLoading) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-1 z-[100] bg-n-2 dark:bg-n-1 overflow-hidden">
            <div className="absolute top-0 left-0 h-full w-1/3 bg-purple-1 rounded-r-full animate-loader"></div>
            <style jsx>{`
                @keyframes loader {
                    0% { transform: translateX(-100%); width: 0; }
                    50% { width: 50%; opacity: 1; }
                    100% { transform: translateX(300%); width: 0; opacity: 0; }
                }
                .animate-loader {
                    animation: loader 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                }
            `}</style>
        </div>
    );
};

export default PageLoader;
