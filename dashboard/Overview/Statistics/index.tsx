import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import { supabase } from "@/utils/supabase";

type StatisticsProps = {};

const Statistics = ({ }: StatisticsProps) => {
    const [metrics, setMetrics] = useState([
        { id: "0", title: "Active Clients", price: "0", progress: 0, colorProgress: "#3BBD5B", icon: "profile-1" },
        { id: "1", title: "Posts This Week", price: "0", progress: 0, colorProgress: "#319DFF", icon: "calendar" },
        { id: "2", title: "Drafts Pending", price: "0", progress: 0, colorProgress: "#F2C744", icon: "edit" },
        { id: "3", title: "Total Impressions", price: "0", progress: 0, colorProgress: "#9966FF", icon: "bar-chart" },
    ]);

    useEffect(() => {
        const fetchDashboardKPIs = async () => {
            // 1. Active Clients
            const { data: clients } = await supabase
                .from('clients')
                .select('id, status')
                .eq('status', 'active');

            // 2. Drafts Pending 
            const { data: drafts } = await supabase
                .from('posts')
                .select('id, status')
                .eq('status', 'draft');

            // 3. Posts This Week
            const startOfWeek = new Date();
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
            startOfWeek.setHours(0, 0, 0, 0);

            const { data: scheduled } = await supabase
                .from('posts')
                .select('id')
                .gte('scheduled_at', startOfWeek.toISOString());

            // 4. Total Impressions
            const { data: metricsData } = await supabase
                .from('performance_metrics')
                .select('impressions');

            const totalImpressions = metricsData?.reduce((sum, row) => sum + (row.impressions || 0), 0) || 0;

            const activeCount = clients?.length || 0;
            const draftCount = drafts?.length || 0;
            const scheduledCount = scheduled?.length || 0;

            setMetrics([
                { id: "0", title: "Active Clients", price: activeCount.toString(), progress: Math.min(100, activeCount * 10), colorProgress: "#3BBD5B", icon: "profile-1" },
                { id: "1", title: "Posts This Week", price: scheduledCount.toString(), progress: Math.min(100, scheduledCount * 5), colorProgress: "#319DFF", icon: "calendar" },
                { id: "2", title: "Drafts Pending", price: draftCount.toString(), progress: Math.min(100, draftCount * 10), colorProgress: "#F2C744", icon: "edit" },
                { id: "3", title: "Total Impressions", price: totalImpressions.toLocaleString(), progress: Math.min(100, totalImpressions / 1000), colorProgress: "#9966FF", icon: "bar-chart" },
            ]);
        };

        fetchDashboardKPIs();
    }, []);

    return (
        <div className="flex flex-wrap -mx-2.5 mb-5 md:block md:mx-0">
            {metrics.map((item: any) => (
                <div
                    className="w-[calc(50%-1.25rem)] mx-2.5 px-5 py-4.5 card md:w-full md:mx-0 md:mb-4 md:last:mb-0 transition-all duration-200 hover:-translate-y-1 hover:shadow-primary-6"
                    key={item.id}
                >
                    <div className="flex justify-between items-center mb-1">
                        <div className="text-sm text-secondary stat-title">{item.title}</div>
                        <Icon className="icon-18 dark:fill-n-2" name={item.icon} />
                    </div>
                    <div className="mb-3.5 text-h4 font-bold">{item.price}</div>
                    <div className="relative w-full h-1 rounded-full overflow-hidden" style={{ backgroundColor: `${item.colorProgress}30` }}>
                        <div className="absolute left-0 top-0 bottom-0 rounded-full transition-all duration-1000" style={{ backgroundColor: item.colorProgress, width: item.progress + "%" }}></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Statistics;
