import { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import Icon from "@/components/Icon";
import Select from "@/components/Select";
import { useToast } from "@/components/Toast";
import { supabase } from "@/utils/supabase";
import { getEntitlements } from "@/lib/entitlements";

const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['pdf', 'doc', 'docx', 'txt', 'csv'].includes(ext || '')) return 'document';
    if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(ext || '')) return 'image';
    return 'file';
};

export default function ClientAssets() {
    const { addToast } = useToast();
    const [clients, setClients] = useState<any[]>([]);
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const [assets, setAssets] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchClients = async () => {
            const email = localStorage.getItem('folio_user_email');
            if (!email) return;

            const { data, error } = await supabase
                .from('clients')
                .select('id, name')
                .eq('user_email', email)
                .order('created_at', { ascending: false });

            if (!error && data && data.length > 0) {
                const mapped = data.map(c => ({ value: c.id, label: c.name }));
                setClients([{ value: 'all', label: 'All Clients' }, ...mapped]);
                setSelectedClientId('all');
            } else {
                setClients([]);
            }
        };
        fetchClients();
    }, []);

    const fetchAssets = async () => {
        if (!selectedClientId || selectedClientId === 'all') {
            setAssets([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await supabase
                .storage
                .from('client-assets')
                .list(selectedClientId, { limit: 100, offset: 0, sortBy: { column: 'created_at', order: 'desc' } });

            if (error) {
                console.error("Fetch assets error:", error);
                addToast(error.message, "error");
            } else {
                const validAssets = (data || []).filter(file => file.name !== '.emptyFolderPlaceholder');
                setAssets(validAssets);
            }
        } catch (err: any) {
            console.error(err);
            addToast(err.message || "Failed to fetch assets", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedClientId && selectedClientId !== 'all') {
            fetchAssets();
        } else {
            setAssets([]);
        }
    }, [selectedClientId]);

    const handleUploadClick = () => {
        const { canUploadAsset, limits } = getEntitlements('free', {
            currentClients: Math.max(0, clients.length - 1),
            currentDraftsThisMonth: 0,
            currentAssets: assets.length
        });

        if (!canUploadAsset) {
            addToast(`Upgrade to Pro to upload more client assets. Free plan overrides max at ${limits.maxAssetsPerClient}.`, 'error');
            return;
        }

        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !selectedClientId || selectedClientId === 'all') return;

        setUploading(true);
        const filePath = `${selectedClientId}/${file.name}`;

        try {
            const { error } = await supabase
                .storage
                .from('client-assets')
                .upload(filePath, file);

            if (error) {
                if (error.message.includes('Duplicate')) {
                    addToast("A file with this name already exists", "error");
                } else {
                    console.error("Upload error:", error);
                    addToast(error.message, "error");
                }
            } else {
                addToast("Asset uploaded successfully", "success");
                await fetchAssets();
            }
        } catch (err: any) {
            console.error(err);
            addToast(err.message || "Upload failed", "error");
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDelete = async (file: any, e: React.MouseEvent) => {
        e.stopPropagation();

        if (!selectedClientId || selectedClientId === 'all') return;

        if (!window.confirm(`Are you sure you want to delete ${file.name}?`)) return;

        const previousAssets = [...assets];
        setAssets(assets.filter(a => a.name !== file.name));

        const filePath = `${selectedClientId}/${file.name}`;

        try {
            const { error } = await supabase
                .storage
                .from('client-assets')
                .remove([filePath]);

            if (error) {
                console.error("Delete error:", error);
                addToast(error.message, "error");
                setAssets(previousAssets);
            } else {
                addToast("Asset deleted", "success");
            }
        } catch (err: any) {
            console.error(err);
            addToast(err.message || "Delete failed", "error");
            setAssets(previousAssets);
        }
    };

    const handleOpenAsset = async (filename: string) => {
        if (!selectedClientId || selectedClientId === 'all') return;

        const filePath = `${selectedClientId}/${filename}`;

        try {
            const { data } = supabase
                .storage
                .from('client-assets')
                .getPublicUrl(filePath);

            if (data?.publicUrl) {
                window.open(data.publicUrl, '_blank', 'noopener,noreferrer');
            }
        } catch (err: any) {
            console.error(err);
            addToast("Failed to open asset URL", "error");
        }
    };

    const isClientSelected = selectedClientId && selectedClientId !== 'all';

    return (
        <Layout title="Client Assets">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="text-h4">Client Assets</div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    {clients.length > 0 && (
                        <Select
                            className="w-full md:w-48 z-10"
                            items={clients.map(c => ({ id: c.value, title: c.label }))}
                            value={selectedClientId ? { id: selectedClientId, title: clients.find(c => c.value === selectedClientId)?.label } : null}
                            onChange={(item: any) => setSelectedClientId(item.id)}
                        />
                    )}

                    {isClientSelected && (
                        <>
                            <input
                                type="file"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />
                            <button
                                className={`btn-purple h-12 px-6 shrink-0 ${uploading ? 'opacity-60 cursor-not-allowed' : ''}`}
                                onClick={handleUploadClick}
                                disabled={uploading || loading}
                            >
                                <Icon name="upload" />
                                <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="flex-1">
                {!isClientSelected ? (
                    <div className="card shadow-primary-4 p-12 text-center max-w-2xl mx-auto flex flex-col items-center justify-center my-12">
                        <Icon className="icon-28 mb-4 text-purple-1 dark:fill-white/50" name="folder" />
                        <div className="text-h4 mb-2">Select a client to view or upload assets</div>
                        <div className="text-secondary mb-6 max-w-md mx-auto">
                            Assets are securely scoped to specific clients. Please choose a client from the dropdown above to access their files.
                        </div>
                    </div>
                ) : loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="card p-6 animate-pulse flex items-center gap-4 border border-n-1 dark:border-white/10">
                                <div className="w-10 h-10 rounded bg-n-3 dark:bg-n-2 shrink-0"></div>
                                <div className="flex-1">
                                    <div className="h-4 bg-n-3 dark:bg-n-2 w-3/4 rounded mb-2"></div>
                                    <div className="h-3 bg-n-3 dark:bg-n-2 w-1/2 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : assets.length === 0 ? (
                    <div className="card shadow-primary-4 p-12 text-center max-w-2xl mx-auto flex flex-col items-center justify-center my-12">
                        <Icon className="icon-28 mb-4 text-orange-1 dark:fill-white/50" name="file-empty" />
                        <div className="text-h4 mb-2">No assets uploaded for this client yet.</div>
                        <div className="text-secondary mb-6 max-w-md mx-auto">
                            Upload client documents, brand guidelines, and old transcripts so the AI can learn their voice.
                        </div>
                        <button
                            className={`btn-purple btn-shadow h-12 px-6 ${uploading ? 'opacity-60 cursor-not-allowed' : ''}`}
                            onClick={handleUploadClick}
                            disabled={uploading}
                        >
                            <Icon name="upload" />
                            <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {assets.map((file) => (
                            <div
                                key={file.id || file.name}
                                className="card p-5 hover:shadow-primary-4 transition-shadow cursor-pointer border border-n-1 dark:border-white/10 flex flex-col group relative overflow-hidden"
                                onClick={() => handleOpenAsset(file.name)}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-purple-1/10 text-purple-1 flex items-center justify-center shrink-0 group-hover:bg-purple-1 group-hover:text-white transition-colors">
                                        <Icon name={getFileIcon(file.name)} className="w-6 h-6 fill-current" />
                                    </div>
                                    <button
                                        className="w-8 h-8 rounded-full bg-n-2 dark:bg-n-1 text-secondary hover:text-orange-1 hover:bg-orange-1/10 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                                        onClick={(e) => handleDelete(file, e)}
                                        title="Delete Asset"
                                    >
                                        <Icon name="trash" className="w-4 h-4 fill-current" />
                                    </button>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-bold truncate mb-1">{file.name}</div>
                                    <div className="text-xs font-semibold text-secondary flex items-center gap-2">
                                        <span>{formatBytes(file.metadata?.size || 0)}</span>
                                        <span className="w-1 h-1 rounded-full bg-n-4"></span>
                                        <span>{file.created_at ? new Date(file.created_at).toLocaleDateString() : 'Unknown date'}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
