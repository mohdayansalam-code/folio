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
        <div className="min-h-screen bg-background dark:bg-n-2 font-sans text-n-7 dark:text-white flex flex-col selection:bg-purple-1/30 transition-colors overflow-hidden">
            <Head>
                <title>Folio | The LinkedIn Ghostwriter OS</title>
                <meta name="description" content="Folio helps LinkedIn ghostwriters turn client context into high-quality weekly posts." />
            </Head>

            {/* Navigation */}
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-5 py-5 bg-background/90 dark:bg-n-2/90 backdrop-blur-md border-b border-n-1 dark:border-white/5 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="text-h4 font-bold tracking-tight">Folio</div>
                </div>
                <div className="flex items-center gap-6">
                    {mounted && (
                        <button
                            type="button"
                            className="w-10 h-10 flex items-center justify-center rounded-full border border-n-1 dark:border-white/10 text-n-7 dark:text-white hover:bg-n-1/5 dark:hover:bg-white/5 transition-colors"
                            onClick={toggleTheme}
                            aria-label="Toggle Theme"
                        >
                            <Icon name={theme === "light" ? "moon" : "sun"} className="icon-20 dark:fill-white" />
                        </button>
                    )}
                    <button type="button" onClick={() => router.push('/login')} className="btn-purple btn-small">Access App</button>
                </div>
            </header>

            {/* 1. Hero Section */}
            <section className="relative pt-48 pb-24 px-8 md:px-5 md:pt-32 text-center max-w-[64rem] w-full mx-auto">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] md:w-[400px] md:h-[400px] bg-gradient-to-br from-purple-1/30 via-pink-1/20 to-orange-500/20 dark:from-purple-1/20 dark:via-pink-1/10 dark:to-orange-500/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

                <h1 className="text-[4.5rem] leading-[1.1] font-bold tracking-tight mb-8 md:text-5xl text-n-7 dark:text-white drop-shadow-sm">
                    Run a multi-client LinkedIn ghostwriting agency without the operational chaos.
                </h1>

                <p className="text-xl text-n-3 dark:text-secondary max-w-3xl mx-auto mb-12 font-medium">
                    Replace the fragmented mess of Google Docs, Notion boards, and endless Slack threads. Centralize client context and standardize your content pipeline in one calm workspace.
                </p>

                <div className="flex flex-col justify-center items-center gap-3">
                    <button type="button" onClick={() => router.push('/login')} className="btn-purple btn-shadow h-16 px-10 text-lg flex items-center justify-center hover:-translate-y-1">
                        Access App
                    </button>
                    <span className="text-sm font-bold text-n-3 dark:text-secondary opacity-80">
                        Private beta · No credit card · Limited spots
                    </span>
                </div>
            </section>

            {/* 2. Pain Section */}
            <section className="py-24 px-8 md:px-5 bg-white dark:bg-n-1 border-y border-n-1 dark:border-white/5 transition-colors">
                <div className="max-w-[50rem] mx-auto">
                    <h2 className="text-h2 mb-12 text-center text-n-7 dark:text-white">Ghostwriting at scale breaks when...</h2>
                    <div className="space-y-6">
                        {[
                            { text: "Every new client means hunting for their brand voice across four different Google Docs and Notion pages.", icon: "folder" },
                            { text: "Every morning starts by staring at a blank page trying to remember a client's specific tone and positioning.", icon: "edit" },
                            { text: "Every post approval gets lost in an endless, unorganized Slack or email thread.", icon: "messages" },
                            { text: "Every week, your content schedule relies on a fragile spreadsheet that breaks when a client changes their mind.", icon: "tasks" },
                            { text: "Every Friday, you waste hours manually pulling LinkedIn impressions to prove your ROI to clients.", icon: "bar-chart" }
                        ].map((pain, i) => (
                            <div key={i} className="card p-6 flex items-center gap-6 group hover:-translate-y-1 transition-transform border-n-1 dark:border-white/10 shadow-primary-4">
                                <div className="w-12 h-12 rounded-xl bg-n-1 dark:bg-n-2 flex items-center justify-center shrink-0 border border-n-1 dark:border-white/10 group-hover:bg-purple-1/10 transition-colors">
                                    <Icon name={pain.icon} className="w-5 h-5 fill-white dark:fill-white group-hover:fill-purple-1 transition-colors" />
                                </div>
                                <span className="text-lg font-bold text-n-7 dark:text-white/90">{pain.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Solution Section */}
            <section className="py-32 px-8 md:px-5 max-w-[80rem] mx-auto">
                <div className="text-center mb-20 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-purple-1/10 blur-[100px] pointer-events-none -z-10"></div>
                    <h2 className="text-h2 mb-4 text-n-7 dark:text-white">Meet the Ghostwriter OS</h2>
                    <p className="text-xl text-n-3 dark:text-secondary max-w-2xl mx-auto font-medium">A unified workflow designed strictly to replace your fragmented tool stack.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-1 gap-8">
                    {/* Block 1 */}
                    <div className="card p-10 bg-white dark:bg-n-1 border-n-1 dark:border-white/10 shadow-primary-4 group hover:-translate-y-1 transition-transform">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-1/20 to-purple-1/5 border border-purple-1/30 flex items-center justify-center mb-8 shadow-inner">
                            <Icon name="profile" className="icon-28 fill-purple-1" />
                        </div>
                        <h3 className="text-h4 mb-2 text-n-7 dark:text-white">Client Brain</h3>
                        <p className="text-sm border-b border-n-1/10 dark:border-white/10 pb-4 mb-4 text-n-3 dark:text-secondary font-bold uppercase tracking-widest">Never start from a blank page.</p>
                        <p className="text-n-3 dark:text-secondary text-lg font-medium">
                            A centralized vault for each client's unique voice, tone, and signature stories. Store their core positioning so your writing always sounds exactly like them.
                        </p>
                    </div>

                    {/* Block 2 */}
                    <div className="card p-10 bg-white dark:bg-n-1 border-n-1 dark:border-white/10 shadow-primary-4 group hover:-translate-y-1 transition-transform">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-1/20 to-yellow-1/5 border border-yellow-1/30 flex items-center justify-center mb-8 shadow-inner">
                            <Icon name="tasks" className="icon-28 fill-yellow-1" />
                        </div>
                        <h3 className="text-h4 mb-2 text-n-7 dark:text-white">Content Pipeline</h3>
                        <p className="text-sm border-b border-n-1/10 dark:border-white/10 pb-4 mb-4 text-n-3 dark:text-secondary font-bold uppercase tracking-widest">See your entire roster at a glance.</p>
                        <p className="text-n-3 dark:text-secondary text-lg font-medium">
                            Manage every draft visually in a quiet, organized timeline. Know exactly what is an idea, what is being drafted, and what is scheduled to go live.
                        </p>
                    </div>

                    {/* Block 3 */}
                    <div className="card p-10 bg-white dark:bg-n-1 border-n-1 dark:border-white/10 shadow-primary-4 group hover:-translate-y-1 transition-transform">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-1/20 to-green-1/5 border border-green-1/30 flex items-center justify-center mb-8 shadow-inner">
                            <Icon name="lightning" className="icon-28 fill-green-1" />
                        </div>
                        <h3 className="text-h4 mb-2 text-n-7 dark:text-white">Weekly Content Packs</h3>
                        <p className="text-sm border-b border-n-1/10 dark:border-white/10 pb-4 mb-4 text-n-3 dark:text-secondary font-bold uppercase tracking-widest">Standardize your weekly deliverables.</p>
                        <p className="text-n-3 dark:text-secondary text-lg font-medium">
                            Generate structured weekly drafts that align tightly with the client's core messaging. Keep your output consistent and professional week after week.
                        </p>
                    </div>

                    {/* Block 4 */}
                    <div className="card p-10 bg-white dark:bg-n-1 border-n-1 dark:border-white/10 shadow-primary-4 group hover:-translate-y-1 transition-transform">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/30 flex items-center justify-center mb-8 shadow-inner">
                            <Icon name="bar-chart" className="icon-28 fill-blue-500" />
                        </div>
                        <h3 className="text-h4 mb-2 text-n-7 dark:text-white">Performance Tracking</h3>
                        <p className="text-sm border-b border-n-1/10 dark:border-white/10 pb-4 mb-4 text-n-3 dark:text-secondary font-bold uppercase tracking-widest">Prove your value effortlessly.</p>
                        <p className="text-n-3 dark:text-secondary text-lg font-medium">
                            Stop manual data entry. Input top-level metrics to automatically assemble clean, professional growth charts that show your clients exactly what they are paying for.
                        </p>
                    </div>
                </div>
            </section>

            {/* 4. Differentiation */}
            <section className="py-24 px-8 md:px-5 bg-purple-1/5 dark:bg-purple-1/5 border-t border-purple-1/20 dark:border-purple-1/10 transition-colors">
                <div className="max-w-[50rem] mx-auto text-center">
                    <h2 className="text-h2 mb-6 text-n-7 dark:text-white">Built for operators.<br />Not generic creators.</h2>
                    <p className="text-xl text-n-3 dark:text-secondary font-medium">
                        Folio is not an AI prompt wrapper. It is not a tool for solo influencers building a personal brand. It is an operating system engineered strictly for B2B ghostwriters and agencies managing multiple founder brands.
                    </p>
                </div>
            </section>

            {/* 5. Social Proof */}
            <section className="py-16 px-8 md:px-5 bg-background dark:bg-n-2 border-y border-n-1/10 dark:border-white/5 text-center transition-colors">
                <div className="max-w-[40rem] mx-auto">
                    <h3 className="text-xs text-n-4 dark:text-white/40 mb-3 font-bold tracking-widest uppercase">Private Beta Cohort</h3>
                    <p className="text-lg text-n-7 dark:text-white/90 font-bold">
                        Built with 1:1 feedback from full-time LinkedIn ghostwriters managing 3–15 clients. Strict capacity limit on new beta access spots.
                    </p>
                </div>
            </section>

            {/* 6. Pricing Preview */}
            <section className="py-24 px-8 md:px-5 max-w-[80rem] mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-h2 mb-4 text-n-7 dark:text-white">Simple, predictable pricing.</h2>
                    <p className="text-xl text-n-3 dark:text-secondary max-w-2xl mx-auto font-medium">Start free during the beta. Scale when your roster demands it.</p>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-1 gap-8 items-end md:items-stretch">
                    {/* Tier 1 */}
                    <div className="card p-10 bg-white dark:bg-n-1 border border-n-1 dark:border-white/10 shadow-primary-4 flex flex-col h-full">
                        <h3 className="text-h4 mb-2 text-n-7 dark:text-white">Solo</h3>
                        <p className="text-sm border-b border-n-1/10 dark:border-white/10 pb-6 mb-6 text-n-3 dark:text-secondary font-bold">Perfect for part-time writers.</p>
                        <div className="text-[3.5rem] leading-[1] font-bold mb-8 text-n-7 dark:text-white">Free<span className="text-lg text-n-3 dark:text-secondary font-normal ml-2">/mo</span></div>
                        <ul className="space-y-4 mb-10 flex-grow font-medium text-n-7 dark:text-white/90">
                            <li className="flex gap-3"><Icon name="check" className="w-5 h-5 fill-purple-1 shrink-0" /> <span className="font-bold">Up to 3 clients</span></li>
                            <li className="flex gap-3"><Icon name="check" className="w-5 h-5 fill-purple-1 shrink-0" /> Full content pipeline</li>
                            <li className="flex gap-3"><Icon name="check" className="w-5 h-5 fill-purple-1 shrink-0" /> limited generation runs</li>
                        </ul>
                        <button type="button" onClick={() => router.push('/login')} className="btn-stroke w-full h-14 bg-transparent border-n-1 dark:border-white">Access App</button>
                    </div>

                    {/* Tier 2 */}
                    <div className="card p-10 bg-purple-1 border-n-1 shadow-primary-6 flex flex-col relative z-10 text-white transform hover:-translate-y-2 transition-transform">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-n-1 dark:bg-n-2 text-white border border-n-1 dark:border-white/20 text-xs font-bold px-4 py-2 rounded-sm uppercase tracking-widest shadow-primary-4">
                            Most Popular
                        </div>
                        <h3 className="text-h4 mb-2">Boutique</h3>
                        <p className="text-sm border-b border-n-1/20 dark:border-white/20 pb-6 mb-6 text-white/90 font-bold">For full-time agency owners.</p>
                        <div className="text-[3.5rem] leading-[1] font-bold mb-8">$49<span className="text-lg text-white/70 font-normal ml-2">/mo</span></div>
                        <ul className="space-y-4 mb-10 flex-grow font-medium">
                            <li className="flex gap-3"><Icon name="check" className="w-5 h-5 fill-white shrink-0" /> <span className="font-bold">Up to 10 clients</span></li>
                            <li className="flex gap-3"><Icon name="check" className="w-5 h-5 fill-white shrink-0" /> Unlimited generation runs</li>
                            <li className="flex gap-3"><Icon name="check" className="w-5 h-5 fill-white shrink-0" /> Priority support</li>
                        </ul>
                        <button type="button" onClick={() => router.push('/login')} className="btn-dark w-full h-14 bg-n-1 hover:bg-n-1/90 shadow-primary-4 border-n-1">Access App</button>
                    </div>

                    {/* Tier 3 */}
                    <div className="card p-10 bg-white dark:bg-n-1 border border-n-1 dark:border-white/10 shadow-primary-4 flex flex-col h-full">
                        <h3 className="text-h4 mb-2 text-n-7 dark:text-white">Agency</h3>
                        <p className="text-sm border-b border-n-1/10 dark:border-white/10 pb-6 mb-6 text-n-3 dark:text-secondary font-bold">For established operations.</p>
                        <div className="text-[3.5rem] leading-[1] font-bold mb-8 text-n-7 dark:text-white">$99<span className="text-lg text-n-3 dark:text-secondary font-normal ml-2">/mo</span></div>
                        <ul className="space-y-4 mb-10 flex-grow font-medium text-n-7 dark:text-white/90">
                            <li className="flex gap-3"><Icon name="check" className="w-5 h-5 fill-purple-1 shrink-0" /> <span className="font-bold">Unlimited clients</span></li>
                            <li className="flex gap-3"><Icon name="check" className="w-5 h-5 fill-purple-1 shrink-0" /> Custom branding</li>
                            <li className="flex gap-3"><Icon name="check" className="w-5 h-5 fill-purple-1 shrink-0" /> Dedicated success manager</li>
                        </ul>
                        <button type="button" onClick={() => router.push('/login')} className="btn-stroke w-full h-14 bg-transparent border-n-1 dark:border-white">Access App</button>
                    </div>
                </div>

                <div className="mt-12 text-center text-sm font-bold text-n-3 dark:text-secondary">
                    Early beta pricing. Prices will increase. Early users are grandfathered.
                </div>
            </section>

            {/* 7. Final CTA */}
            <section className="py-32 px-8 md:px-5 bg-n-7 text-center text-white relative overflow-hidden border-y border-n-1 dark:border-n-1">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-purple-1/40 to-pink-1/30 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h2 className="text-[4rem] leading-[1.1] font-bold tracking-tight mb-8 md:text-5xl drop-shadow-md">Bring calm control to your ghostwriting agency.</h2>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10 font-medium">Reclaim your time, standardize your workflows, and scale your operation with total professionalism.</p>
                    <button type="button" onClick={() => router.push('/login')} className="btn-purple btn-shadow h-16 px-12 text-lg inline-flex items-center justify-center hover:-translate-y-1">
                        Access App
                    </button>
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
