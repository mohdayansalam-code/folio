import { useState, useEffect, useMemo } from "react";
import Layout from "@/components/Layout";
import Icon from "@/components/Icon";
import { supabase } from "@/utils/supabase";
import Link from "next/link";
import { useToast } from "@/components/Toast";
import { getEntitlements } from "@/lib/entitlements";
import UpgradeCTA from "@/components/UpgradeCTA";

export default function AnalyticsDashboard() {
    const { addToast } = useToast();
    const [drafts, setDrafts] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            const email = localStorage.getItem("folio_user_email");
            if (!email) return;

            // Fetch Drafts
            const { data: draftsData, error: draftsError } = await supabase
                .from("drafts")
                .select("*")
                .eq("user_email", email);

            if (draftsError) {
                console.error("Fetch drafts error:", draftsError);
                addToast(draftsError.message, "error");
            } else {
                setDrafts(draftsData || []);
            }

            // Fetch Clients for mapping
            const { data: clientsData, error: clientsError } = await supabase
                .from("clients")
                .select("id, name")
                .eq("user_email", email);

            if (clientsError) {
                console.error("Fetch clients error:", clientsError);
            } else {
                setClients(clientsData || []);
            }

            setLoading(false);
        };

        fetchAnalyticsData();
    }, [addToast]);

    const { canViewAnalytics } = getEntitlements('free', {
        currentClients: clients.length,
        currentDraftsThisMonth: drafts.length
    });

    const isThisWeek = (dateString: string) => {
        if (!dateString) return false;
        const date = new Date(dateString);
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        return date >= startOfWeek && date <= endOfWeek;
    };

    // Derived Metrics Logic (No SQL)
    const metrics = useMemo(() => {
        let activeDrafts = drafts;
        if (selectedClientId && selectedClientId !== "all") {
            activeDrafts = drafts.filter((d) => d.client_id === selectedClientId);
        }

        const stats = {
            totalDrafts: activeDrafts.length,
            awaitingApproval: activeDrafts.filter(d => d.status === "awaiting_approval").length,
            approved: activeDrafts.filter(d => d.status === "approved").length,
            scheduled: activeDrafts.filter(d => d.status === "scheduled").length,
            published: activeDrafts.filter(d => d.status === "published").length,
            weeklyScheduled: activeDrafts.filter(d => d.status === "scheduled" && isThisWeek(d.scheduled_at)).length,
            weeklyPublished: activeDrafts.filter(d => d.status === "published" && isThisWeek(d.created_at)).length, // fallback logic
            weeklyCreated: activeDrafts.filter(d => isThisWeek(d.created_at)).length,
        };
        return stats;
    }, [drafts, selectedClientId]);

    const clientBreakdown = useMemo(() => {
        return clients.map(client => {
            const clientDrafts = drafts.filter(d => d.client_id === client.id);
            const total = clientDrafts.length;
            const finalized = clientDrafts.filter(d => ["approved", "scheduled", "published"].includes(d.status)).length;
            const approvalRate = total > 0 ? Math.round((finalized / total) * 100) : 0;

            return {
                ...client,
                totalDrafts: total,
                awaitingApproval: clientDrafts.filter(d => d.status === "awaiting_approval").length,
                approved: clientDrafts.filter(d => d.status === "approved").length,
                scheduled: clientDrafts.filter(d => d.status === "scheduled").length,
                published: clientDrafts.filter(d => d.status === "published").length,
                approvalRate
            };
        }).sort((a, b) => b.totalDrafts - a.totalDrafts);
    }, [drafts, clients]);

    if (loading) {
        return (
            <Layout title="Analytics">
                <div className="flex items-center justify-center py-40">
                    <div className="text-secondary animate-pulse text-h4">Crunching Analytics...</div>
                </div>
            </Layout>
        );
    }

    if (drafts.length === 0) {
        return (
            <Layout title="Analytics">
                <div className="card shadow-primary-4 p-12 text-center max-w-2xl mx-auto flex flex-col items-center justify-center my-12">
                    <Icon className="icon-28 mb-4 text-purple-1" name="chart-1" />
                    <div className="text-h4 mb-2">No analytics yet</div>
                    <div className="text-secondary mb-6 max-w-md mx-auto">
                        We derive metrics directly from your Content Pipeline. Publish or schedule your first post to unlock these insights.
                    </div>
                    <Link href="/content-pipeline" className="btn-purple h-12 px-6">
                        <Icon name="kanban" />
                        <span>Go to Content Pipeline</span>
                    </Link>
                </div>
            </Layout>
        );
    }

    if (!canViewAnalytics) {
        return (
            <Layout title="Analytics">
                <UpgradeCTA
                    title="Unlock Agency Analytics"
                    description="The Free plan limits performance views. Upgrade to Pro to track client approvals, posting velocity, and unlock the entire Content ROI engine."
                />
            </Layout>
        );
    }

    return (
        <Layout title="Content Analytics">
            <div className="mb-8">
                <div className="text-h3 mb-2">Content ROI Performance</div>
                <div className="text-secondary">Agency-grade intelligence across your pipelines.</div>
            </div>

            {/* Top KPIs */}
            <div className="flex flex-wrap -mx-2 mb-8">
                <div className="w-1/2 lg:w-1/4 px-2 mb-4">
                    <div className="card p-6 border border-n-1 dark:border-white/10 shadow-primary-4 rounded-xl">
                        <div className="text-secondary text-sm font-semibold mb-2">Total Drafts</div>
                        <div className="text-h2 text-purple-1">{metrics.totalDrafts}</div>
                        <div className="text-xs text-muted mt-2">Active across pipeline</div>
                    </div>
                </div>
                <div className="w-1/2 lg:w-1/4 px-2 mb-4">
                    <div className="card p-6 border border-n-1 dark:border-white/10 shadow-primary-4 rounded-xl">
                        <div className="text-secondary text-sm font-semibold mb-2">Awaiting Approval</div>
                        <div className="text-h2 text-orange-1">{metrics.awaitingApproval}</div>
                        <div className="text-xs text-muted mt-2">Pending client review</div>
                    </div>
                </div>
                <div className="w-1/2 lg:w-1/4 px-2 mb-4">
                    <div className="card p-6 border border-n-1 dark:border-white/10 shadow-primary-4 rounded-xl">
                        <div className="text-secondary text-sm font-semibold mb-2">Scheduled</div>
                        <div className="text-h2 text-green-1">{metrics.scheduled}</div>
                        <div className="text-xs text-muted mt-2">Ready to post</div>
                    </div>
                </div>
                <div className="w-1/2 lg:w-1/4 px-2 mb-4">
                    <div className="card p-6 border border-n-1 dark:border-white/10 shadow-primary-4 rounded-xl">
                        <div className="text-secondary text-sm font-semibold mb-2">Published</div>
                        <div className="text-h2 text-blue-1">{metrics.published}</div>
                        <div className="text-xs text-muted mt-2">Live on LinkedIn</div>
                    </div>
                </div>
            </div>

            {/* Weekly Trend Summary */}
            <div className="card p-8 border border-n-1 dark:border-white/10 shadow-primary-4 rounded-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <div className="text-h6 mb-1">Weekly Momentum</div>
                    <div className="text-sm text-secondary">Your execution velocity this week.</div>
                </div>
                <div className="flex gap-8">
                    <div className="text-center">
                        <div className="text-h4">{metrics.weeklyCreated}</div>
                        <div className="text-xs text-muted uppercase tracking-widest font-bold mt-1">Drafts Built</div>
                    </div>
                    <div className="text-center">
                        <div className="text-h4 text-green-1">{metrics.weeklyScheduled}</div>
                        <div className="text-xs text-green-1/70 uppercase tracking-widest font-bold mt-1">Scheduled</div>
                    </div>
                    <div className="text-center">
                        <div className="text-h4 text-blue-1">{metrics.weeklyPublished}</div>
                        <div className="text-xs text-blue-1/70 uppercase tracking-widest font-bold mt-1">Published</div>
                    </div>
                </div>
            </div>

            {/* Client Breakdown Table */}
            <div className="card border border-n-1 dark:border-white/10 shadow-primary-4 rounded-xl overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-n-1 dark:border-white/10">
                    <div className="text-h6 mb-4 md:mb-0">Client Breakdown</div>
                    <div className="flex items-center gap-3">
                        {selectedClientId && (
                            <button
                                onClick={() => setSelectedClientId(null)}
                                className="text-xs font-bold text-n-4 hover:text-n-7 dark:hover:text-white transition-colors"
                            >
                                Clear Filter
                            </button>
                        )}
                        <Link href="/content-pipeline" className="btn-stroke btn-small">
                            View Pipeline
                        </Link>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-n-2 dark:bg-n-1 text-xs text-muted uppercase tracking-widest font-bold">
                                <th className="px-6 py-4">Client Name</th>
                                <th className="px-6 py-4 text-center">Total Volume</th>
                                <th className="px-6 py-4 text-center">Awaiting Auth</th>
                                <th className="px-6 py-4 text-center">Approved</th>
                                <th className="px-6 py-4 text-center">Scheduled</th>
                                <th className="px-6 py-4 text-center">Approval Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientBreakdown.map((client) => {
                                const isSelected = selectedClientId === client.id;
                                return (
                                    <tr
                                        key={client.id}
                                        onClick={() => setSelectedClientId(isSelected ? null : client.id)}
                                        className={`border-b border-n-1 dark:border-white/10 cursor-pointer transition-colors ${isSelected ? 'bg-purple-1/5' : 'hover:bg-n-2 dark:hover:bg-white/5'} last:border-0`}
                                    >
                                        <td className="px-6 py-5 font-bold flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-purple-1/20 text-purple-1 flex items-center justify-center text-xs font-bold">
                                                {client.name.charAt(0)}
                                            </div>
                                            {client.name}
                                        </td>
                                        <td className="px-6 py-5 text-center font-bold text-n-7 dark:text-white">{client.totalDrafts}</td>
                                        <td className="px-6 py-5 text-center text-orange-1 font-bold">{client.awaitingApproval}</td>
                                        <td className="px-6 py-5 text-center text-green-1 font-bold">{client.approved}</td>
                                        <td className="px-6 py-5 text-center text-green-1 font-bold">{client.scheduled}</td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-16 h-1.5 bg-n-3 dark:bg-white/10 rounded-full overflow-hidden">
                                                    <div className="h-full bg-purple-1" style={{ width: `${client.approvalRate}%` }}></div>
                                                </div>
                                                <span className="text-xs font-bold w-8">{client.approvalRate}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
}
