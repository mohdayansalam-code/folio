import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Icon from "@/components/Icon";
import Tabs from "@/components/Tabs";
import Month from "./Month";
import Week from "./Week";
import Day from "./Day";
import Link from "next/link";
import { supabase } from "@/utils/supabase";

const CalendarPage = () => {
    const [type, setType] = useState<string>("month");
    const [scheduledPosts, setScheduledPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const types = [
        { title: "Month", value: "month" },
        { title: "Week", value: "week" },
        { title: "Day", value: "day" },
    ];

    const fetchCalendarData = async () => {
        const { data, error } = await supabase
            .from('drafts')
            .select('*')
            .not('scheduled_at', 'is', null)
            .order('scheduled_at', { ascending: true });

        if (data) setScheduledPosts(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchCalendarData();
    }, []);

    const isEmpty = scheduledPosts.length === 0;

    return (
        <Layout title="Calendar">
            <div className="relative flex mb-6 lg:flex-wrap md:mb-5">
                <Tabs
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:static lg:w-full lg:translate-x-0 lg:translate-y-0 lg:ml-0 lg:mb-4"
                    classButton="lg:ml-0 lg:flex-1"
                    items={types}
                    value={type}
                    setValue={setType}
                />
                <div className="flex items-center md:w-full md:justify-between">
                    <button className="btn-stroke btn-square btn-small mr-1 md:mr-0">
                        <Icon name="arrow-prev" />
                    </button>
                    <button className="btn-stroke btn-square btn-small md:order-3">
                        <Icon name="arrow-next" />
                    </button>
                    <div className="ml-4.5 text-h6 md:ml-0">
                        {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </div>
                </div>
                <button className="btn-stroke btn-small ml-auto md:hidden">
                    <Icon name="filters" />
                    <span>Sort: A-Z</span>
                </button>
            </div>
            {loading ? (
                <div className="card text-center py-20 flex flex-col items-center justify-center max-w-2xl mx-auto my-12">
                    <div className="text-h4 mb-2 text-secondary animate-pulse">Scanning Schedule...</div>
                </div>
            ) : isEmpty ? (
                <div className="card shadow-primary-4 p-12 text-center max-w-2xl mx-auto flex flex-col items-center justify-center my-12">
                    <Icon className="icon-28 mb-4 text-muted dark:fill-white/50" name="calendar" />
                    <div className="text-h4 mb-2">No scheduled posts yet</div>
                    <div className="text-secondary mb-6 max-w-md mx-auto">
                        Your calendar is clear. Create tasks in the content pipeline and schedule them to see them here.
                    </div>
                    <Link href="/content-pipeline" className="btn-purple btn-shadow h-12 px-6">
                        <Icon name="kanban" />
                        <span>Schedule a post from Content Pipeline</span>
                    </Link>
                </div>
            ) : (
                <>
                    {type === "month" && <Month scheduledPosts={scheduledPosts} currentDate={new Date()} />}
                    {/* Week and Day views will also receive scheduledPosts and currentDate props in upcoming revisions if requested by user. */}
                </>
            )}
        </Layout>
    );
};

export default CalendarPage;
