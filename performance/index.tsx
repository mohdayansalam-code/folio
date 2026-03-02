import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Icon from "@/components/Icon";
import Select from "@/components/Select";
import Field from "@/components/Field";
import { useToast } from "@/components/Toast";
import { supabase } from "@/utils/supabase";
import { getEntitlements } from "@/lib/entitlements";

interface PerformanceData {
    id: string;
    client_id: string;
    impressions: number;
    comments: number;
    meetings: number;
    created_at: string;
}

interface ClientOption {
    value: string;
    label: string;
}

export default function PerformanceIndex() {
    const { addToast } = useToast();
    const [clients, setClients] = useState<ClientOption[]>([]);
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const [data, setData] = useState<PerformanceData[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [totalGlobalEntries, setTotalGlobalEntries] = useState(0);

    // Form state
    const [impressions, setImpressions] = useState("");
    const [comments, setComments] = useState("");
    const [meetings, setMeetings] = useState("");

    useEffect(() => {
        const fetchClients = async () => {
            const email = localStorage.getItem('folio_user_email');
            if (!email) return;

            const { data: clientsData, error } = await supabase
                .from('clients')
                .select('id, name')
                .eq('user_email', email)
                .order('created_at', { ascending: false });

            if (!error && clientsData && clientsData.length > 0) {
                const mapped = clientsData.map(c => ({ value: c.id, label: c.name }));
                setClients([{ value: 'all', label: 'All Clients' }, ...mapped]);
                setSelectedClientId('all');
            } else {
                setClients([]);
            }
        };
        fetchClients();
    }, []);

    const fetchPerformance = async () => {
        if (!selectedClientId) return;
        setLoading(true);

        try {
            // First, get global count for entitlements independently
            const validClientIds = clients.filter(c => c.value !== 'all').map(c => c.value);
            if (validClientIds.length > 0) {
                const { count } = await supabase
                    .from('performance')
                    .select('id', { count: 'exact', head: true })
                    .in('client_id', validClientIds);
                setTotalGlobalEntries(count || 0);
            }

            let query = supabase
                .from('performance')
                .select('*')
                .order('created_at', { ascending: false });

            if (selectedClientId !== 'all') {
                query = query.eq('client_id', selectedClientId);
            }

            const { data: perfData, error } = await query;

            if (error) {
                addToast(error.message, "error");
            } else {
                setData(perfData as PerformanceData[] || []);
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Failed to load mapping";
            addToast(errorMessage, "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedClientId && clients.length > 0) {
            fetchPerformance();
        } else {
            setData([]);
        }
    }, [selectedClientId, clients.length]);

    const { canLogPerformance, limits } = getEntitlements('free', {
        currentClients: Math.max(0, clients.length - 1),
        currentDraftsThisMonth: 0,
        currentPerformanceEntries: totalGlobalEntries
    });

    const isClientSelected = selectedClientId && selectedClientId !== 'all';

    const handleSave = async () => {
        if (!isClientSelected) {
            addToast("Please select a specific client first.", "error");
            return;
        }

        if (!canLogPerformance) {
            addToast(`Free plan is limited to ${limits.maxPerformanceEntries} performance entries total. Upgrade to Pro.`, "error");
            return;
        }

        const imp = parseInt(impressions);
        const com = parseInt(comments);
        const mee = parseInt(meetings);

        if (isNaN(imp) || imp < 0 || isNaN(com) || com < 0 || isNaN(mee) || mee < 0) {
            addToast("All fields must be valid numbers ≥ 0.", "error");
            return;
        }

        if (impressions === "" || comments === "" || meetings === "") {
            addToast("Please fill out all fields before saving.", "error");
            return;
        }

        setSaving(true);

        try {
            const { error } = await supabase
                .from('performance')
                .insert({
                    client_id: selectedClientId,
                    impressions: imp,
                    comments: com,
                    meetings: mee
                });

            if (error) {
                addToast(error.message, "error");
            } else {
                addToast("Performance data logged successfully", "success");
                setImpressions("");
                setComments("");
                setMeetings("");
                await fetchPerformance();
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Save failed";
            addToast(errorMessage, "error");
        } finally {
            setSaving(false);
        }
    };

    const handleExport = () => {
        if (data.length === 0) {
            addToast("No data to export.", "error");
            return;
        }

        const headers = ["Date", "Client Name", "Impressions", "Comments", "Meetings"];

        const rows = data.map(item => {
            const clientName = clients.find(c => c.value === item.client_id)?.label || 'Unknown Client';
            const date = new Date(item.created_at).toLocaleDateString();
            return `"${date}","${clientName}",${item.impressions || 0},${item.comments || 0},${item.meetings || 0}`;
        });

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
        const encodedUri = encodeURI(csvContent);

        const clientLabel = isClientSelected ? clients.find(c => c.value === selectedClientId)?.label?.replace(/\s+/g, '-') : "All-Clients";
        const dateStr = new Date().toISOString().split('T')[0];
        const filename = `performance-report-${clientLabel}-${dateStr}.csv`;

        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const totalImpressions = data.reduce((sum, item) => sum + (item.impressions || 0), 0);
    const totalComments = data.reduce((sum, item) => sum + (item.comments || 0), 0);
    const totalMeetings = data.reduce((sum, item) => sum + (item.meetings || 0), 0);
    const totalEntries = data.length;

    return (
        <Layout title="Performance">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="text-h4">Performance Tracking</div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    {clients.length > 0 && (
                        <Select
                            className="w-full md:w-48 z-10"
                            items={clients.map(c => ({ id: c.value, title: c.label }))}
                            value={selectedClientId ? { id: selectedClientId, title: clients.find(c => c.value === selectedClientId)?.label } : null}
                            onChange={(item: ClientOption) => setSelectedClientId(item.value)}
                        />
                    )}

                    <button
                        className={`btn-stroke h-12 px-6 shrink-0 ${data.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleExport}
                        disabled={data.length === 0}
                    >
                        <Icon name="download" />
                        <span>Export Report</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-6">
                <div className="flex-1 flex flex-col gap-6">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="card shadow-primary-4 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-primary-6">
                            <div className="text-sm font-bold text-secondary mb-1">Total Impressions</div>
                            <div className="text-h3 text-purple-1">{totalImpressions.toLocaleString()}</div>
                        </div>
                        <div className="card shadow-primary-4 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-primary-6">
                            <div className="text-sm font-bold text-secondary mb-1">Total Comments</div>
                            <div className="text-h3 text-green-1">{totalComments.toLocaleString()}</div>
                        </div>
                        <div className="card shadow-primary-4 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-primary-6">
                            <div className="text-sm font-bold text-secondary mb-1">Total Meetings</div>
                            <div className="text-h3 text-yellow-1">{totalMeetings.toLocaleString()}</div>
                        </div>
                        <div className="card shadow-primary-4 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-primary-6">
                            <div className="text-sm font-bold text-secondary mb-1">Entries Logged</div>
                            <div className="text-h3 text-blue-1">{totalEntries.toLocaleString()}</div>
                        </div>
                    </div>

                    {/* Table or Empty States */}
                    {!selectedClientId ? (
                        <div className="card shadow-primary-4 p-12 text-center flex flex-col items-center justify-center my-4 h-[300px]">
                            <Icon className="icon-28 mb-4 text-purple-1 dark:fill-white/50" name="profile" />
                            <div className="text-h4 mb-2">Select a client to view performance</div>
                            <div className="text-secondary max-w-md mx-auto">
                                Choose a client from the dropdown above to view their performance metrics or create new entries.
                            </div>
                        </div>
                    ) : loading ? (
                        <div className="card min-h-[300px] p-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="animate-pulse flex items-center justify-between border-b border-n-1 dark:border-white/10 py-4 last:border-0">
                                    <div className="h-4 bg-n-3 dark:bg-n-2 w-1/4 rounded"></div>
                                    <div className="h-4 bg-n-3 dark:bg-n-2 w-1/5 rounded"></div>
                                    <div className="h-4 bg-n-3 dark:bg-n-2 w-1/6 rounded"></div>
                                    <div className="h-4 bg-n-3 dark:bg-n-2 w-1/6 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : data.length === 0 ? (
                        <div className="card shadow-primary-4 p-12 text-center flex flex-col items-center justify-center my-4 h-[300px]">
                            <Icon className="icon-28 mb-4 text-orange-1 dark:fill-white/50" name="bar-chart" />
                            <div className="text-h4 mb-2">No performance data yet</div>
                            <div className="text-secondary mb-6 max-w-md mx-auto">
                                Use the manual input form on the right to log your first performance entry for this client.
                            </div>
                        </div>
                    ) : (
                        <div className="card shadow-primary-4 overflow-hidden">
                            <table className="table-custom w-full">
                                <thead>
                                    <tr>
                                        <th className="th-custom text-left">Date</th>
                                        <th className="th-custom text-left">Client Name</th>
                                        <th className="th-custom text-right">Impressions</th>
                                        <th className="th-custom text-right">Comments</th>
                                        <th className="th-custom text-right">Meetings</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item) => (
                                        <tr key={item.id} className="border-t border-n-1 dark:border-white/10 hover:bg-n-1/50 dark:hover:bg-white/5 transition-colors">
                                            <td className="td-custom text-left font-medium">
                                                {new Date(item.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="td-custom text-left text-secondary">
                                                {clients.find(c => c.value === item.client_id)?.label || 'Unknown'}
                                            </td>
                                            <td className="td-custom text-right font-bold text-n-7 dark:text-n-1">
                                                {item.impressions?.toLocaleString() || 0}
                                            </td>
                                            <td className="td-custom text-right font-bold text-n-7 dark:text-n-1">
                                                {item.comments?.toLocaleString() || 0}
                                            </td>
                                            <td className="td-custom text-right font-bold text-n-7 dark:text-n-1">
                                                {item.meetings?.toLocaleString() || 0}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Right Panel: Manual Input Form */}
                <div className="w-full xl:w-[340px] shrink-0">
                    <div className="card shadow-primary-4 sticky top-6">
                        <div className="card-head border-b border-n-1 dark:border-white/10 p-5">
                            <div className="text-h6">Manual Input</div>
                        </div>
                        <div className="p-5">
                            {!isClientSelected ? (
                                <div className="text-center py-10 bg-n-1 dark:bg-n-2/50 rounded-xl border border-dashed border-n-3 dark:border-white/20">
                                    <Icon name="profile" className="w-8 h-8 mx-auto mb-3 text-n-4" />
                                    <div className="text-sm font-bold mb-1">Select a Client</div>
                                    <div className="text-xs text-secondary px-4">
                                        Choose a specific client to log performance metrics.
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <Field
                                        label="Post Impressions"
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
                </div>
            </div>
        </Layout>
    );
}
