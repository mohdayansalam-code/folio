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

    const [clients, setClients] = useState<{ label: string, value: string }[]>([]);
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

    const [packItems, setPackItems] = useState<any[]>([]);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const [plan, setPlan] = useState<string>("free");
    const [postCount, setPostCount] = useState<number>(0);

    useEffect(() => {
        let mounted = true;
        const initData = async () => {
            const email = localStorage.getItem('folio_user_email');
            if (!email) return;

            const { count } = await supabase.from('drafts').select('*', { count: 'exact', head: true }).eq('user_email', email);
            if (count !== null && mounted) setPostCount(count);

            const { data: clientsData } = await supabase.from('clients').select('*').eq('user_email', email).order('created_at', { ascending: false });

            if (mounted && clientsData && clientsData.length > 0) {
                const mappedClients = clientsData.map(c => ({ value: c.id, label: c.name || "Unnamed Client" }));
                setClients(mappedClients);
                setSelectedClientId(mappedClients[0].value);
            }
            if (mounted) setLoading(false);
        };
        initData();
        return () => { mounted = false; };
    }, []);

    function getWeekStartDate() {
        const now = new Date();
        const day = now.getDay(); // 0 = Sunday
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(now.setDate(diff));
        return monday.toISOString().split('T')[0]; // YYYY-MM-DD
    }

    const fetchItems = async () => {
        if (!selectedClientId) return;
        const email = localStorage.getItem('folio_user_email');
        const weekStart = getWeekStartDate();

        const { data } = await supabase
            .from('content_pack_items')
            .select('*')
            .eq('user_email', email)
            .eq('client_id', selectedClientId)
            .eq('week_start_date', weekStart)
            .order('created_at', { ascending: true });

        if (data) {
            setPackItems(data);
        }
    };

    useEffect(() => {
        let mounted = true;
        const initFetch = async () => {
            if (mounted) await fetchItems();
        }
        initFetch();
        return () => { mounted = false; };
    }, [selectedClientId]);

    const ideas = packItems.filter(i => i.type === 'idea' && i.status !== 'rejected');
    const drafts = packItems.filter(i => i.type === 'draft');

    const totalItems = packItems.filter(i => i.status !== 'rejected').length || 1;
    const approvedDrafts = drafts.filter(d => d.status === 'approved').length;
    let progressPercent = 0;
    if (packItems.filter(i => i.status !== 'rejected').length > 0) {
        progressPercent = Math.round((approvedDrafts / (packItems.filter(i => i.status !== 'rejected').length)) * 100);
    }

    const handleAction = async (item: any, actionType: string) => {
        const email = localStorage.getItem('folio_user_email');
        if (!email || !selectedClientId) {
            if (!selectedClientId) addToast("Select a client first", "error");
            return;
        }
        const weekStart = getWeekStartDate();

        if (actionType === 'draft') {
            setPackItems(prev => prev.map(p => p.id === item.id ? { ...p, type: 'draft' } : p));
            addToast("Drafting started in pipeline.", "success");

            await supabase.from('content_pack_items').update({ type: 'draft' }).eq('id', item.id).eq('week_start_date', weekStart);
            await supabase.from('drafts').insert({ user_email: email, client_id: selectedClientId, content: item.description, status: 'draft', week_start_date: weekStart });

        } else if (actionType === 'dismiss') {
            setPackItems(prev => prev.map(p => p.id === item.id ? { ...p, status: 'rejected' } : p));
            addToast("Idea dismissed.", "success");

            await supabase.from('content_pack_items').update({ status: 'rejected' }).eq('id', item.id).eq('week_start_date', weekStart);

        } else if (actionType === 'accept') {
            setPackItems(prev => prev.map(p => p.id === item.id ? { ...p, status: 'approved' } : p));
            addToast("Draft approved for scheduling.", "success");

            await supabase.from('content_pack_items').update({ status: 'approved' }).eq('id', item.id).eq('week_start_date', weekStart);

        } else if (actionType === 'reject') {
            setPackItems(prev => prev.map(p => p.id === item.id ? { ...p, status: 'rejected' } : p));
            addToast("Draft rejected.", "success");

            await supabase.from('content_pack_items').update({ status: 'rejected' }).eq('id', item.id).eq('week_start_date', weekStart);
        }
    };

    const handleGenerate = async () => {
        if (!selectedClientId) {
            addToast("Select a client first", "error");
            return;
        }
        if (!isBrainReady) return;
        setIsGenerating(true);

        const email = localStorage.getItem('folio_user_email');
        if (!email) {
            setIsGenerating(false);
            return;
        }

        const weekStart = getWeekStartDate();

        const sampleIdeas = [
            { title: "Industry Insight Post", description: "A thought leadership piece." },
            { title: "Behind the Scenes", description: "Share your workflow." },
            { title: "Case Study Highlight", description: "Show client results." }
        ];

        const payload = sampleIdeas.map(i => ({
            user_email: email,
            client_id: selectedClientId,
            week_start_date: weekStart,
            type: "idea",
            title: i.title,
            description: i.description,
            status: "pending"
        }));

        const { error } = await supabase
            .from("content_pack_items")
            .insert(payload);

        setIsGenerating(false);

        if (error) {
            console.error(error);
            addToast("Failed to generate pack", "error");
            return;
        }

        addToast("Weekly pack generated", "success");
        fetchItems(); // re-fetch
    };

    return (
        <Layout title="Weekly Content Pack">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                {clients.length > 0 ? (
                    <Select
                        className="w-full max-w-[16rem]"
                        items={clients.map(c => ({ id: c.value, title: c.label }))}
                        value={selectedClientId ? { id: selectedClientId, title: clients.find(c => c.value === selectedClientId)?.label } : null}
                        onChange={(item: any) => setSelectedClientId(item.id)}
                    />
                ) : (
                    <div className="w-full max-w-[16rem] h-12 bg-n-2/50 dark:bg-white/5 rounded-sm animate-pulse flex items-center px-4 text-sm text-secondary">
                        {loading ? "Loading clients..." : "No clients found"}
                    </div>
                )}

                <div className="relative group hidden md:block">
                    <button
                        className={`btn-purple btn-shadow h-12 px-6 ${(isGenerating || !isBrainReady || !selectedClientId) ? "opacity-70 cursor-not-allowed" : ""}`}
                        disabled={isGenerating || !isBrainReady || !selectedClientId}
                        onClick={handleGenerate}
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
            </div>

            <div className="card shadow-primary-4 mb-8 p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="w-full md:w-1/3">
                    <div className="text-h6 mb-1">Weekly Progress</div>
                    <div className="text-secondary text-sm">{approvedDrafts} / {totalItems} Posts Approved</div>
                </div>
                <div className="w-full md:w-2/3 flex items-center">
                    <div className="w-full h-2 bg-n-3 dark:bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-purple-1 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>
                    <div className="ml-4 font-bold text-sm text-purple-1 whitespace-nowrap">
                        {progressPercent}%
                    </div>
                </div>
            </div>

            <div className="card shadow-primary-4 mb-8 p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="w-full lg:w-1/2">
                    <div className="flex items-center mb-6">
                        <div className="w-2 h-2 mr-3 bg-pink-1"></div>
                        <div className="text-h5">Post Ideas ({ideas.length})</div>
                    </div>
                    <div className="space-y-4">
                        {ideas.length === 0 && !isGenerating ? (
                            <div className="card border border-dashed border-n-3 dark:border-white/10 p-8 text-center text-secondary">
                                No pending ideas. Generate this week's pack.
                            </div>
                        ) : (
                            ideas.map((idea) => (
                                <div key={idea.id} className="card shadow-primary-4 p-5 hover:border-purple-1 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="text-h6 font-bold">{idea.title}</div>
                                        <div className="label-stroke-yellow shrink-0 ml-4">Idea</div>
                                    </div>
                                    <div className="text-sm text-secondary mb-4">
                                        {idea.description}
                                    </div>
                                    <div className="flex justify-end border-t border-n-1 dark:border-white/10 pt-4">
                                        <button className="btn-stroke btn-small h-8 px-4 mr-2" onClick={() => handleAction(idea, 'dismiss')}>Dismiss</button>
                                        <button className="btn-purple btn-small h-8 px-4" onClick={() => handleAction(idea, 'draft')}>Draft Post</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="w-full lg:w-1/2 lg:px-4">
                    <div className="flex items-center mb-6">
                        <div className="w-2 h-2 mr-3 bg-yellow-1"></div>
                        <div className="text-h5">Draft Posts ({drafts.length})</div>
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
                                    <div className="flex justify-between items-center border-t border-n-1 dark:border-white/10 pt-4">
                                        <div className="h-4 bg-n-4/50 dark:bg-white/10 rounded w-24"></div>
                                        <div className="flex space-x-2">
                                            <div className="h-8 bg-n-4/50 dark:bg-white/10 rounded w-16"></div>
                                            <div className="h-8 bg-n-4/50 dark:bg-white/10 rounded w-16"></div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : drafts.length === 0 ? (
                            <div className="card shadow-primary-4 border border-dashed border-n-3 dark:border-white/10 p-8 text-center text-secondary">
                                No active drafts yet.
                            </div>
                        ) : (
                            drafts.map((draft) => (
                                <div key={draft.id} className="card shadow-primary-4 p-5 hover:border-purple-1 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="text-h6 font-bold">{draft.title}</div>
                                        <div className={`shrink-0 ml-4 ${draft.status === 'approved' ? 'label-stroke-green' : draft.status === 'rejected' ? 'label-stroke-pink' : 'label-stroke-purple'}`}>
                                            {draft.status === 'approved' ? 'Ready' : draft.status === 'rejected' ? 'Rejected' : 'Draft'}
                                        </div>
                                    </div>
                                    <div className="text-sm text-secondary mb-6">
                                        {draft.description}
                                    </div>
                                    <div className="flex justify-between items-center border-t border-n-1 dark:border-white/10 pt-4">
                                        <button className="text-xs font-bold transition-colors hover:text-purple-1 flex items-center shrink-0">
                                            <Icon className="icon-16 mr-1" name="refresh" /> Regenerate
                                        </button>
                                        <div className="flex shrink-0">
                                            <button
                                                className="btn-stroke btn-small h-8 px-4 mr-2"
                                                onClick={() => handleAction(draft, 'reject')}
                                                disabled={draft.status === 'rejected'}
                                            >
                                                Reject
                                            </button>
                                            <button
                                                className="btn-purple btn-small h-8 px-4"
                                                onClick={() => handleAction(draft, 'accept')}
                                                disabled={draft.status === 'approved'}
                                            >
                                                {draft.status === 'approved' ? 'Approved' : 'Accept'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-10 pt-10 border-t border-n-1 dark:border-white/10 flex justify-center">
                <div className="relative group inline-block">
                    <button
                        className={`btn-stroke h-12 px-8 ${(!isBrainReady || !selectedClientId) ? "opacity-70 cursor-not-allowed" : ""}`}
                        disabled={!isBrainReady || !selectedClientId}
                        onClick={handleGenerate}
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
