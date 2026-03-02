import { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import Select from "@/components/Select";
import Field from "@/components/Field";
import Icon from "@/components/Icon";
import Modal from "@/components/Modal";
import { useRouter } from "next/router";
import { useToast } from "@/components/Toast";
import { supabase } from "@/utils/supabase";

const cards = [
    { id: "voice_tone", title: "Voice & Tone", icon: "profile", color: "purple" },
    { id: "signature_stories", title: "Signature Stories", icon: "chat", color: "yellow" },
    { id: "offer_positioning", title: "Offer & Positioning", icon: "bag", color: "green" },
    { id: "proof_results", title: "Proof / Results", icon: "check", color: "pink" },
];

const ClientBrain = () => {
    const router = useRouter();
    const { addToast } = useToast();
    const isOnboarding = router.query.onboarding === 'true';
    const [visibleModal, setVisibleModal] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Asset states
    const [assets, setAssets] = useState<any[]>([]);
    const [uploading, setUploading] = useState<boolean>(false);

    // UI states
    const [clients, setClients] = useState<any[]>([]);
    const [client, setClient] = useState<any>(null);
    const [status, setStatus] = useState<"idle" | "processing" | "ready" | "loading">("loading");

    // Form states
    const [brainData, setBrainData] = useState({
        voice_tone: "",
        signature_stories: "",
        offer_positioning: "",
        proof_results: ""
    });

    // Track which client ID's data is currently in the inputs to prevent overwrite loops
    const [loadedClientId, setLoadedClientId] = useState<number | null>(null);

    useEffect(() => {
        let mounted = true;

        const fetchClients = async () => {
            const email = localStorage.getItem('folio_user_email');
            if (!email) {
                if (mounted) setStatus("idle");
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('clients')
                    .select('id, name')
                    .eq('user_email', email)
                    .order('created_at', { ascending: false });

                if (mounted && !error && data && data.length > 0) {
                    const mappedClients = data.map((c: any) => ({ id: c.id, title: c.name }));

                    setClients(prev => {
                        // Prevent React state churn if array is identical
                        if (JSON.stringify(prev) === JSON.stringify(mappedClients)) return prev;
                        return mappedClients;
                    });

                    setClient((prev: any) => {
                        // Never overwrite an active user selection with an initialization array wrapper
                        if (prev) return prev;
                        return mappedClients[0];
                    });
                } else if (mounted) {
                    setClients([]);
                    setClient(null);
                    setStatus("idle");
                }
            } catch (err) {
                console.error("fetchClients Error:", err);
            }
        };

        fetchClients();

        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        let mounted = true;

        const hydrateBrain = async () => {
            const email = localStorage.getItem('folio_user_email');
            if (!client || !email) return;

            const currentId = client.id;
            // Strict lockout: Never fetch & overwrite the inputs if we've already loaded this exact client
            if (loadedClientId === currentId) return;

            setStatus("loading");

            try {
                const { data, error } = await supabase
                    .from('client_brain')
                    .select('*')
                    .eq('client_id', currentId)
                    .single();

                const { data: assetsData } = await supabase.storage.from('client-assets').list(`${email}/${currentId}`);
                if (mounted && assetsData) {
                    setAssets(assetsData.filter(f => f.name !== '.emptyFolderPlaceholder'));
                }

                if (error || !data) {
                    // Create empty row automatically
                    await supabase.from('client_brain').insert({
                        client_id: currentId,
                        voice_tone: "",
                        signature_stories: "",
                        positioning: "",
                        proof_results: ""
                    });

                    if (mounted) {
                        setBrainData({ voice_tone: "", signature_stories: "", offer_positioning: "", proof_results: "" });
                        setLoadedClientId(currentId);
                        setStatus("idle");
                    }
                } else {
                    if (mounted) {
                        setBrainData({
                            voice_tone: data?.voice_tone || "",
                            signature_stories: data?.signature_stories || "",
                            offer_positioning: data?.positioning || "",
                            proof_results: data?.proof_results || ""
                        });

                        setLoadedClientId(currentId);
                        setStatus('idle');
                    }
                }
            } catch (err) {
                if (mounted) {
                    // Initialize empty if no rows found
                    setBrainData({ voice_tone: "", signature_stories: "", offer_positioning: "", proof_results: "" });
                    setAssets([]);
                    setLoadedClientId(currentId);
                    setStatus("idle");
                }
            }
        };

        hydrateBrain();

        return () => {
            mounted = false;
        };
    }, [client?.id, loadedClientId]);

    const handleFieldChange = (id: string, value: string) => {
        setBrainData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSave = async () => {
        const email = localStorage.getItem('folio_user_email');
        if (!client || !email) return;

        setStatus("loading");

        const { data: existing } = await supabase.from('client_brain').select('id').eq('client_id', client.id).single();

        let error;
        if (existing) {
            const result = await supabase.from('client_brain').update({
                voice_tone: brainData.voice_tone,
                signature_stories: brainData.signature_stories,
                positioning: brainData.offer_positioning,
                proof_results: brainData.proof_results,
            }).eq('client_id', client.id);
            error = result.error;
        } else {
            const result = await supabase.from('client_brain').insert({
                client_id: client.id,
                voice_tone: brainData.voice_tone,
                signature_stories: brainData.signature_stories,
                positioning: brainData.offer_positioning,
                proof_results: brainData.proof_results,
            });
            error = result.error;
        }

        if (!error) {
            setStatus("idle");
            addToast("Client Brain saved successfully.", "success");
        } else {
            console.error(error);
            setStatus("idle");
            addToast("Failed to save Client Brain.", "error");
        }
    };

    const handleFileUpload = async (files: FileList | null) => {
        const email = localStorage.getItem('folio_user_email');
        if (!client || !email || !files || files.length === 0) return;

        setUploading(true);

        const MAX_SIZE = 10 * 1024 * 1024; // 10MB
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            if (file.size > MAX_SIZE) {
                addToast(`${file.name} exceeds 10MB limit.`, "error");
                continue;
            }
            if (!validTypes.includes(file.type) && !file.name.endsWith('.pdf') && !file.name.endsWith('.docx') && !file.name.endsWith('.txt')) {
                addToast(`${file.name} is an unsupported type.`, "error");
                continue;
            }

            const path = `${email}/${client.id}/${file.name}`;
            const { error: uploadError } = await supabase.storage.from('client-assets').upload(path, file, {
                upsert: true
            });

            if (uploadError) {
                console.error("Upload Error:", uploadError);
                addToast(`Failed to upload ${file.name}. Ensure 'client-assets' bucket exists.`, "error");
            } else {
                setAssets(prev => [...prev.filter((a: any) => a.name !== file.name), { name: file.name }]);
                addToast(`${file.name} uploaded successfully.`, "success");
            }
        }

        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        handleFileUpload(e.dataTransfer.files);
    };

    const processBrain = async () => {
        console.log("AI disabled for now");
        addToast("AI processing is temporarily disabled.", "error");
    };

    return (
        <Layout title="Client Brain">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <div className="text-h4 mr-6">Client Brain</div>
                    {clients.length > 0 && client && (
                        <Select
                            className="w-48"
                            items={clients}
                            value={client}
                            onChange={setClient}
                            placeholder="Select Client"
                        />
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <button
                        className="btn-stroke h-12 px-6"
                        onClick={handleSave}
                        disabled={status === "loading" || !client}
                    >
                        <span>Save Changes</span>
                    </button>
                    <button
                        className="btn-purple btn-shadow h-12 px-6"
                        onClick={() => setVisibleModal(true)}
                    >
                        <Icon name="plus" />
                        <span>Upload Assets</span>
                    </button>
                </div>
            </div>

            {isOnboarding && (
                <div className="card shadow-primary-4 mb-8 bg-yellow-1 border border-yellow-1 dark:bg-yellow-1/10 dark:border-yellow-1/20 p-6 flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-1/20 flex items-center justify-center dark:bg-yellow-1/10">
                        <Icon className="icon-20 fill-yellow-1" name="magic" />
                    </div>
                    <div>
                        <div className="text-h6 mb-1 text-muted ">Train the AI Brain</div>
                        <div className="text-muted text-sm max-w-2xl">
                            Fill out the fields below or upload past content files (.pdf, .docx). Once complete, click <strong>"Process Client Brain"</strong> to lock in the voice clone and unlock the content generation tools.
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center mb-8">
                <div className={`mr-4 ${status === "idle" ? "label-stroke" : status === "loading" || status === "processing" ? "label-stroke-yellow" : "label-stroke-green"}`}>
                    {status === "idle" ? "Idle" : status === "loading" ? "Hydrating" : status === "processing" ? "Processing" : "Ready"}
                </div>
                <div className="text-sm text-secondary font-bold">
                    {status === "idle" ? "Waiting for assets" : status === "loading" ? "Pulling specific client telemetry..." : status === "processing" ? "AI is analyzing assets..." : "Last processed: Just now"}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 sm:grid-cols-1">
                {cards.map((card) => (
                    <div key={card.id} className="card shadow-primary-4 pb-6">
                        <div className="card-head">
                            <div className="text-h6 flex items-center">
                                <div className={`flex items-center justify-center w-8 h-8 mr-3 rounded-sm border border-n-1 bg-${card.color}-1`}>
                                    <Icon className="icon-16" name={card.icon} />
                                </div>
                                {card.title}
                            </div>
                        </div>
                        <div className="px-6 pt-6">
                            <Field
                                className="w-full"
                                textarea
                                placeholder={`Enter ${card.title.toLowerCase()} context here...`}
                                value={brainData[card.id as keyof typeof brainData] || ""}
                                onChange={(e: any) => handleFieldChange(card.id, e.target.value)}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div
                className={`mt-12 card shadow-primary-4 p-8 text-center border-2 border-dashed border-n-3 transition-colors ${uploading ? 'bg-n-2/50 dark:bg-white/5 border-purple-1' : 'hover:border-purple-1 hover:bg-n-2/30 dark:hover:bg-white/5'}`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <Icon className="icon-28 mb-4 mx-auto" name="upload" />
                <div className="text-h6 mb-2">Upload Context Assets</div>
                <div className="text-sm text-secondary mb-6">PDF, DOCX, TXT up to 10MB</div>
                <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    className="hidden"
                    accept=".pdf,.docx,.txt"
                    onChange={(e) => handleFileUpload(e.target.files)}
                />
                <button
                    className="btn-stroke h-12 px-6 mb-8"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                >
                    {uploading ? 'Uploading...' : 'Choose Files'}
                </button>
                <div className="w-full h-px bg-n-1/10 dark:bg-white/10 mb-8"></div>
                {assets.length > 0 && (
                    <div className="text-left max-w-sm mx-auto mb-8">
                        <div className="text-xs font-bold text-secondary uppercase tracking-wider mb-3">Uploaded Assets</div>
                        <ul className="space-y-2">
                            {assets.map((asset: any, i: number) => (
                                <li key={i} className="flex items-center text-sm font-medium bg-white dark:bg-n-1 px-4 py-2 border border-n-1 dark:border-white/10 shadow-primary-4 rounded-sm">
                                    <Icon name="file" className="icon-16 mr-2 text-purple-1" />
                                    <span className="truncate">{asset.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <button
                    className={`btn-purple btn-shadow h-14 w-full max-w-sm text-h6 ${status === "processing" || status === "loading" || !client ? "opacity-70 cursor-not-allowed" : ""}`}
                    disabled={status === "processing" || status === "loading" || !client}
                    onClick={processBrain}
                >
                    {status === "processing" ? "Processing..." : "Process Client Brain"}
                </button>
            </div>

            <Modal
                visible={visibleModal}
                onClose={() => setVisibleModal(false)}
                title="Upload Client Assets"
            >
                <div className="p-6 text-center border-2 border-dashed border-n-3 rounded-sm">
                    <Icon className="icon-24 mb-4 mx-auto" name="upload" />
                    <div className="text-sm font-bold mb-2">Drop files here or click to upload</div>
                    <div className="text-xs text-secondary">PDF, DOCX, TXT up to 10MB</div>
                </div>
                <div className="flex mt-8">
                    <button className="btn-stroke flex-1 h-12 mr-4" onClick={() => setVisibleModal(false)}>Cancel</button>
                    <button className="btn-purple flex-1 h-12">Process with AI</button>
                </div>
            </Modal>
        </Layout>
    );
};

export default ClientBrain;
