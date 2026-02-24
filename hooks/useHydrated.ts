import { useState, useEffect } from "react";

export const useHydrated = () => {
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return { mounted };
};
