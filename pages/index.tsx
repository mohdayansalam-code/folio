import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Icon from "@/components/Icon";
import { useTheme } from "@/hooks/useTheme";
import { useRouter } from "next/router";

export default function Home() {
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="min-h-screen bg-background dark:bg-n-2 font-sans text-n-7 dark:text-white flex flex-col selection:bg-purple-1/30 transition-colors overflow-x-hidden">
            <Head>
                <title>Folio | The LinkedIn Ghostwriter OS</title>
                <meta name="description" content="The AI Command Center for LinkedIn Ghostwriters. Manage clients, context, and content pipeline in one elite workspace." />
            </Head>

            {/* Premium Navigation */}
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 lg:px-8 py-6 bg-background/80 dark:bg-n-2/80 backdrop-blur-xl border-b border-n-1 dark:border-white/5 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="text-h4 font-bold tracking-tighter text-n-7 dark:text-white">Folio</div>
                    <span className="px-2 py-0.5 rounded-full bg-purple-1/10 text-purple-1 text-[10px] font-black uppercase tracking-widest hidden sm:block">Private Beta</span>
                </div>

                <div className="hidden md:flex items-center gap-10">
                    <a href="#features" className="text-sm font-bold text-n-3 hover:text-purple-1 transition-colors">Features</a>
                    <a href="#workflow" className="text-sm font-bold text-n-3 hover:text-purple-1 transition-colors">Workflow</a>
                    <a href="#pricing" className="text-sm font-bold text-n-3 hover:text-purple-1 transition-colors">Pricing</a>
                </div>

                <div className="flex items-center gap-4">
                    {mounted && (
                        <button
                            type="button"
                            className="w-10 h-10 flex items-center justify-center rounded-full border border-n-1 dark:border-white/10 text-n-7 dark:text-white hover:bg-n-1/5 dark:hover:bg-white/5 transition-colors"
                            onClick={toggleTheme}
                        >
                            <Icon name={theme === "light" ? "moon" : "sun"} className="icon-20 dark:fill-white" />
                        </button>
                    )}
                    <button onClick={() => router.push('/login')} className="btn-purple btn-small px-6 rounded-lg font-bold">Access App</button>
                </div>
            </header>

            {/* Hero Section - Elite UI */}
            <section className="relative pt-56 pb-32 px-8 flex flex-col items-center text-center">
                {/* Background Glows */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-1/4 w-[60%] h-[50%] bg-purple-1/15 rounded-full blur-[150px] opacity-70"></div>
                    <div className="absolute top-[10%] right-1/4 w-[40%] h-[40%] bg-pink-1/10 rounded-full blur-[120px] opacity-50"></div>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-n-1 dark:bg-white/5 border border-n-1/10 dark:border-white/10 mb-8 animate-fade-in-up shadow-sm">
                    <span className="flex w-2 h-2 rounded-full bg-green-1 pulse-green"></span>
                    <span className="text-xs font-bold text-n-3 dark:text-secondary tracking-wide uppercase">Open for new beta users</span>
                </div>

                <h1 className="max-w-[14ch] text-[5.5rem] leading-[1] font-black tracking-tighter mb-8 lg:text-7xl sm:text-5xl animate-fade-in-up">
                    Your AI Command Center for <span className="text-purple-1">LinkedIn Ghostwriting</span>
                </h1>

                <p className="max-w-2xl text-xl text-n-3 dark:text-secondary mb-12 font-medium leading-relaxed opacity-90 animate-fade-in-up delay-100 italic">
                    Stop managing rosters in spreadsheets and Notion clutter. Centralize client context, train AI on their unique voice, and run a high-output agency with absolute calm.
                </p>

                <div className="flex items-center gap-4 animate-fade-in-up delay-200">
                    <button onClick={() => router.push('/login')} className="btn-purple btn-shadow h-16 px-12 text-lg font-bold rounded-xl hover:-translate-y-1 transition-transform">
                        Get Started Free
                    </button>
                    <button className="btn-stroke h-16 px-10 text-lg font-bold rounded-xl border-n-1 dark:border-white/20 hover:bg-n-1 dark:hover:bg-white/5 transition-colors">
                        View Demo
                    </button>
                </div>

                <div className="mt-16 flex items-center gap-8 text-xs font-bold text-n-4 dark:text-white/40 uppercase tracking-[0.2em] animate-fade-in-up delay-300">
                    <span>Built for ghostwriters</span>
                    <span className="block w-1 h-1 rounded-full bg-n-4/30"></span>
                    <span>Designed for Agencies</span>
                    <span className="block w-1 h-1 rounded-full bg-n-4/30"></span>
                    <span>No payments required</span>
                </div>
            </section>

            {/* Product Value Blocks - Why, not What */}
            <section id="features" className="py-32 bg-white dark:bg-n-1 border-y border-n-1 dark:border-white/5 transition-colors">
                <div className="max-w-[75rem] mx-auto px-12 lg:px-8">
                    <div className="flex flex-col mb-20">
                        <h2 className="text-h2 mb-4">Standardize your excellence.</h2>
                        <p className="text-xl text-n-3 dark:text-secondary max-w-xl font-medium">Folio replaces fragmented tools with a single source of truth for your entire writing operation.</p>
                    </div>

                    <div className="grid grid-cols-3 md:grid-cols-1 gap-10">
                        <div className="flex flex-col group pt-10 border-t border-n-1/10 dark:border-white/10 hover:border-purple-1 transition-colors">
                            <h3 className="text-h4 mb-4">Client Brain</h3>
                            <p className="text-sm font-black text-purple-1 uppercase tracking-widest mb-6">Never forget a client's voice.</p>
                            <p className="text-lg text-n-3 dark:text-secondary font-medium leading-relaxed opacity-80">
                                A centralized neural vault for each client. Deep context on their tone, positioning, and results means you never have to "re-learn" their brand on Monday morning.
                            </p>
                        </div>
                        <div className="flex flex-col group pt-10 border-t border-n-1/10 dark:border-white/10 hover:border-yellow-1 transition-colors">
                            <h3 className="text-h4 mb-4">Content Pipeline</h3>
                            <p className="text-sm font-black text-yellow-1 uppercase tracking-widest mb-6">Visual Agency Control.</p>
                            <p className="text-lg text-n-3 dark:text-secondary font-medium leading-relaxed opacity-80">
                                See your entire content roster across all clients at once. No more hunting through individual Notion boards to remember what's drafted and what's live.
                            </p>
                        </div>
                        <div className="flex flex-col group pt-10 border-t border-n-1/10 dark:border-white/10 hover:border-blue-500 transition-colors">
                            <h3 className="text-h4 mb-4">ROI Tracking</h3>
                            <p className="text-sm font-black text-blue-500 uppercase tracking-widest mb-6">Prove your value effortlessly.</p>
                            <p className="text-lg text-n-3 dark:text-secondary font-medium leading-relaxed opacity-80">
                                Replace messy screenshots with an automated performance engine. Show clients real impressions and results that justify your agency's retainer every month.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Visual Workflow Section */}
            <section id="workflow" className="py-32 px-8 flex flex-col items-center overflow-hidden">
                <div className="text-center mb-24">
                    <h2 className="text-h2 mb-4">The Operating Loop</h2>
                    <p className="text-xl text-n-3 dark:text-secondary max-w-2xl font-medium">How Folio transforms your daily ghostwriting workflow.</p>
                </div>

                <div className="max-w-[70rem] w-full grid grid-cols-4 lg:grid-cols-2 sm:grid-cols-1 gap-12 relative">
                    {/* Connecting line for desktop */}
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-1/30 to-transparent lg:hidden -translate-y-8"></div>

                    {[
                        { step: "01", title: "Add Client", desc: "Initialize your agency pipeline in seconds.", icon: "plus" },
                        { step: "02", title: "Train Voice", desc: "Inject context into the Client Brain.", icon: "profile" },
                        { step: "03", title: "Create Content", desc: "Generate packs from the AI engine.", icon: "edit" },
                        { step: "04", title: "Track Results", desc: "Proof of work with 1-click analytics.", icon: "bar-chart" },
                    ].map((step, i) => (
                        <div key={i} className="flex flex-col items-center text-center relative z-10 group">
                            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-n-1 border border-n-1 dark:border-white/10 shadow-primary-4 flex items-center justify-center mb-6 group-hover:bg-purple-1 group-hover:border-purple-1 transition-all">
                                <Icon name={step.icon} className="icon-24 fill-n-3 dark:fill-white group-hover:fill-white" />
                            </div>
                        </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-8 md:px-5 bg-background dark:bg-n-2 text-n-3 dark:text-muted text-sm font-bold flex flex-col md:flex-row justify-between items-center z-10 relative">
                <div className="mb-4 md:mb-0 flex items-center gap-2">
                    <span>© 2026 Folio Inc.</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold text-n-7 dark:text-n-1 bg-n-4 dark:bg-white/90 uppercase tracking-widest">Beta</span>
                </div>
                <div className="flex items-center gap-6">
                    <Link href="/privacy" className="hover:text-purple-1 transition-colors">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-purple-1 transition-colors">Terms of Service</Link>
                    <a href="mailto:support@folio.com" className="hover:text-purple-1 transition-colors">Contact Support</a>
                </div>
            </footer>
        </div>
    );
}
