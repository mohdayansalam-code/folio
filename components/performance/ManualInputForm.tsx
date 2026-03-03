import { useState, useEffect } from "react";
import Field from "@/components/Field";
import Select from "@/components/Select";
import Icon from "@/components/Icon";
import { supabase } from "@/utils/supabase";
import { useToast } from "@/components/Toast";

interface ManualInputFormProps {
    selectedClientId: string | null;
    canLogPerformance: boolean;
    onSaveSuccess: () => void;
}

export default function ManualInputForm({ selectedClientId, canLogPerformance, onSaveSuccess }: ManualInputFormProps) {
    const { addToast } = useToast();
    const [impressions, setImpressions] = useState("");
    const [comments, setComments] = useState("");
    const [meetings, setMeetings] = useState("");
    const [saving, setSaving] = useState(false);

    // Draft Attachment States
    const [publishedDrafts, setPublishedDrafts] = useState<any[]>([]);
    const [selectedDraft, setSelectedDraft] = useState<any | null>(null);

    useEffect(() => {
        async function fetchDrafts() {
            if (!selectedClientId) {
                setPublishedDrafts([]);
                setSelectedDraft(null);
                return;
            }
            const { data, error } = await supabase
                .from('drafts')
                .select('id, title')
                .eq('client_id', selectedClientId)
                .eq('status', 'published');

            if (!error && data) {
                setPublishedDrafts(data);
            }
            setSelectedDraft(null);
        }
        fetchDrafts();
    }, [selectedClientId]);

    const draftOptions = [
        { id: "", title: "Do not attach to post" },
        ...publishedDrafts.map(d => ({ id: d.id, title: d.title || "Untitled Draft" }))
    ];
    const currentSelectedDraft = selectedDraft || draftOptions[0];

    const handleSave = async () => {
        if (selectedClientId === null) {
            addToast("Please select a specific client first.", "error");
            return;
        }

        if (!canLogPerformance) {
            addToast("Free plan limit reached. Upgrade to Pro to log more metrics.", "error");
            return;
        }

        if (impressions === "" && comments === "" && meetings === "") {
            addToast("Please fill out at least one field before saving.", "error");
            return;
        }

        const imp = parseInt(impressions || "0");
        const com = parseInt(comments || "0");
        const mee = parseInt(meetings || "0");

        if (isNaN(imp) || imp < 0 || isNaN(com) || com < 0 || isNaN(mee) || mee < 0) {
            addToast("All fields must be valid numbers ≥ 0.", "error");
            return;
        }

        setSaving(true);

        try {
            const { error } = await supabase
                .from('performance')
                .insert({
                    client_id: selectedClientId,
                    draft_id: selectedDraft && selectedDraft.id !== "" ? selectedDraft.id : null,
                    impressions: imp,
                    comments: com,
                    meetings: mee
                });

            if (error) throw error;

            addToast("Performance data logged successfully", "success");
            setImpressions("");
            setComments("");
            setMeetings("");
            setSelectedDraft(null);
            onSaveSuccess();
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Save failed";
            addToast(errorMessage, "error");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="card shadow-primary-4 sticky top-6">
            <div className="card-head border-b border-n-1 dark:border-white/10 p-5">
                <div className="text-h6">Manual Input</div>
            </div>
            <div className="p-5">
                {selectedClientId === null ? (
                    <div className="text-center py-10">
                        <div className="text-h6 text-secondary font-medium">Select a client to log performance data</div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <Select
                            className="mb-4 z-20"
                            label="Attach to Post (optional)"
                            items={draftOptions}
                            value={currentSelectedDraft}
                            onChange={(item: any) => setSelectedDraft(item)}
                        />
                        <Field
                            label="Impressions"
                            placeholder="0"
                            type="number"
                            value={impressions}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImpressions(e.target.value)}
                            required
                        />
                        <Field
                            label="Comments / DMs"
                            placeholder="0"
                            type="number"
                            value={comments}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setComments(e.target.value)}
                            required
                        />
                        <Field
                            label="Meetings Booked"
                            placeholder="0"
                            type="number"
                            value={meetings}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMeetings(e.target.value)}
                            required
                        />
                        <button
                            className={`btn-purple w-full h-12 shadow-primary-4 mt-2 ${(saving || !canLogPerformance) ? 'opacity-60 cursor-not-allowed' : 'active:translate-y-[1px]'}`}
                            disabled={saving || !canLogPerformance}
                            onClick={handleSave}
                        >
                            {saving ? 'Saving...' : 'Save Performance Data'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
