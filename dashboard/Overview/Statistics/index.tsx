import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import { supabase } from "@/utils/supabase";
import Link from "next/link";

type StatisticsProps = {};

const Statistics = ({ }: StatisticsProps) => {
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState([
        { id: "0", title: "Active Clients", value: "0", progress: 0, colorProgress: "#3BBD5B", icon: "profile-1" },
        { id: "1", title: "Total Clients", value: "0", progress: 0, colorProgress: "#319DFF", icon: "profile-1" },
        { id: "2", title: "Drafts Pending", value: "0", progress: 0, colorProgress: "#F2C744", icon: "edit" },
        { id: "3", title: "Scheduled Posts", value: "0", progress: 0, colorProgress: "#FF6A55", icon: "calendar" },
        { id: "4", title: "Posts This Week", value: "0", progress: 0, colorProgress: "#475467", icon: "calendar" },
        { id: "5", title: "Lifetime Impressions", value: "0", progress: 0, colorProgress: "#9966FF", icon: "bar-chart" },
    ]);

    useEffect(() => {
        let mounted = true;

        const fetchDashboardKPIs = async () => {
            const email = localStorage.getItem('folio_user_email');
            if (!email) {
                setLoading(false);
                return;
            }

            try {
                // 1. Clients (Active and Total)
                const { data: clients, error: clientsError } = await supabase
                    .from('clients')
                    .select('id, status')
                    .eq('user_email', email);

                if (clientsError) throw clientsError;

                const activeCount = clients?.filter(c => c.status === 'active').length || 0;
                const totalCount = clients?.length || 0;

                // 2. Drafts (Pending and Scheduled)
                const { data: drafts, error: draftsError } = await supabase
                    .from('drafts')
                    .select('id, status, scheduled_at')
                    .eq('user_email', email);

                if (draftsError) throw draftsError;

                const draftPendingCount = drafts?.filter(d => d.status === 'draft').length || 0;
                const scheduledCount = drafts?.filter(d => d.scheduled_at !== null).length || 0;

                // 3. Posts This Week (Next 7 days)
                const now = new Date();
                const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                const postsThisWeekCount = drafts?.filter(d => {
                    if (!d.scheduled_at) return false;
                    const schedDate = new Date(d.scheduled_at);
                    return schedDate >= now && schedDate <= nextWeek;
                }).length || 0;

                // 4. Lifetime Impressions
                const { data: metricsData, error: metricsError } = await supabase
                    .from('performance')
                    .select('impressions')
                    .eq('user_email', email);

                if (metricsError) throw metricsError;

                const totalImpressions = metricsData?.reduce((sum, row) => sum + (row.impressions || 0), 0) || 0;

                if (mounted) {
                    setMetrics([
                        { id: "0", title: "Active Clients", value: activeCount.toString(), progress: Math.min(100, activeCount * 10), colorProgress: "#3BBD5B", icon: "profile-1" },
                        { id: "1", title: "Total Clients", value: totalCount.toString(), progress: Math.min(100, totalCount * 5), colorProgress: "#319DFF", icon: "profile-1" },
                        { id: "2", title: "Drafts Pending", value: draftPendingCount.toString(), progress: Math.min(100, draftPendingCount * 10), colorProgress: "#F2C744", icon: "edit" },
                        { id: "3", title: "Scheduled Posts", value: scheduledCount.toString(), progress: Math.min(100, scheduledCount * 10), colorProgress: "#FF6A55", icon: "calendar" },
                        { id: "4", title: "Posts This Week", value: postsThisWeekCount.toString(), progress: Math.min(100, postsThisWeekCount * 20), colorProgress: "#475467", icon: "calendar" },
                        { id: "5", title: "Lifetime Impressions", value: totalImpressions.toLocaleString(), progress: Math.min(100, totalImpressions / 10000), colorProgress: "#9966FF", icon: "bar-chart" },
                    ]);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching dashboard KPIs:', error);
                if (mounted) setLoading(false);
            }
        };

        fetchDashboardKPIs();

        return () => {
            mounted = false;
        };
    }, []);

    const isCompletelyEmpty = metrics.every(m => m.value === "0" || m.value === "0.0");

    if (loading) {
        return (
            <div className="flex flex-wrap -mx-2.5 mb-5 md:block md:mx-0">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div className="w-[calc(33.33%-1.67rem)] mx-2.5 px-5 py-4.5 card md:w-full md:mx-0 md:mb-4 animate-pulse" key={i}>
                        <div className="h-4 bg-n-1 dark:bg-n-3 rounded w-1/2 mb-4"></div>
                        <div className="h-8 bg-n-1 dark:bg-n-3 rounded w-1/3 mb-4"></div>
                        <div className="h-1 bg-n-1 dark:bg-n-3 rounded w-full"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (isCompletelyEmpty) {
        return (
            <div className="card shadow-primary-4 p-12 text-center max-w-2xl mx-auto flex flex-col items-center justify-center my-12">
                <Icon className="icon-28 mb-4 text-muted dark:fill-white/50" name="dashboard" />
                <div className="text-h4 mb-2">Welcome to Folio</div>
                <div className="text-secondary mb-6 max-w-md mx-auto">
                    Your dashboard is empty. Start by adding your first ghostwriting client to trace their analytics and content pipeline.
                </div>
                <Link href="/clients" className="btn-purple btn-shadow h-12 px-6">
                    <Icon name="plus" />
                    <span>Add Client</span>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-wrap -mx-2.5 mb-5 md:block md:mx-0">
            {metrics.map((item: any) => (
                <div
                    className="w-[calc(33.33%-1.67rem)] mx-2.5 px-5 py-4.5 card md:w-full md:mx-0 md:mb-4 md:last:mb-0 transition-all duration-200 hover:-translate-y-1 hover:shadow-primary-6"
                    key={item.id}
                >
                    <div className="flex justify-between items-center mb-1">
                        <div className="text-sm text-secondary stat-title font-medium">{item.title}</div>
                        <Icon className="icon-18 dark:fill-n-2 opacity-50" name={item.icon} />
                    </div>
                    <div className="mb-3.5 text-h4 font-bold">{item.value}</div>
                    <div className="relative w-full h-1 rounded-full overflow-hidden" style={{ backgroundColor: `${item.colorProgress}20` }}>
                        <div className="absolute left-0 top-0 bottom-0 rounded-full transition-all duration-1000" style={{ backgroundColor: item.colorProgress, width: item.progress + "%" }}></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Statistics;
