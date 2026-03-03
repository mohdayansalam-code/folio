import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import { supabase } from "@/utils/supabase";

const Activity = () => {
    const [loading, setLoading] = useState(true);
    const [activities, setActivities] = useState<any[]>([]);

    useEffect(() => {
        let mounted = true;

        const fetchActivities = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                // Fetch recent clients, drafts, and performance entries
                const [clientsRes, draftsRes, performanceRes] = await Promise.all([
                    supabase
                        .from('clients')
                        .select('name, created_at')
                        .order('created_at', { ascending: false })
                        .limit(5),
                    supabase
                        .from('drafts')
                        .select('content, status, created_at')
                        .order('created_at', { ascending: false })
                        .limit(5),
                    supabase
                        .from('performance')
                        .select('impressions, created_at')
                        .order('created_at', { ascending: false })
                        .limit(5),
                ]);

                const combined: any[] = [];

                if (clientsRes.data) {
                    clientsRes.data.forEach(c => combined.push({
                        type: 'client',
                        content: `New client added: ${c.name}`,
                        date: new Date(c.created_at),
                        icon: 'profile-1',
                        color: 'green'
                    }));
                }

                if (draftsRes.data) {
                    draftsRes.data.forEach(d => combined.push({
                        type: 'draft',
                        content: `New draft created: "${d.content.substring(0, 30)}..."`,
                        date: new Date(d.created_at),
                        icon: 'edit',
                        color: 'purple'
                    }));
                }

                if (performanceRes.data) {
                    performanceRes.data.forEach(p => combined.push({
                        type: 'performance',
                        content: `Logged ${p.impressions.toLocaleString()} impressions`,
                        date: new Date(p.created_at),
                        icon: 'bar-chart',
                        color: 'blue'
                    }));
                }

                // Sort by date and take top 5
                const final = combined
                    .sort((a, b) => b.date.getTime() - a.date.getTime())
                    .slice(0, 5);

                if (mounted) {
                    setActivities(final);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching activities:", error);
                if (mounted) setLoading(false);
            }
        };

        fetchActivities();

        return () => {
            mounted = false;
        };
    }, []);

    const getTimeAgo = (date: Date) => {
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}d ago`;
    };

    if (loading) {
        return (
            <div className="card p-6 w-full animate-pulse">
                <div className="h-4 bg-n-1 dark:bg-n-3 rounded w-1/3 mb-6"></div>
                {[1, 2, 3].map(i => (
                    <div className="flex items-center gap-4 mb-4" key={i}>
                        <div className="w-8 h-8 rounded-full bg-n-1 dark:bg-n-3"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-3 bg-n-1 dark:bg-n-3 rounded w-3/4"></div>
                            <div className="h-2 bg-n-1 dark:bg-n-3 rounded w-1/4"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="card p-6 w-full">
            <h3 className="text-h5 mb-6 font-bold flex items-center gap-2">
                <Icon name="activity" className="icon-20 dark:fill-white" />
                Recent Activity
            </h3>

            {activities.length === 0 ? (
                <div className="py-10 text-center text-secondary italic">
                    No recent activity to show.
                </div>
            ) : (
                <div className="space-y-6">
                    {activities.map((activity, index) => (
                        <div key={index} className="flex items-start gap-4">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-n-1 dark:bg-n-2 shadow-sm border border-n-1 dark:border-white/5`}>
                                <Icon className={`icon-18 fill-${activity.color}-1`} name={activity.icon} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold truncate text-n-7 dark:text-white/90">
                                    {activity.content}
                                </div>
                                <div className="text-[11px] font-bold text-secondary uppercase opacity-60">
                                    {getTimeAgo(activity.date)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Activity;
