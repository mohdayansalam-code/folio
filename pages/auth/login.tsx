import { useState, FormEvent } from "react";
import Head from "next/head";
import Link from "next/link";
import { supabase } from "../../utils/supabase";

export async function getServerSideProps() {
    // If we wanted to check server-side session, we would do it here.
    // For now, keeping the original stub or logic if any. (Since the original just redirected to '/', maybe it was disabled? No, wait. The original code redirected to '/' unconditionally? Ah, the original code had: export async function getServerSideProps() { return { redirect: { destination: '/', permanent: false } } }. Let's remove that unconditionally redirecting getServerSideProps as it prevents users from seeing the login page.)
    return { props: {} };
}

export default function Login() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();

        if (!email.trim() || !email.includes('@')) {
            setMessage({ type: 'error', text: 'Please enter a valid email address.' });
            return;
        }

        setLoading(true);
        setMessage(null);

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                // Ensure redirect falls back to window.location.origin if available
                emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
            }
        });

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({ type: 'success', text: 'Check your email for the secure access link.' });
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex selection:bg-purple-1/30 bg-background dark:bg-n-2 text-primary font-sans">
            <Head>
                <title>Access Folio Dashboard</title>
                <meta name="description" content="Securely access your Folio workspace." />
            </Head>

            {/* Left Column (Brand) - Hidden on mobile (<1023px), takes 50% on desktop */}
            <div className="flex flex-1 lg:hidden relative flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-n-3 via-n-1 to-n-2 dark:from-n-1 dark:via-n-2 dark:to-n-1 border-r border-n-1 dark:border-white/5">
                {/* Subtle visual glows */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-1/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-1/10 dark:bg-pink-1/5 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/4"></div>

                <div className="relative z-10 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-black tracking-tight hover:text-purple-1 transition-colors">
                        Folio
                    </Link>
                </div>

                <div className="relative z-10 max-w-lg mb-12">
                    <h1 className="text-4xl lg:text-5xl font-black leading-tight tracking-tighter mb-6">
                        The Operating System for LinkedIn Ghostwriters.
                    </h1>
                    <p className="text-lg text-secondary">
                        Manage clients, approvals, publishing, and performance — all in one structured workspace.
                    </p>
                </div>
            </div>

            {/* Right Column (Auth Card) */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
                {/* Mobile branding header */}
                <div className="hidden lg:block absolute top-8 left-8">
                    <Link href="/" className="text-2xl font-black tracking-tight hover:text-purple-1 transition-colors">
                        Folio
                    </Link>
                </div>

                <div className="w-full max-w-[420px]">
                    <div className="bg-white dark:bg-n-1 p-8 sm:p-10 rounded-2xl shadow-xl border border-n-2 dark:border-white/5">
                        <div className="mb-8">
                            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Welcome Back</h2>
                            <p className="text-secondary">Access your dashboard securely.</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-bold uppercase tracking-widest text-n-4 dark:text-n-3 mb-2">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="name@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-14 bg-n-2/50 dark:bg-n-2 border border-n-2 dark:border-white/10 rounded-xl px-4 text-base focus:outline-none focus:ring-2 focus:ring-purple-1/50 focus:border-purple-1 transition-shadow placeholder:text-n-4/70 dark:placeholder:text-n-4"
                                    required
                                    disabled={loading || message?.type === 'success'}
                                />
                            </div>

                            {message && (
                                <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'error'
                                    ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20'
                                    : 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400 border border-green-200 dark:border-green-500/20'
                                    }`}>
                                    {message.text}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || !email.trim() || message?.type === 'success'}
                                className="w-full h-14 bg-purple-1 text-white text-base font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-purple-1/90 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-[2px] disabled:hover:translate-y-0 transition-all shadow-[0_4px_14px_0_rgba(181,146,255,0.39)]"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending Link...
                                    </>
                                ) : (
                                    'Enter Dashboard'
                                )}
                            </button>
                        </form>

                        {!message?.type && (
                            <div className="mt-8 text-center text-sm text-secondary">
                                We'll send you a secure magic link. No passwords needed.
                            </div>
                        )}
                    </div>

                    <div className="mt-8 text-center text-sm font-bold text-secondary">
                        Don't have an account?{" "}
                        <Link href="/auth/signup" className="text-primary hover:text-purple-1 transition-colors">
                            Sign up here
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

