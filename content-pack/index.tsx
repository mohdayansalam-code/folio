import Layout from "@/components/Layout";
import Select from "@/components/Select";
import Icon from "@/components/Icon";
import { useRouter } from "next/router";
import { useToast } from "@/components/Toast";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";

const WeeklyContentPack = () => {
    const router = useRouter();
    const { addToast } = useToast();
    const isBrainReady = router.query.onboarding !== 'true';
    const [plan, setPlan] = useState<string>("free");
    const [postCount, setPostCount] = useState<number>(0);

    useEffect(() => {
        const fetchPlanStatus = async () => {
            const { data: member } = await supabase.from('workspace_members').select('workspace_id').limit(1).single();
            if (member) {
                const { data: workspace } = await supabase.from('workspaces').select('plan').eq('id', member.workspace_id).single();
                if (workspace) setPlan(workspace.plan);
            }
            const { count } = await supabase.from('posts').select('*', { count: 'exact', head: true });
            if (count !== null) setPostCount(count);
        };
        fetchPlanStatus();
    }, []);
    const clients = [
        { id: 1, title: "Elon Musk" },
        { id: 2, title: "Sam Altman" },
        { id: 3, title: "Jensen Huang" },
    ];
    const [client, setClient] = useState(clients[0]);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);

    const ideas = [
        { id: 1, title: "Why Neo-Brutalism works in B2B", description: "A thought leadership piece on design trends.", status: "Idea", color: "yellow" },
        { id: 2, title: "5 AI Prompts for Faster Code", description: "Carousel for LinkedIn.", status: "Idea", color: "yellow" },
        { id: 3, title: "Building a SaaS in 2026", description: "Personal story about founder journey.", status: "Idea", color: "yellow" },
        { id: 4, title: "Next.js vs React in Enterprise", description: "Technical deep-dive.", status: "Idea", color: "yellow" },
        { id: 5, title: "The Future of AI Agents", description: "Predictive analysis for Twitter thread.", status: "Idea", color: "yellow" },
    ];

    const drafts = [
        { id: 1, title: "AI and the Future of Work", description: "This post explores the intersection of AI and human creativity, focusing on the LinkedIn audience.", status: "Draft", color: "purple" },
        { id: 2, title: "How to scale your engineering team", description: "Actionable advice for CTOs based on recent interviews.", status: "Review", color: "blue" },
        { id: 3, title: "Open Source Sustainability", description: "Why we need better funding models for OSS.", status: "Ready", color: "green" },
    ];

    const isAtLimit = plan === 'free' && postCount >= 3;

    return (
        <Layout title="Weekly Content Pack">
            <div className="flex justify-between items-center mb-6">
                <Select
                    className="w-full max-w-[16rem]"
                    items={clients}
                    value={client}
                    onChange={setClient}
                />

                {isAtLimit ? (
                    <a href="https://whop.com/folio" target="_blank" rel="noreferrer" className="hidden md:flex btn-stroke h-12 px-6 text-pink-1 border-pink-1 hover:bg-pink-1 hover:text-white">
                        <Icon name="lightning" />
                        <span>Upgrade to Pro</span>
                    </a>
                ) : (
                    <div className="relative group hidden md:block">
                        <button
                            className={`btn-purple btn-shadow h-12 px-6 ${(isGenerating || !isBrainReady) ? "opacity-70 cursor-not-allowed" : ""}`}
                            disabled={isGenerating || !isBrainReady}
                            onClick={() => {
                                if (!isBrainReady) return;
                                setIsGenerating(true);
                                setTimeout(() => {
                                    setIsGenerating(false);
                                    setPostCount(prev => prev + 1);
                                    addToast("Weekly content generated successfully.", "success");
                                }, 2000);
                            }}
                        >
                            <Icon name={isGenerating ? "refresh" : "plus"} className={isGenerating ? "animate-spin" : ""} />
                            <span>{isGenerating ? "Generating Pack..." : "Generate This Week"}</span>
                        </button>
                        {!isBrainReady && (
                            <div className="absolute top-full mt-2 right-0 bg-n-4 text-white text-xs px-3 py-2 rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none after:content-[''] after:absolute after:bottom-full after:right-6 after:border-solid after:border-[6px] after:border-transparent after:border-b-n-4">
                                Train Client Brain first
                            </div>
                        )}
                    </div>
                )}
            </div>

            {isAtLimit && (
                <div className="card shadow-primary-4 mb-8 bg-pink-1/[0.05] border border-pink-1/20 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-pink-1/20 flex items-center justify-center">
                            <Icon className="icon-24 fill-pink-1" name="lightning" />
                        </div>
                        <div>
                            <div className="text-h6 mb-1 text-n-7 ">AI Generation Limit Reached</div>
                            <div className="text-muted text-sm max-w-xl">
                                You are currently on the Free Plan which is limited to 3 AI Runs. Upgrade to unlock unlimited AI content generations.
                            </div>
                        </div>
                    </div>
                    <a href="https://whop.com/folio" target="_blank" rel="noreferrer" className="btn-pink btn-shadow h-12 px-8 shrink-0">
                        Upgrade to Pro
                    </a>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Post Ideas Column */}
                <div className="w-1/2">
                    <div className="flex items-center mb-6">
                        <div className="w-2 h-2 mr-3 bg-pink-1"></div>
                        <div className="text-h5">Post Ideas</div>
                    </div>
                    <div className="space-y-4">
                        {ideas.map((idea) => (
                            <div key={idea.id} className="card shadow-primary-4 p-5 hover:border-purple-1 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="text-h6 font-bold">{idea.title}</div>
                                    <div className={`label-stroke-${idea.color} shrink-0 ml-4`}>{idea.status}</div>
                                </div>
                                <div className="text-sm text-secondary mb-4">
                                    {idea.description}
                                </div>
                                <div className="flex justify-end border-t border-n-1 pt-4">
                                    <button className="btn-stroke btn-small h-8 px-4 mr-2" onClick={() => addToast("Idea dismissed.", "success")}>Dismiss</button>
                                    <button className="btn-purple btn-small h-8 px-4" onClick={() => addToast("Drafting started in pipeline.", "success")}>Draft Post</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Draft Posts Column */}
                <div className="w-1/2 px-4">
                    <div className="flex items-center mb-6">
                        <div className="w-2 h-2 mr-3 bg-yellow-1"></div>
                        <div className="text-h5">Draft Posts</div>
                    </div>
                    <div className="space-y-4">
                        {isGenerating ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={`skel-${i}`} className="card shadow-primary-4 p-5 animate-pulse">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="h-6 bg-n-4/50 dark:bg-white/10 rounded w-3/4"></div>
                                        <div className="h-6 bg-n-4/50 dark:bg-white/10 rounded w-16 ml-4 shrink-0"></div>
                                    </div>
                                    <div className="h-4 bg-n-4/50 dark:bg-white/10 rounded w-full mb-2"></div>
                                    <div className="h-4 bg-n-4/50 dark:bg-white/10 rounded w-5/6 mb-6"></div>
                                    <div className="flex justify-between items-center border-t border-n-1 pt-4">
                                        <div className="h-4 bg-n-4/50 dark:bg-white/10 rounded w-24"></div>
                                        <div className="flex space-x-2">
                                            <div className="h-8 bg-n-4/50 dark:bg-white/10 rounded w-16"></div>
                                            <div className="h-8 bg-n-4/50 dark:bg-white/10 rounded w-16"></div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            drafts.map((draft) => (
                                <div key={draft.id} className="card shadow-primary-4 p-5 hover:border-purple-1 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="text-h6 font-bold">{draft.title}</div>
                                        <div className={`label-stroke-${draft.color} shrink-0 ml-4`}>{draft.status}</div>
                                    </div>
                                    <div className="text-sm text-secondary mb-6">
                                        {draft.description}
                                    </div>
                                    <div className="flex justify-between items-center border-t border-n-1 pt-4">
                                        <button className="text-xs font-bold transition-colors hover:text-purple-1 flex items-center shrink-0">
                                            <Icon className="icon-16 mr-1" name="refresh" /> Regenerate
                                        </button>
                                        <div className="flex shrink-0">
                                            <button className="btn-stroke btn-small h-8 px-4 mr-2" onClick={() => addToast("Draft rejected.", "success")}>Reject</button>
                                            <button className="btn-purple btn-small h-8 px-4" onClick={() => addToast("Draft approved for scheduling.", "success")}>Accept</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-10 pt-10 border-t border-n-1 flex justify-center">
                <div className="relative group inline-block">
                    <button
                        className={`btn-stroke h-12 px-8 ${(!isBrainReady) ? "opacity-70 cursor-not-allowed" : ""}`}
                        disabled={!isBrainReady}
                    >
                        <Icon name="refresh" />
                        <span>Regenerate Entire Pack</span>
                    </button>
                    {!isBrainReady && (
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-n-4 text-white text-xs px-3 py-2 rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-solid after:border-[6px] after:border-transparent after:border-t-n-4">
                            Train Client Brain first
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default WeeklyContentPack;
