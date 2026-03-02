import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Icon from "@/components/Icon";
import Select from "@/components/Select";
import { supabase } from "@/utils/supabase";
import { getEntitlements } from "@/lib/entitlements";
import { useToast } from "@/components/Toast";

import PerformanceKPIs from "./PerformanceKPIs";
import PerformanceTable from "./PerformanceTable";
import ManualInputForm from "./ManualInputForm";
import { exportPerformanceCSV } from "@/lib/exportCsv";

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

export default function PerformancePage() {
    const { addToast } = useToast();
    const [clients, setClients] = useState<ClientOption[]>([]);
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const [entries, setEntries] = useState<PerformanceData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalGlobalEntries, setTotalGlobalEntries] = useState(0);

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
                setClients(mapped);
                setSelectedClientId(null);
            } else {
                setClients([]);
                setSelectedClientId(null);
            }
        };
        fetchClients();
    }, []);

    const fetchPerformance = async () => {
        if (!selectedClientId) return;
        setIsLoading(true);

        try {
            // Get global count for entitlements independently
            const validClientIds = clients.map(c => c.value);
            if (validClientIds.length > 0) {
                const { count } = await supabase
                    .from('performance')
                    .select('id', { count: 'exact', head: true })
                    .in('client_id', validClientIds);
                setTotalGlobalEntries(count || 0);
            }

            const query = supabase
                .from('performance')
                .select('*')
                .eq('client_id', selectedClientId)
                .order('created_at', { ascending: false });

            const { data: perfData, error } = await query;

            if (error) {
                addToast(error.message, "error");
            } else {
                setEntries((perfData as PerformanceData[]) || []);
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Failed to load mapping";
            addToast(errorMessage, "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (selectedClientId && clients.length > 0) {
            fetchPerformance();
        } else {
            setEntries([]);
        }
    }, [selectedClientId, clients.length]);

    const { canLogPerformance, limits } = getEntitlements('free', {
        currentClients: Math.max(0, clients.length - 1),
        currentDraftsThisMonth: 0,
        currentPerformanceEntries: totalGlobalEntries
    });

    const activeClientName = selectedClientId ? clients.find(c => c.value === selectedClientId)?.label || 'Unknown' : 'All Clients';

    const handleExport = () => {
        if (entries.length === 0) {
            addToast("No data to export.", "error");
            return;
        }
        exportPerformanceCSV(entries, activeClientName);
    };

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
                            onChange={(item: { id: string; title: string }) => setSelectedClientId(item.id)}
                        />
                    )}

                    <button
                        className={`btn-stroke h-12 px-6 shrink-0 ${entries.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleExport}
                        disabled={entries.length === 0}
                    >
                        <Icon name="download" />
                        <span>Export Report</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-6">
                <div className="flex-1 flex flex-col gap-6">

                    {selectedClientId === null && (
                        <div className="card shadow-primary-4 p-12 text-center flex flex-col items-center justify-center">
                            <Icon className="icon-28 mb-4 text-purple-1 dark:fill-white/50" name="profile" />
                            <div className="text-h4 mb-2">Select a client to view performance</div>
                            <div className="text-secondary max-w-md mx-auto">
                                Choose a client from the dropdown above to view their performance metrics or create new entries.
                            </div>
                        </div>
                    )}

                    <PerformanceKPIs entries={selectedClientId === null ? [] : entries} />

                    {selectedClientId !== null && isLoading ? (
                        <div className="card min-h-[300px] p-6 mt-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="animate-pulse flex items-center justify-between border-b border-n-1 dark:border-white/10 py-4 last:border-0">
                                    <div className="h-4 bg-n-3 dark:bg-n-2 w-1/4 rounded"></div>
                                    <div className="h-4 bg-n-3 dark:bg-n-2 w-1/5 rounded"></div>
                                    <div className="h-4 bg-n-3 dark:bg-n-2 w-1/6 rounded"></div>
                                    <div className="h-4 bg-n-3 dark:bg-n-2 w-1/6 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <PerformanceTable entries={selectedClientId === null ? [] : entries} />
                    )}
                </div>

                <div className="w-full xl:w-[340px] shrink-0">
                    <ManualInputForm
                        selectedClientId={selectedClientId}
                        canLogPerformance={canLogPerformance}
                        onSaveSuccess={fetchPerformance}
                    />
                </div>
            </div>
        </Layout>
    );
}
