import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Field from "@/components/Field";
import Icon from "@/components/Icon";
import { supabase } from "@/utils/supabase";
import { useToast } from "@/components/Toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Performance = () => {
    const [impressions, setImpressions] = useState<string>("");
    const [replies, setReplies] = useState<string>("");
    const [calls, setCalls] = useState<string>("");

    const { addToast } = useToast();

    const [stats, setStats] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const fetchMetrics = async () => {
            try {
                const { data, error } = await supabase
                    .from('performance_metrics')
                    .select('*')
                    .order('week_start_date', { ascending: true });

                if (error) throw error;

                if (mounted && data && data.length > 0) {
                    const totalImpressions = data.reduce((sum, item) => sum + (item.impressions || 0), 0);
                    const totalReplies = data.reduce((sum, item) => sum + (item.replies || 0), 0);
                    const totalCalls = data.reduce((sum, item) => sum + (item.calls || 0), 0);

                    setStats([
                        { title: "Total Impressions", value: totalImpressions.toLocaleString(), color: "purple" },
                        { title: "Comments / DMs", value: totalReplies.toLocaleString(), color: "green" },
                        { title: "Meetings Booked", value: totalCalls.toLocaleString(), color: "yellow" },
                    ]);

                    // Group by week for the chart
                    const groupedData = data.reduce((acc: any, curr: any) => {
                        const date = new Date(curr.week_start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        if (!acc[date]) {
                            acc[date] = { name: date, impressions: 0 };
                        }
                        acc[date].impressions += curr.impressions;
                        return acc;
                    }, {});

                    setChartData(Object.values(groupedData));
                }
            } catch (error) {
                console.error('Error fetching performance metrics:', error);
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchMetrics();

        return () => {
            mounted = false;
        };
    }, []);

    const hasData = stats.length > 0;

    return (
        <Layout title="Performance">
            <div className="flex justify-between items-center mb-8">
                <div className="text-h4">Performance Tracking</div>
                <div className="flex">
                    <button className="btn-stroke h-12 px-6 mr-4">
                        <Icon name="download" />
                        <span>Export Report</span>
                    </button>
                    <button className="btn-purple btn-shadow h-12 px-6">
                        <Icon name="plus" />
                        <span>Manual Input</span>
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-6 md:grid-cols-1">
                <div className="col-span-2 flex flex-col gap-6">
                    {loading ? (
                        <div className="card text-center py-20 flex flex-col items-center justify-center h-full min-h-[400px]">
                            <Icon className="icon-28 mb-4 text-secondary animate-pulse" name="bar-chart" />
                            <div className="text-h4 mb-2 text-secondary animate-pulse">Scanning Telemetry...</div>
                        </div>
                    ) : !hasData ? (
                        <div className="card shadow-primary-4 p-12 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
                            <Icon className="icon-28 mb-4 text-muted dark:fill-white/50" name="bar-chart" />
                            <div className="text-h4 mb-2">No performance data yet</div>
                            <div className="text-secondary max-w-md mx-auto">
                                Your performance metrics will appear here once your scheduled posts are published and start gathering impressions and engagements.
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-3 gap-6 md:grid-cols-1">
                                {stats.map((stat, index) => (
                                    <div key={index} className="card shadow-primary-4 p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-primary-6">
                                        <div className="text-sm font-bold text-secondary mb-2">{stat.title}</div>
                                        <div className="text-h3 mb-4">{stat.value}</div>
                                        <div className={`text-xs font-bold text-${stat.color}-1`}>Lifetime Aggregation</div>
                                    </div>
                                ))}
                            </div>

                            <div className="card shadow-primary-4">
                                <div className="card-head">
                                    <div className="text-h6">Growth Chart</div>
                                    <div className="label-stroke-purple">Weekly</div>
                                </div>
                                <div className="p-6 h-[400px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" vertical={false} />
                                            <XAxis dataKey="name" stroke="#6F767E" tick={{ fill: '#6F767E', fontSize: 12 }} dy={10} axisLine={false} tickLine={false} />
                                            <YAxis stroke="#6F767E" tick={{ fill: '#6F767E', fontSize: 12 }} dx={-10} axisLine={false} tickLine={false} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#111315', border: '1px solid #272B30', borderRadius: '8px', color: '#FCFCFC' }}
                                                itemStyle={{ color: '#FCFCFC' }}
                                            />
                                            <Line type="monotone" dataKey="impressions" stroke="#9966FF" strokeWidth={3} dot={{ r: 4, fill: '#111315', stroke: '#9966FF', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="card shadow-primary-4 h-fit">
                    <div className="card-head">
                        <div className="text-h6">Manual Input</div>
                    </div>
                    <div className="p-6">
                        <Field
                            className="mb-4"
                            label="Post Impressions"
                            placeholder="Enter post impressions"
                            value={impressions}
                            onChange={(e: any) => setImpressions(e.target.value)}
                        />
                        <Field
                            className="mb-4"
                            label="Comments / DMs"
                            placeholder="Enter comments/DMs"
                            value={replies}
                            onChange={(e: any) => setReplies(e.target.value)}
                        />
                        <Field
                            className="mb-6"
                            label="Meetings Booked"
                            placeholder="Enter meetings booked"
                            value={calls}
                            onChange={(e: any) => setCalls(e.target.value)}
                        />
                        <button
                            className="btn-purple w-full h-12 shadow-primary-4 transition-all duration-150 active:translate-y-[1px]"
                            onClick={() => {
                                if (impressions || replies || calls) {
                                    setImpressions("");
                                    setReplies("");
                                    setCalls("");
                                    addToast("Performance metrics saved.", "success");
                                } else {
                                    addToast("Please enter metrics to save.", "error");
                                }
                            }}
                        >
                            Save Performance Data
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Performance;
