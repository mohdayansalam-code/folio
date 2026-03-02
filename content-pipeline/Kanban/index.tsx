import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Icon from "@/components/Icon";
import TaskCard from "./TaskCard";
import { supabase } from "@/utils/supabase";
import { useToast } from "@/components/Toast";
import Select from "@/components/Select";
import CreateDraftModal from "@/components/content/CreateDraftModal";
import { getEntitlements } from "@/lib/entitlements";

const KanbanDescPage = () => {
    const [clients, setClients] = useState<any[]>([]);
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const [pipelineItems, setPipelineItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMutating, setIsMutating] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const { addToast } = useToast();

    const fetchPipeline = async () => {
        let query = supabase
            .from('drafts')
            .select('*')
            .order('created_at', { ascending: true });

        if (selectedClientId && selectedClientId !== 'all') {
            query = query.eq('client_id', selectedClientId);
        }

        const { data, error } = await query;

        if (data) {
            setPipelineItems(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        const fetchClients = async () => {
            const email = localStorage.getItem('folio_user_email');
            if (email) {
                const { data } = await supabase.from('clients').select('id, name').eq('user_email', email);
                if (data && data.length > 0) {
                    const mapped = data.map(c => ({ value: c.id, label: c.name }));
                    setClients([{ value: 'all', label: 'All Clients' }, ...mapped]);
                    setSelectedClientId(mapped[0].value);
                }
            }
        };
        fetchClients();
    }, []);

    useEffect(() => {
        if (selectedClientId || clients.length === 0) {
            fetchPipeline();
        }
    }, [selectedClientId]);

    const { canCreateDraft, limits } = getEntitlements('free', {
        currentClients: Math.max(0, clients.length - 1), // -1 for 'all' mapping
        currentDraftsThisMonth: pipelineItems.length
    });

    const handleOpenModal = () => {
        if (!canCreateDraft) {
            addToast(`Free plan allows ${limits.maxDraftsPerMonth} drafts per month. Upgrade to Pro.`, "error");
            return;
        }
        setIsModalOpen(true);
    };

    const handleCreateDraft = async (title: string) => {
        if (!selectedClientId || selectedClientId === 'all') {
            addToast("Please select a client before creating a draft", "error");
            return;
        }

        setIsCreating(true);
        const payload = {
            client_id: selectedClientId,
            title: title,
            status: "draft"
        };

        // Optimistic
        const tempId = crypto.randomUUID();
        setPipelineItems(prev => [{ ...payload, id: tempId }, ...prev]);

        const { error, data } = await supabase.from('drafts').insert(payload).select().single();
        if (!error) {
            fetchPipeline();
            addToast("Draft created", "success");
            setIsModalOpen(false);
        } else {
            console.error("Supabase insert error:", error);
            addToast(error?.message || "Failed to create draft", "error");
            setPipelineItems(prev => prev.filter(p => p.id !== tempId));
        }
        setIsCreating(false);
    };

    const handleMove = async (item: any, nextStatus: string) => {
        setIsMutating(true);

        let updatePayload: any = { status: nextStatus };

        if (nextStatus === 'scheduled') {
            const isDate = window.prompt("Schedule Post (YYYY-MM-DD):", new Date(Date.now() + 86400000).toISOString().split('T')[0]);

            if (!isDate) {
                setIsMutating(false);
                return;
            }

            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(isDate.trim())) {
                addToast("Invalid date format. Use YYYY-MM-DD.", "error");
                setIsMutating(false);
                return;
            }

            const parsedDate = new Date(isDate.trim());
            if (isNaN(parsedDate.getTime())) {
                addToast("Invalid calendar date.", "error");
                setIsMutating(false);
                return;
            }

            updatePayload.scheduled_at = parsedDate.toISOString();
        }

        // Optimistic Update
        setPipelineItems(prev => prev.map(p => p.id === item.id ? { ...p, ...updatePayload } : p));

        const { error } = await supabase
            .from('drafts')
            .update(updatePayload)
            .eq('id', item.id);

        if (error) {
            console.error("Supabase move error:", error);
            addToast(error?.message || "Failed to update status", "error");
            fetchPipeline(); // Rollback
        } else {
            addToast(`Moved to ${nextStatus}`, "success");
        }
        setIsMutating(false);
    };

    const ideas = pipelineItems.filter(i => i.status === 'idea');
    const drafts = pipelineItems.filter(i => ['draft', 'awaiting_approval', 'approved'].includes(i.status));
    const scheduled = pipelineItems.filter(i => i.status === 'scheduled');
    const published = pipelineItems.filter(i => i.status === 'published');

    const columns = [
        { id: 'idea', title: 'Ideas', items: ideas, color: '#F1C40F' },
        { id: 'draft', title: 'Drafts', items: drafts, color: '#FF9966' },
        { id: 'scheduled', title: 'Scheduled', items: scheduled, color: '#3BBD5B' },
        { id: 'published', title: 'Published', items: published, color: '#319DFF' },
    ];

    const isEmpty = pipelineItems.length === 0;

    return (
        <Layout title="Content Pipeline">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="text-h4">Content Pipeline</div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    {clients.length > 0 && (
                        <Select
                            className="w-full md:w-48"
                            items={clients.map(c => ({ id: c.value, title: c.label }))}
                            value={selectedClientId ? { id: selectedClientId, title: clients.find(c => c.value === selectedClientId)?.label } : null}
                            onChange={(item: any) => setSelectedClientId(item.id)}
                        />
                    )}
                    {selectedClientId && selectedClientId !== 'all' && (
                        <button
                            className={`btn-purple h-12 px-6 shrink-0 ${(isMutating || !canCreateDraft) ? 'opacity-60 cursor-not-allowed' : ''}`}
                            onClick={handleOpenModal}
                            disabled={isMutating}
                        >
                            <Icon name="plus" />
                            <span>Create Draft</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="2xl:-mx-8 lg:-mx-6 md:-mx-5">
                {loading ? (
                    <div className="card text-center py-20 flex flex-col items-center justify-center max-w-2xl mx-auto my-12">
                        <div className="text-h4 mb-2 text-secondary animate-pulse">Scanning Content Pipeline...</div>
                    </div>
                ) : selectedClientId === 'all' ? (
                    <div className="card shadow-primary-4 p-12 text-center max-w-2xl mx-auto flex flex-col items-center justify-center my-12">
                        <Icon className="icon-28 mb-4 text-muted dark:fill-white/50" name="tasks" />
                        <div className="text-h4 mb-2">Select a client to view their content pipeline</div>
                        <div className="text-secondary mb-6 max-w-md mx-auto">
                            Choose a specific client from the dropdown above to create drafts.
                        </div>
                    </div>
                ) : isEmpty ? (
                    <div className="card shadow-primary-4 p-12 text-center max-w-2xl mx-auto flex flex-col items-center justify-center my-12">
                        <Icon className="icon-28 mb-4 text-muted dark:fill-white/50" name="tasks" />
                        <div className="text-h4 mb-2">No drafts yet for this client</div>
                        <div className="text-secondary mb-6 max-w-md mx-auto">
                            Move ideas from Content Pack or create your first draft
                        </div>
                        <button
                            className={`btn-purple btn-shadow h-12 px-6 ${(isMutating || !canCreateDraft) ? 'opacity-60 cursor-not-allowed' : ''}`}
                            onClick={handleOpenModal}
                            disabled={isMutating}
                        >
                            <Icon name="plus" />
                            <span>Create Draft</span>
                        </button>
                    </div>
                ) : (
                    <div className="flex overflow-auto scrollbar-none scroll-smooth 2xl:before:w-8 2xl:before:shrink-0 2xl:after:w-8 2xl:after:shrink-0 lg:before:w-6 lg:after:w-6 md:before:w-5 md:after:w-5 pb-8">
                        {columns.map((column) => (
                            <div key={column.id} className="flex flex-col min-w-[20.2rem] mr-5 pt-2 last:mr-0 lg:min-w-[19.3rem]">
                                <div className="flex justify-between mb-4 md:mb-2">
                                    <div className="flex items-center shrink-0">
                                        <div className="w-2 h-2 mr-3.5" style={{ backgroundColor: column.color }}></div>
                                        <div className="text-h4">
                                            {column.title} ({column.items.length})
                                        </div>
                                    </div>
                                </div>

                                {column.items.length === 0 ? (
                                    <div className="mt-2 text-center p-6 border border-dashed border-n-3 dark:border-white/10 rounded-sm text-sm text-secondary">
                                        No items in {column.title.toLowerCase()}
                                    </div>
                                ) : (
                                    column.items.map((item: any) => (
                                        <TaskCard
                                            key={item.id}
                                            item={item}
                                            onMove={handleMove}
                                            isMutating={isMutating}
                                            clients={clients}
                                        />
                                    ))
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <CreateDraftModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreateDraft}
                isLoading={isCreating}
            />
        </Layout>
    );
};

export default KanbanDescPage;
