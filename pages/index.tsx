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
                <title>Folio – Operating System for LinkedIn Ghostwriters</title>
                <meta name="description" content="Manage clients, drafts, approvals, and performance attribution in one structured workspace." />
                <meta property="og:title" content="Folio – Operating System for LinkedIn Ghostwriters" />
                <meta property="og:description" content="Manage clients, drafts, approvals, and performance attribution in one structured workspace." />
            </Head>

            {/* Premium Navigation */}
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 lg:px-8 py-6 bg-background/90 dark:bg-n-2/90 backdrop-blur-xl border-b border-n-1 dark:border-white/5 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="text-h4 font-bold tracking-tighter text-n-7 dark:text-white">Folio</div>
                </div>

                <div className="hidden md:flex items-center gap-10">
                    <a href="#features" className="text-sm font-bold text-n-3 hover:text-purple-1 transition-colors">Features</a>
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

            {/* Hero Section */}
            <section className="relative pt-48 pb-32 px-8 flex flex-col items-center text-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-1/4 w-[60%] h-[50%] bg-purple-1/10 rounded-full blur-[150px] opacity-70"></div>
                </div>

                <h1 className="max-w-[20ch] text-[4.5rem] leading-[1.1] font-black tracking-tighter mb-8 lg:text-6xl sm:text-5xl animate-fade-in-up">
                    Turn LinkedIn Content Into <span className="text-purple-1">Measurable Client Revenue.</span>
                </h1>

                <p className="max-w-3xl text-xl text-n-3 dark:text-secondary mb-12 font-medium leading-relaxed opacity-90 animate-fade-in-up delay-100">
                    Folio is the operating system for ghostwriters who manage clients, drafts, approvals, and performance — all in one structured workspace.
                </p>

                <div className="flex items-center gap-4 animate-fade-in-up delay-200">
                    <button onClick={() => router.push('/login')} className="btn-purple btn-shadow h-16 px-12 text-lg font-bold rounded-xl hover:-translate-y-1 transition-transform">
                        Start Free
                    </button>
                    <a href="#pricing" className="flex items-center justify-center h-16 px-10 text-lg font-bold rounded-xl border border-n-1 dark:border-white/20 hover:bg-n-1 hover:text-white dark:hover:bg-white/5 transition-colors">
                        View Pricing
                    </a>
                </div>
            </section>

            {/* Problem -> Solution Section */}
            <section className="py-24 bg-n-1/30 dark:bg-n-1/20 border-y border-n-1 dark:border-white/5">
                <div className="max-w-[75rem] mx-auto px-12 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-h2 mb-4">Ghostwriting is chaotic. Folio makes it structured.</h2>
                    </div>

                    <div className="grid grid-cols-3 md:grid-cols-1 gap-8 mb-16">
                        <div className="bg-white dark:bg-n-2 p-8 rounded-2xl border border-n-1 dark:border-white/10 shadow-sm">
                            <h3 className="text-h5 text-red-500 mb-4 flex items-center gap-2">
                                <Icon name="close" className="fill-red-500 icon-20" /> Client Chaos
                            </h3>
                            <ul className="space-y-3 text-secondary font-medium">
                                <li>• Scattered Google Docs</li>
                                <li>• Lost assets in Slack</li>
                                <li>• Missed approvals</li>
                            </ul>
                        </div>
                        <div className="bg-white dark:bg-n-2 p-8 rounded-2xl border border-n-1 dark:border-white/10 shadow-sm">
                            <h3 className="text-h5 text-red-500 mb-4 flex items-center gap-2">
                                <Icon name="close" className="fill-red-500 icon-20" /> Content Bottlenecks
                            </h3>
                            <ul className="space-y-3 text-secondary font-medium">
                                <li>• Draft version confusion</li>
                                <li>• Scheduling friction</li>
                                <li>• Status ambiguity</li>
                            </ul>
                        </div>
                        <div className="bg-white dark:bg-n-2 p-8 rounded-2xl border border-n-1 dark:border-white/10 shadow-sm">
                            <h3 className="text-h5 text-red-500 mb-4 flex items-center gap-2">
                                <Icon name="close" className="fill-red-500 icon-20" /> Revenue Blind Spots
                            </h3>
                            <ul className="space-y-3 text-secondary font-medium">
                                <li>• No post attribution</li>
                                <li>• No ROI reporting</li>
                                <li>• Hard to justify pricing</li>
                            </ul>
                        </div>
                    </div>

                    <div className="text-center p-12 bg-white dark:bg-n-1 border border-n-1 dark:border-white/10 rounded-2xl shadow-primary-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-1/5 rounded-full blur-[100px] pointer-events-none"></div>
                        <h3 className="text-h3 mb-6">Folio solves this with:</h3>
                        <div className="flex flex-wrap justify-center gap-8 text-lg font-bold">
                            <span className="flex items-center gap-2 text-primary dark:text-white"><Icon name="check" className="fill-green-1" /> Structured pipeline</span>
                            <span className="flex items-center gap-2 text-primary dark:text-white"><Icon name="check" className="fill-green-1" /> Built-in approval system</span>
                            <span className="flex items-center gap-2 text-primary dark:text-white"><Icon name="check" className="fill-green-1" /> Draft-level tracking</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Blocks */}
            <section id="features" className="py-32 bg-white dark:bg-n-2">
                <div className="max-w-[75rem] mx-auto px-12 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-x-16 gap-y-24">

                        <div className="flex flex-col justify-center">
                            <h3 className="text-h3 mb-4">Client Brain</h3>
                            <p className="text-lg text-secondary font-medium leading-relaxed">
                                Centralized client positioning, offers, voice notes, and assets. Never lose a brand's specific context again.
                            </p>
                        </div>
                        <div className="bg-n-1/50 dark:bg-n-1 rounded-2xl aspect-video border border-n-1 dark:border-white/10 flex items-center justify-center p-8">
                            <div className="w-full max-w-sm space-y-4">
                                <div className="h-4 w-1/3 bg-n-3 dark:bg-n-3/20 rounded"></div>
                                <div className="h-12 w-full bg-white dark:bg-n-2 rounded border border-n-1 dark:border-white/10"></div>
                                <div className="h-12 w-full bg-white dark:bg-n-2 rounded border border-n-1 dark:border-white/10"></div>
                            </div>
                        </div>

                        <div className="bg-n-1/50 dark:bg-n-1 rounded-2xl aspect-video border border-n-1 dark:border-white/10 flex items-center justify-center p-8 lg:order-last">
                            <div className="w-full flex gap-4 h-full">
                                <div className="flex-1 bg-white dark:bg-n-2 rounded border border-n-1 dark:border-white/10"></div>
                                <div className="flex-1 bg-white dark:bg-n-2 rounded border border-n-1 dark:border-white/10"></div>
                                <div className="flex-1 bg-white dark:bg-n-2 rounded border border-n-1 dark:border-white/10"></div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <h3 className="text-h3 mb-4">Content Pipeline</h3>
                            <p className="text-lg text-secondary font-medium leading-relaxed">
                                A structured visual progression. Watch drafts transition through review, scheduling, and finally, published status.
                            </p>
                        </div>

                        <div className="flex flex-col justify-center">
                            <h3 className="text-h3 mb-4">Approval Workflow</h3>
                            <p className="text-lg text-secondary font-medium leading-relaxed">
                                Send secure preview links to clients. Get explicit approval, and lock schedules until verified.
                            </p>
                        </div>
                        <div className="bg-n-1/50 dark:bg-n-1 rounded-2xl aspect-video border border-n-1 dark:border-white/10 flex items-center justify-center p-8">
                            <div className="w-full max-w-sm space-y-4 text-center">
                                <div className="inline-block px-4 py-2 bg-green-1/20 text-green-1 rounded-full font-bold text-sm">Client Approved</div>
                            </div>
                        </div>

                        <div className="bg-n-1/50 dark:bg-n-1 rounded-2xl aspect-video border border-n-1 dark:border-white/10 flex items-center justify-center p-8 lg:order-last">
                            <div className="w-full flex gap-4 mt-auto">
                                <div className="flex-1 bg-purple-1/20 rounded-t h-16"></div>
                                <div className="flex-1 bg-purple-1/40 rounded-t h-24"></div>
                                <div className="flex-1 bg-purple-1/60 rounded-t h-32"></div>
                                <div className="flex-1 bg-purple-1 rounded-t h-48"></div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <h3 className="text-h3 mb-4">Performance Attribution</h3>
                            <p className="text-lg text-secondary font-medium leading-relaxed">
                                Track impressions, connected meetings, and resulting revenue directly attributed to individual posts.
                            </p>
                        </div>

                        <div className="flex flex-col justify-center">
                            <h3 className="text-h3 mb-4">Analytics Dashboard</h3>
                            <p className="text-lg text-secondary font-medium leading-relaxed">
                                See which content strategies actually drive ROI across your entire client roster.
                            </p>
                        </div>
                        <div className="bg-n-1/50 dark:bg-n-1 rounded-2xl aspect-video border border-n-1 dark:border-white/10 flex items-center justify-center p-8">
                            <div className="w-full max-w-sm">
                                <div className="flex justify-between items-end mb-4 border-b border-n-3 dark:border-white/10 pb-4">
                                    <div className="text-h4">Top Posts</div>
                                    <div className="text-sm font-bold text-purple-1">View All</div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-8 w-full bg-white dark:bg-n-2 rounded"></div>
                                    <div className="h-8 w-full bg-white dark:bg-n-2 rounded"></div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 bg-n-1/40 dark:bg-n-1/40 border-y border-n-1 dark:border-white/5 transition-colors">
                <div className="max-w-[60rem] mx-auto px-12 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-h2 mb-4">Simple, transparent pricing.</h2>
                        <p className="text-xl text-secondary font-medium">Built for ghostwriters scaling to multi-six figures.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-1 gap-8">
                        {/* Free Plan */}
                        <div className="bg-white dark:bg-n-2 p-10 rounded-3xl border border-n-1 dark:border-white/10 shadow-sm flex flex-col">
                            <h3 className="text-h3 mb-2">Free</h3>
                            <p className="text-sm text-secondary font-medium mb-8">For solo operators starting out.</p>

                            <ul className="space-y-4 text-n-7 dark:text-white font-medium mb-12 flex-1">
                                <li className="flex items-start gap-3"><Icon name="check" className="fill-purple-1 shrink-0 mt-0.5 icon-20" /> 1 Client</li>
                                <li className="flex items-start gap-3"><Icon name="check" className="fill-purple-1 shrink-0 mt-0.5 icon-20" /> 10 Drafts / month</li>
                                <li className="flex items-start gap-3"><Icon name="check" className="fill-purple-1 shrink-0 mt-0.5 icon-20" /> 5 Assets per client</li>
                                <li className="flex items-start gap-3"><Icon name="check" className="fill-purple-1 shrink-0 mt-0.5 icon-20" /> Basic pipeline</li>
                                <li className="flex items-start gap-3 text-secondary opacity-50"><Icon name="close" className="fill-secondary shrink-0 mt-0.5 icon-20" /> No analytics insights</li>
                            </ul>

                            <button onClick={() => router.push('/login')} className="w-full btn-stroke h-14 rounded-xl font-bold">
                                Start Free
                            </button>
                        </div>

                        {/* Pro Plan */}
                        <div className="bg-white dark:bg-n-1 p-10 rounded-3xl border-2 border-purple-1 shadow-primary-4 flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-purple-1 text-white text-xs font-bold px-4 py-1 rounded-bl-xl">POPULAR</div>
                            <h3 className="text-h3 mb-2 text-purple-1">Pro</h3>
                            <p className="text-sm text-secondary font-medium mb-8">For scaling ghostwriting agencies.</p>

                            <ul className="space-y-4 text-n-7 dark:text-white font-medium mb-12 flex-1">
                                <li className="flex items-start gap-3"><Icon name="check" className="fill-purple-1 shrink-0 mt-0.5 icon-20" /> Unlimited clients</li>
                                <li className="flex items-start gap-3"><Icon name="check" className="fill-purple-1 shrink-0 mt-0.5 icon-20" /> Unlimited drafts</li>
                                <li className="flex items-start gap-3"><Icon name="check" className="fill-purple-1 shrink-0 mt-0.5 icon-20" /> Draft-level performance</li>
                                <li className="flex items-start gap-3"><Icon name="check" className="fill-purple-1 shrink-0 mt-0.5 icon-20" /> Full analytics dashboard</li>
                                <li className="flex items-start gap-3"><Icon name="check" className="fill-purple-1 shrink-0 mt-0.5 icon-20" /> Approval flow & Exports</li>
                            </ul>

                            <button className="w-full btn-purple h-14 rounded-xl font-bold">
                                Upgrade to Pro
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof Placeholder */}
            <section className="py-20 border-y border-n-1 dark:border-white/5 bg-background dark:bg-n-2 text-center">
                <div className="max-w-3xl mx-auto px-8">
                    <h3 className="text-h4 mb-8">Built for serious ghostwriters.</h3>
                    <div className="flex flex-wrap justify-center gap-12 text-sm font-bold text-n-3 dark:text-white/50 uppercase tracking-widest">
                        <span>Trusted by client-first creators</span>
                        <span className="hidden sm:block">·</span>
                        <span>Built for operators, not hobbyists</span>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-32 px-8 relative overflow-hidden flex flex-col items-center text-center bg-white dark:bg-n-1">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-1/10 rounded-full blur-[150px] pointer-events-none"></div>

                <h2 className="text-[3rem] md:text-5xl font-black tracking-tighter mb-12 max-w-2xl relative z-10 leading-[1.2]">
                    If content drives revenue, you should be tracking it.
                </h2>

                <button onClick={() => router.push('/login')} className="btn-purple btn-shadow h-20 px-16 text-xl font-black rounded-2xl hover:scale-105 transition-transform relative z-10">
                    Start Using Folio
                </button>
            </section>

            {/* Clean Footer */}
            <footer className="py-12 px-12 lg:px-8 border-t border-n-1 dark:border-white/5 bg-background dark:bg-n-2 flex items-center justify-between transition-colors">
                <div className="text-sm font-bold opacity-60">© 2026 Folio Inc.</div>
                <div className="flex gap-8">
                    <span className="text-sm font-bold opacity-60 hover:opacity-100 transition-opacity cursor-pointer">Privacy</span>
                    <span className="text-sm font-bold opacity-60 hover:opacity-100 transition-opacity cursor-pointer">Terms</span>
                </div>
            </footer>
        </div>
    );
}
