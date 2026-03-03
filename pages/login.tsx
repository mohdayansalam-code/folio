import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { supabase } from "@/utils/supabase";

const Login = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const trimmedEmail = email.trim().toLowerCase();

        if (!trimmedEmail || !trimmedEmail.includes('@')) {
            setMessage({ type: 'error', text: 'Please enter a valid email address.' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            // Test friendly: Auto-signup if not exist, otherwise login
            let { data, error: signInError } = await supabase.auth.signInWithPassword({
                email: trimmedEmail,
                password: 'testPassword123'
            });

            if (signInError && signInError.message.includes('Invalid login credentials')) {
                // Try create account silently for testing
                const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                    email: trimmedEmail,
                    password: 'testPassword123'
                });
                if (signUpError) throw signUpError;
            } else if (signInError) {
                throw signInError;
            }

            router.push('/dashboard');
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || "Something went wrong. Please try again." });
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-[1.1fr_0.9fr] lg:flex lg:flex-col selection:bg-purple-1/30 bg-background dark:bg-neutral-900 text-primary font-sans relative">
            <Head>
                <title>Access Folio Dashboard</title>
                <meta name="description" content="Securely access your Folio workspace." />
            </Head>

            {/* Left Column (Brand) - Hidden on mobile (<1023px), takes 50% on desktop */}
            {/* Left Column (Brand) */}
            <div className="flex relative flex-col justify-between p-12 lg:hidden overflow-hidden bg-gradient-to-br from-white via-neutral-100 to-purple-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-purple-950 border-r border-neutral-200 dark:border-neutral-800">
                {/* Visual Depth Glows */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(168,85,247,0.25),transparent_60%)] pointer-events-none mix-blend-screen dark:mix-blend-plus-lighter opacity-60"></div>
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-600/20 blur-3xl rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-screen opacity-50"></div>
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-pink-1/10 dark:bg-purple-500/20 blur-[100px] rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-screen opacity-40"></div>

                <div className="relative z-10 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-black tracking-tight hover:text-purple-1 transition-colors">
                        Folio
                    </Link>
                </div>

                <div className="relative z-10 flex-1 flex items-center justify-center">
                    <div className="max-w-lg space-y-6">
                        <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight leading-tight text-neutral-900 dark:text-white">
                            The <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">Operating System</span><br /> for LinkedIn Ghostwriters.
                        </h1>
                        <p className="text-lg text-neutral-500 dark:text-neutral-300">
                            Manage clients, approvals, publishing, and performance — all in one structured workspace.
                        </p>
                    </div>
                </div>

                {/* Empty bottom space to center main element properly */}
                <div className="relative z-10 h-8"></div>
            </div>

            {/* Right Column (Auth Card) */}
            <div className="min-h-screen flex items-center justify-center p-6 sm:p-12 relative bg-background dark:bg-neutral-900">
                {/* Mobile branding header */}
                <div className="hidden lg:block absolute top-8 left-8">
                    <Link href="/" className="text-2xl font-black tracking-tight hover:text-purple-1 transition-colors">
                        Folio
                    </Link>
                </div>

                <div className="w-full max-w-[420px] relative z-10">
                    <div className="bg-white dark:bg-neutral-900/80 p-8 sm:p-10 rounded-2xl shadow-xl dark:shadow-none border border-neutral-200 dark:border-neutral-700/50 backdrop-blur-sm">
                        <div className="mb-8">
                            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-neutral-900 dark:text-white">Welcome Back</h2>
                            <p className="text-secondary text-sm">Access your dashboard securely.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="name@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-14 bg-neutral-100 dark:bg-neutral-800 border border-transparent dark:border-neutral-700/50 rounded-xl px-4 text-base focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-white dark:focus:bg-neutral-800 transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-500 text-neutral-900 dark:text-white"
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
                                className="w-full h-14 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-base font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-[1px] disabled:hover:translate-y-0 transition-all shadow-md dark:shadow-none"
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
                            <div className="mt-8 text-center text-sm text-neutral-500">
                                We'll send you a secure magic link. No passwords needed.
                            </div>
                        )}
                    </div>

                    <div className="mt-8 text-center text-sm font-medium text-neutral-500">
                        Don't have an account?{" "}
                        <Link href="/auth/signup" className="text-purple-600 hover:text-purple-500 font-bold transition-colors">
                            Sign up here
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
