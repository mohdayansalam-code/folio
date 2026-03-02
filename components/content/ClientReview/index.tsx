import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useToast } from "@/components/Toast";
import Icon from "@/components/Icon";

export default function ClientReview() {
    const router = useRouter();
    const { token } = router.query;
    const { addToast } = useToast();

    const [draft, setDraft] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isMutating, setIsMutating] = useState(false);
    const [errorObj, setErrorObj] = useState<string | null>(null);

    useEffect(() => {
        const fetchDraft = async () => {
            if (!token || typeof token !== 'string') return;

            try {
                const res = await fetch(`/api/review/get?token=${token}`);
                const data = await res.json();

                if (!res.ok) {
                    setErrorObj(data.error || "Failed to load review");
                } else {
                    setDraft(data.draft);
                }
            } catch (err: any) {
                console.error(err);
                setErrorObj(err.message || "Network error");
            } finally {
                setLoading(false);
            }
        };

        fetchDraft();
    }, [token]);

    const handleAction = async (action: 'approve' | 'request-changes') => {
        setIsMutating(true);
        try {
            const res = await fetch(`/api/review/${action}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token })
            });
            const data = await res.json();

            if (!res.ok) {
                addToast(data.error || `Failed to ${action}`, "error");
            } else {
                addToast(action === 'approve' ? "Draft Approved!" : "Changes Requested", "success");
                setDraft((prev: any) => ({ ...prev, status: action === 'approve' ? 'approved' : 'draft' }));
            }
        } catch (err: any) {
            console.error(err);
            addToast(err.message || "Network error", "error");
        }
        setIsMutating(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-n-2 dark:bg-n-1 flex items-center justify-center">
                <div className="text-secondary animate-pulse text-h4">Loading Client Review...</div>
            </div>
        );
    }

    if (errorObj || !draft) {
        return (
            <div className="min-h-screen bg-n-2 dark:bg-n-1 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-n-2 w-full max-w-2xl rounded-xl p-12 shadow-primary-4 text-center">
                    <Icon className="icon-28 mb-4 text-orange-1 mx-auto" name="warning" />
                    <div className="text-h4 mb-2">Review Link Invalid</div>
                    <div className="text-secondary mb-6">
                        {errorObj || "This link may have expired or you have already completed the review."}
                    </div>
                </div>
            </div>
        );
    }

    const isReviewed = draft.status === 'approved' || draft.status === 'draft';

    return (
        <div className="min-h-screen bg-n-2 dark:bg-n-1 flex flex-col items-center py-12 px-4">
            <div className="w-full max-w-4xl">
                {/* Header elements */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-white dark:bg-n-2 p-6 rounded-xl shadow-primary-4">
                    <div>
                        <div className="label-stroke-purple text-xs mb-2 inline-block">Client Preview</div>
                        <h1 className="text-h3">{draft.title}</h1>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        {isReviewed ? (
                            <div className={`px-4 py-2 rounded-lg font-bold ${draft.status === 'approved' ? 'bg-green-1/20 text-green-1' : 'bg-orange-1/20 text-orange-1'}`}>
                                {draft.status === 'approved' ? 'Approved' : 'Changes Requested'}
                            </div>
                        ) : (
                            <>
                                <button
                                    className={`btn-stroke h-12 px-6 ${isMutating ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    onClick={() => handleAction('request-changes')}
                                    disabled={isMutating}
                                >
                                    Request Changes
                                </button>
                                <button
                                    className={`btn-purple h-12 px-6 ${isMutating ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    onClick={() => handleAction('approve')}
                                    disabled={isMutating}
                                >
                                    <Icon name="check" />
                                    <span>Approve Draft</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Content Area */}
                <div className="bg-white dark:bg-n-2 border border-n-1 dark:border-white/10 shadow-primary-4 rounded-xl overflow-hidden p-8 md:p-12 min-h-[50vh]">
                    {draft.content ? (
                        <div className="text-n-7 dark:text-white leading-relaxed text-lg whitespace-pre-wrap">
                            {draft.content}
                        </div>
                    ) : (
                        <div className="text-secondary italic text-center py-20">No content provided yet.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
