import { createContext, useContext, useState, ReactNode } from "react";
import Icon from "@/components/Icon";

type ToastType = "success" | "error" | "info";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within ToastProvider");
    return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (message: string, type: ToastType = "success") => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`flex items-center px-4 py-3 rounded-xl shadow-primary-4 bg-n-1 dark:bg-n-2 border border-n-1 dark:border-white/10 text-sm font-bold animate-fade-in pointer-events-auto ${toast.type === "success" ? "text-green-1" : toast.type === "error" ? "text-pink-1" : "text-n-7 "
                            }`}
                    >
                        <Icon
                            className={`icon-20 mr-3 ${toast.type === "success" ? "fill-green-1" : toast.type === "error" ? "fill-pink-1" : "fill-n-7 dark:fill-n-1"}`}
                            name={toast.type === "success" ? "check" : toast.type === "error" ? "close-circle" : "info"}
                        />
                        {toast.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
