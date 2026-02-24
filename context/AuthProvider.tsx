import { createContext, useContext, useEffect, useState, useRef } from "react";
import { supabase } from "@/utils/supabase";

type AuthContextType = {
    session: any;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    session: null,
    loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const initRef = useRef(false);

    useEffect(() => {
        let mounted = true;

        const init = async () => {
            try {
                const { data, error } = await supabase.auth.getSession();
                if (error) throw error;
                if (mounted) {
                    setSession(data.session);
                }
            } catch (error) {
                console.error("Auth initialization error:", error);
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        if (!initRef.current) {
            initRef.current = true;
            init();
        }

        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                if (mounted) {
                    setSession(session);
                    setLoading(false);
                }
            }
        );

        return () => {
            mounted = false;
            listener.subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ session, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
