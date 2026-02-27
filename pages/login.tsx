import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import Icon from "@/components/Icon";

const Login = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const trimmedEmail = email.trim().toLowerCase();

        // Basic email validation
        if (!trimmedEmail || !trimmedEmail.includes('@')) {
            setError("Please enter a valid email address.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Save to localStorage (simple session management as requested)
            localStorage.setItem('folio_user_email', trimmedEmail);

            // Redirect to dashboard immediately
            router.push('/dashboard');
        } catch (err) {
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-n-1 dark:bg-n-2 font-sans selection:bg-purple-1/30">
            <Head>
                <title>Access Folio | Email Login</title>
            </Head>

            <div className="flex-1 flex flex-col justify-center px-8 md:px-5 w-full max-w-[35rem] mx-auto z-10 relative bg-n-1 dark:bg-n-2">
                <Link href="/" className="absolute top-8 left-8 md:top-6 md:left-5 text-h4 font-bold tracking-tight text-n-7 dark:text-white hover:text-purple-1 transition-colors">
                    Folio
                </Link>

                <div className="w-full max-w-[23.5rem] mx-auto">
                    <div className="mb-10">
                        <h1 className="text-h2 mb-2">Access Dashboard</h1>
                        <p className="text-secondary font-medium">Enter the email you used on Whop to access your dashboard.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-n-4 dark:text-white/40">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-14 px-4 rounded-xl bg-transparent border-2 border-n-1 dark:border-white/10 outline-none focus:border-purple-1 transition-colors text-n-7 dark:text-white font-medium"
                                placeholder="name@email.com"
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-4 rounded-xl bg-red-1/10 border border-red-1/20 text-red-1 text-sm font-medium flex items-center gap-3">
                                <Icon name="info" className="w-5 h-5 fill-red-1 shrink-0" />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-purple w-full h-14 text-lg font-bold shadow-primary-4 disabled:opacity-50 disabled:translate-y-0"
                        >
                            {loading ? "Checking Access..." : "Enter Dashboard"}
                        </button>
                    </form>


                </div>
            </div>

            {/* Right side Art Box */}
            <div className="flex-[1.5] bg-n-2 border-l border-n-1 dark:bg-n-1/50 dark:border-white/5 relative flex md:hidden items-center justify-center overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-1/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="relative z-10 w-96 h-96 rounded-[2rem] bg-n-1 dark:bg-n-2 border border-n-1 dark:border-white/10 shadow-primary-4 transform rotate-3 flex items-center justify-center overflow-hidden">
                    <Icon name="profile" className="w-32 h-32 fill-purple-1/20" />
                </div>
            </div>
        </div>
    );
};

export default Login;
