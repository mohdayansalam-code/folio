import React, { Component, ErrorInfo, ReactNode } from "react";
import Icon from "@/components/Icon";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center min-h-screen bg-background dark:bg-n-2 p-6 font-sans text-n-7 ">
                    <div className="card shadow-primary-4 p-12 text-center max-w-lg w-full">
                        <div className="w-16 h-16 rounded-full bg-pink-1/20 flex items-center justify-center mx-auto mb-6">
                            <Icon className="icon-32 fill-pink-1" name="close-circle" />
                        </div>
                        <div className="text-h4 mb-4">Something went wrong.</div>
                        <div className="text-muted mb-8">
                            An unexpected glitch occurred in the Folio engine. Please refresh the page or contact support if the issue persists.
                        </div>
                        <div className="flex gap-4 justify-center">
                            <button
                                className="btn-stroke h-12 px-6"
                                onClick={() => window.location.href = "mailto:support@folio.com"}
                            >
                                Contact Support
                            </button>
                            <button
                                className="btn-purple h-12 px-8"
                                onClick={() => window.location.reload()}
                            >
                                Refresh Page
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
