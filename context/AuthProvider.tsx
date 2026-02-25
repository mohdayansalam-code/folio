import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

type AuthContextType = {
    session: any;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    session: null,
    loading: true,
});

// -- Singleton Auth State System --
let globalSession: any = null;
let globalLoading = true;
let isInitialized = false;

const subscribers = new Set<(session: any, loading: boolean) => void>();

const notifySubscribers = () => {
    subscribers.forEach((sub) => sub(globalSession, globalLoading));
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<any>(globalSession);
    const [loading, setLoading] = useState<boolean>(globalLoading);

    useEffect(() => {
        const updateState = (newSession: any, newLoading: boolean) => {
            setSession(newSession);
            setLoading(newLoading);
        };

        // Attach strictly on mount to receive future updates
        subscribers.add(updateState);

        if (!isInitialized) {
            isInitialized = true;

            // 1. Fetch exactly once across the whole JS execution context
            supabase.auth.getSession().then(({ data: { session }, error }) => {
                if (error) {
                    console.error("Auth initialization error:", error);
                }
                globalSession = session || null;
                globalLoading = false;
                notifySubscribers();
            });

            // 2. Attach observer exactly once across the whole JS execution context
            supabase.auth.onAuthStateChange((_event, authSession) => {
                globalSession = authSession || null;
                globalLoading = false;
                notifySubscribers();
            });
        } else {
            // Already initialized (e.g., Strict Mode second render)
            // Immediately sync state since initial setup might have missed our subscription
            updateState(globalSession, globalLoading);
        }

        return () => {
            subscribers.delete(updateState);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ session, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
