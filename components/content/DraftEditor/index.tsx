import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabase";
import { useToast } from "@/components/Toast";
import Layout from "@/components/Layout";
import Icon from "@/components/Icon";
import Link from "next/link";

export default function DraftEditor() {
    const router = useRouter();
    const { id } = router.query;
    const { addToast } = useToast();

    const [draft, setDraft] = useState<any>(null);
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
    const [isRequestingReview, setIsRequestingReview] = useState(false);
    const [notFound, setNotFound] = useState(false);

    // Optimize save state to prevent stale closures
    const contentRef = useRef(content);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const fetchDraft = async () => {
            if (!id || typeof id !== 'string') return;

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setNotFound(true);
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('drafts')
                .select('*')
                .eq('id', id)
                .single();

            if (error || !data) {
                console.error("Fetch draft error:", error);
                setNotFound(true);
            } else {
                setDraft(data);
                const initialContent = data.content || '';
                setContent(initialContent);
                contentRef.current = initialContent;
            }
            setLoading(false);
        };

        fetchDraft();
    }, [id]);

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        setContent(newContent);

        if (newContent !== contentRef.current) {
            setSaveState('saving');

            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }

            saveTimeoutRef.current = setTimeout(async () => {
                await autoSave(newContent);
            }, 2500); // 2.5 seconds debounce auto-save
        }
    };

    const autoSave = async (contentToSave: string) => {
        if (!id || typeof id !== 'string') return;

        const { error } = await supabase
            .from('drafts')
            .update({ content: contentToSave })
            .eq('id', id);

        if (error) {
            console.error("Supabase auto-save error:", error);
            addToast(error.message, "error");
            setSaveState('idle');
        } else {
            contentRef.current = contentToSave;
            setSaveState('saved');

            setTimeout(() => {
                setSaveState('idle');
            }, 2000); // Display saved status for 2s
        }
    };

    // Clean up timeout on unmount
    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, []);

    const handleSendForApproval = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !id) return;

        setIsRequestingReview(true);
        try {
            const res = await fetch('/api/review/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ draft_id: id, user_id: user.id })
            });
            const data = await res.json();

            if (!res.ok) {
                addToast(data.error || "Failed to generate review link", "error");
            } else {
                addToast("Review link copied to clipboard!", "success");
                setDraft((prev: any) => ({ ...prev, status: 'awaiting_approval' }));
                navigator.clipboard.writeText(data.reviewUrl);
            }
        } catch (err: any) {
            console.error(err);
            addToast(err.message || "Network error", "error");
        }
        setIsRequestingReview(false);
    };

    if (loading) {
        return (
            <Layout title="Draft Editor">
                <div className="flex items-center justify-center py-40">
                    <div className="text-secondary animate-pulse text-h4">Loading Draft...</div>
                </div>
            </Layout>
        );
    }

    if (notFound) {
        return (
            <Layout title="Draft Editor">
                <div className="card shadow-primary-4 p-12 text-center max-w-2xl mx-auto flex flex-col items-center justify-center my-12">
                    <Icon className="icon-28 mb-4 text-muted dark:fill-white/50" name="browser" />
                    <div className="text-h4 mb-2">Draft not found</div>
                    <div className="text-secondary mb-6 max-w-md mx-auto">
                        This draft might have been deleted, or you don't have permission to view it.
                    </div>
                    <Link href="/content-pipeline" className="btn-purple h-12 px-6">
                        Back to Pipeline
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title={draft?.title || "Draft Editor"}>
            <div className="flex flex-col h-[calc(100vh-140px)]">
                {/* Header Navigation */}
                <div className="flex items-center justify-between mb-6 shrink-0">
                    <div className="flex items-center gap-4">
                        <Link href="/content-pipeline" className="btn-stroke btn-square w-10 h-10 shrink-0 hover:border-purple-1 hover:text-purple-1 transition-colors">
                            <Icon name="arrow-prev" />
                        </Link>
                        <div>
                            <div className="text-h4 line-clamp-1">{draft?.title}</div>
                            <div className="flex items-center text-sm font-semibold gap-2 mt-1">
                                <span className={`capitalize px-2 py-0.5 rounded text-xs ${draft?.status === 'published' ? 'bg-blue-1/20 text-blue-1'
                                    : draft?.status === 'scheduled' ? 'bg-green-1/20 text-green-1'
                                        : 'bg-orange-1/20 text-orange-1'
                                    }`}>
                                    {draft?.status}
                                </span>
                                {saveState === 'saving' && <span className="text-n-4 animate-pulse">Saving...</span>}
                                {saveState === 'saved' && <span className="text-green-1 flex items-center"><Icon name="check" className="w-3 h-3 fill-current mr-1" />Saved</span>}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center shrink-0">
                        {draft?.status === 'draft' && (
                            <button
                                className={`btn-purple h-12 px-6 ${isRequestingReview ? 'opacity-60 cursor-not-allowed' : ''}`}
                                onClick={handleSendForApproval}
                                disabled={isRequestingReview}
                            >
                                <Icon name="link" />
                                <span>{isRequestingReview ? "Generating..." : "Send for Approval"}</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Editor Surface */}
                <div className="flex-1 bg-white dark:bg-n-2 border border-n-1 dark:border-white/10 shadow-primary-4 rounded-xl overflow-hidden flex flex-col relative focus-within:border-purple-1 transition-colors">
                    <textarea
                        className="w-full flex-1 p-8 md:p-12 resize-none outline-none bg-transparent text-n-7 dark:text-white leading-relaxed text-lg"
                        placeholder="Start typing your content..."
                        value={content}
                        onChange={handleContentChange}
                    />
                </div>
            </div>
        </Layout>
    );
}
