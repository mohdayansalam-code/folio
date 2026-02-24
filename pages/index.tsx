import Head from "next/head";
import Link from "next/link";
import Icon from "@/components/Icon";

export default function Home() {
    return (
        <div className="min-h-screen bg-n-1 dark:bg-n-2 font-sans text-n-7 dark:text-white flex flex-col selection:bg-purple-1/30">
            <Head>
                <title>Folio | The LinkedIn Ghostwriter OS</title>
                <meta name="description" content="Folio helps LinkedIn ghostwriters turn client context into high-quality weekly posts—without tool chaos." />
            </Head>

            {/* Navigation */}
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-5 py-5 bg-n-1/90 dark:bg-n-2/90 backdrop-blur-md border-b border-n-1 dark:border-white/5">
                <div className="flex items-center gap-3">
                    <div className="text-h4 font-bold tracking-tight">Folio</div>
                </div>
                <div className="flex items-center gap-6">
                    <Link href="/auth/signup" className="btn-purple btn-small">Join Beta Access</Link>
                </div>
            </header>

            {/* 1. Hero Section */}
            <section className="relative pt-48 pb-24 px-8 md:px-5 md:pt-32 text-center max-w-[64rem] w-full mx-auto">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] md:w-[400px] md:h-[400px] bg-purple-1/20 rounded-full blur-[120px] pointer-events-none -z-10"></div>

                <h1 className="text-[4.5rem] leading-[1.1] font-bold tracking-tight mb-8 md:text-5xl">
                    Run a 6-figure LinkedIn ghostwriting agency without the operational chaos.
                </h1>

                <p className="text-xl text-secondary max-w-3xl mx-auto mb-12">
                    Folio is the operational backbone for ghostwriters managing 5+ clients. Centralize client context, standardize your pipeline, and scale your roster—without losing your mind.
                </p>

                <div className="flex justify-center items-center">
                    <Link href="/auth/signup" className="btn-purple btn-shadow h-16 px-10 text-lg flex items-center justify-center">
                        Join Beta Access
                    </Link>
                </div>
            </section>

            {/* 2. Pain Section */}
            <section className="py-24 px-8 md:px-5 bg-n-2/50 dark:bg-n-1/50 border-y border-n-1 dark:border-white/5">
                <div className="max-w-[50rem] mx-auto">
                    <h2 className="text-h2 mb-12 text-center">Ghostwriting at scale breaks when...</h2>
                    <div className="space-y-4">
                        {[
                            "You're hunting for a client's story across 4 different Google Docs.",
                            "You stare at a blank page trying to remember their exact tone of voice.",
                            "Draft approvals get lost in endless Slack threads.",
                            "Your content calendar lives on a fragile spreadsheet that's hard to read.",
                            "You manually pull LinkedIn impressions to prove your ROI every Friday."
                        ].map((pain, i) => (
                            <div key={i} className="card shadow-primary-4 p-6 flex items-center gap-6 bg-red-1/5 border border-red-1/10 hover:-translate-y-1 transition-transform">
                                <div className="w-12 h-12 rounded-full bg-red-1/20 flex items-center justify-center shrink-0 border border-red-1/20">
                                    <Icon name="close" className="w-5 h-5 fill-red-1" />
                                </div>
                                <span className="text-lg font-medium text-n-7 dark:text-white/90">{pain}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Solution Section */}
            <section className="py-32 px-8 md:px-5 max-w-[80rem] mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-h2 mb-4">Meet the Ghostwriter OS</h2>
                    <p className="text-xl text-secondary max-w-2xl mx-auto">A unified workflow designed strictly to replace your fragmented tool stack.</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-1 gap-8">
                    {/* Block 1 */}
                    <div className="card shadow-primary-4 p-10 bg-n-2/30 dark:bg-n-1/30">
                        <div className="w-14 h-14 rounded-2xl bg-purple-1/20 border border-purple-1/30 flex items-center justify-center mb-8">
                            <Icon name="profile" className="icon-28 fill-purple-1" />
                        </div>
                        <h3 className="text-h4 mb-4">Client Brain</h3>
                        <p className="text-secondary text-lg">
                            A centralized vault for each client's unique voice, tone, offer positioning, and signature stories. Never start writing from a blank page again.
                        </p>
                    </div>

                    {/* Block 2 */}
                    <div className="card shadow-primary-4 p-10 bg-n-2/30 dark:bg-n-1/30">
                        <div className="w-14 h-14 rounded-2xl bg-yellow-1/20 border border-yellow-1/30 flex items-center justify-center mb-8">
                            <Icon name="tasks" className="icon-28 fill-yellow-1" />
                        </div>
                        <h3 className="text-h4 mb-4">Content Pipeline</h3>
                        <p className="text-secondary text-lg">
                            Manage every post visually in a unified Kanban timeline. Track what's an Idea, what's Drafting, and what's Scheduled across your entire roster.
                        </p>
                    </div>

                    {/* Block 3 */}
                    <div className="card shadow-primary-4 p-10 bg-n-2/30 dark:bg-n-1/30">
                        <div className="w-14 h-14 rounded-2xl bg-green-1/20 border border-green-1/30 flex items-center justify-center mb-8">
                            <Icon name="lightning" className="icon-28 fill-green-1" />
                        </div>
                        <h3 className="text-h4 mb-4">Weekly Content Packs</h3>
                        <p className="text-secondary text-lg">
                            Generate structured weekly ideas and drafts that are strictly aligned with the Client Brain core messaging. Review, refine, and approve.
                        </p>
                    </div>

                    {/* Block 4 */}
                    <div className="card shadow-primary-4 p-10 bg-n-2/30 dark:bg-n-1/30">
                        <div className="w-14 h-14 rounded-2xl bg-blue-1/20 border border-blue-1/30 flex items-center justify-center mb-8">
                            <Icon name="bar-chart" className="icon-28 fill-blue-1" />
                        </div>
                        <h3 className="text-h4 mb-4">Performance Tracking</h3>
                        <p className="text-secondary text-lg">
                            Stop manual data entry. Input top-level impressions and conversions to automatically assemble clean, professional growth charts inside the app.
                        </p>
                    </div>
                </div>
            </section>

            {/* 4. Differentiation & 5. Social Proof */}
            <section className="py-24 px-8 md:px-5 bg-purple-1/5 border-y border-purple-1/10">
                <div className="max-w-[50rem] mx-auto text-center">
                    <h2 className="text-h2 mb-6">Built for operators. Not another generic wrapper.</h2>
                    <p className="text-xl text-secondary mb-16">
                        Folio doesn't replace you. It replaces your messy tech stack. It's built exclusively to support the rigorous, high-volume workflows of professional LinkedIn ghostwriters.
                    </p>

                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-purple-1/30 bg-purple-1/10 text-purple-1 font-bold text-lg">
                        <div className="w-3 h-3 rounded-full bg-purple-1 animate-pulse"></div>
                        <span>Join 400+ ghostwriters on the private beta waitlist shaping the future of client operations.</span>
                    </div>
                </div>
            </section>

            {/* 6. Pricing Preview */}
            <section className="py-32 px-8 md:px-5 max-w-[80rem] mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-h2 mb-4">Simple, predictable pricing.</h2>
                    <p className="text-xl text-secondary max-w-2xl mx-auto">Start free during the beta. Scale when your roster demands it.</p>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-1 gap-8">
                    {/* Tier 1 */}
                    <div className="card shadow-primary-4 p-10 bg-n-2/50 dark:bg-n-1/50 border border-n-1 dark:border-white/5 flex flex-col">
                        <h3 className="text-h5 mb-2">Solo</h3>
                        <p className="text-sm border-b border-n-1 dark:border-white/10 pb-6 mb-6 text-secondary">Perfect for part-time writers.</p>
                        <div className="text-h2 mb-8">Free <span className="text-lg text-secondary font-normal">/mo</span></div>
                        <ul className="space-y-4 mb-10 flex-grow">
                            <li className="flex gap-3"><Icon name="check" className="w-5 h-5 fill-purple-1 shrink-0" /> <span className="font-bold">Up to 3 clients</span></li>
                            <li className="flex gap-3"><Icon name="check" className="w-5 h-5 fill-purple-1 shrink-0" /> Full content pipeline</li>
                            <li className="flex gap-3"><Icon name="check" className="w-5 h-5 fill-purple-1 shrink-0" /> limited generation runs</li>
                        </ul>
                        <Link href="/auth/signup" className="btn-stroke w-full h-14">Join Beta Access</Link>
                    </div>

                    {/* Tier 2 */}
                    <div className="card shadow-primary-4 p-10 bg-purple-1 border-2 border-purple-1/50 flex flex-col relative transform md:scale-100 scale-105 z-10 text-white">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-n-7 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-primary-4">
                            Most Popular
                        </div>
                        <h3 className="text-h5 mb-2">Boutique</h3>
                        <p className="text-sm border-b border-white/20 pb-6 mb-6 text-white/80">For full-time agency owners.</p>
                        <div className="text-h2 mb-8">$49 <span className="text-lg text-white/60 font-normal">/mo</span></div>
                        <ul className="space-y-4 mb-10 flex-grow">
                            <li className="flex gap-3"><Icon name="check" className="w-5 h-5 fill-white shrink-0" /> <span className="font-bold">Up to 10 clients</span></li>
                            <li className="flex gap-3"><Icon name="check" className="w-5 h-5 fill-white shrink-0" /> Unlimited generation runs</li>
                            <li className="flex gap-3"><Icon name="check" className="w-5 h-5 fill-white shrink-0" /> Priority support</li>
                        </ul>
                        <Link href="/auth/signup" className="bg-white text-purple-1 hover:bg-white/90 font-bold rounded-xl flex items-center justify-center transition-colors shadow-primary-4 h-14 w-full">Join Beta Access</Link>
                    </div>

                    {/* Tier 3 */}
                    <div className="card shadow-primary-4 p-10 bg-n-2/50 dark:bg-n-1/50 border border-n-1 dark:border-white/5 flex flex-col">
                        <h3 className="text-h5 mb-2">Agency</h3>
                        <p className="text-sm border-b border-n-1 dark:border-white/10 pb-6 mb-6 text-secondary">For established operations.</p>
                        <div className="text-h2 mb-8">$99 <span className="text-lg text-secondary font-normal">/mo</span></div>
                        <ul className="space-y-4 mb-10 flex-grow">
                            <li className="flex gap-3"><Icon name="check" className="w-5 h-5 fill-purple-1 shrink-0" /> <span className="font-bold">Unlimited clients</span></li>
                            <li className="flex gap-3"><Icon name="check" className="w-5 h-5 fill-purple-1 shrink-0" /> Custom branding</li>
                            <li className="flex gap-3"><Icon name="check" className="w-5 h-5 fill-purple-1 shrink-0" /> Dedicated success manager</li>
                        </ul>
                        <Link href="/auth/signup" className="btn-stroke w-full h-14">Join Beta Access</Link>
                    </div>
                </div>
            </section>

            {/* 7. Final CTA */}
            <section className="py-24 px-8 md:px-5 bg-n-7 dark:bg-n-2 border-y border-n-1 text-center text-white relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-1/20 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="relative z-10 max-w-3xl mx-auto">
                    <h2 className="text-[3.5rem] leading-tight font-bold mb-8 md:text-5xl">Stop managing chaos. Start scaling.</h2>
                    <Link href="/auth/signup" className="btn-purple btn-shadow h-16 px-10 text-lg inline-flex items-center justify-center">
                        Join Beta Access
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-8 md:px-5 bg-n-1 dark:bg-n-2 text-muted text-sm font-bold flex flex-col md:flex-row justify-between items-center z-10 relative">
                <div className="mb-4 md:mb-0">
                    © 2026 Folio Inc.
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
