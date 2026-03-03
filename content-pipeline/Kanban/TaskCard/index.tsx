import { useState, useEffect } from "react";
import Icon from "@/components/Icon";
import Link from "next/link";
import { supabase } from "@/utils/supabase";

type TaskCardProps = {
    item: any;
    onMove: (item: any, nextStatus: string) => void;
    isMutating: boolean;
    clients: any[];
};

const TaskCard = ({ item, onMove, isMutating, clients }: TaskCardProps) => {

    const [stats, setStats] = useState({ impressions: 0, comments: 0, meetings: 0 });

    useEffect(() => {
        if (item.status === 'published' && item.id) {
            supabase
                .from('performance')
                .select('impressions, comments, meetings')
                .eq('draft_id', item.id)
                .then(({ data }) => {
                    if (data && data.length > 0) {
                        const sums = data.reduce((acc: any, curr: any) => ({
                            impressions: acc.impressions + (curr.impressions || 0),
                            comments: acc.comments + (curr.comments || 0),
                            meetings: acc.meetings + (curr.meetings || 0),
                        }), { impressions: 0, comments: 0, meetings: 0 });
                        setStats(sums);
                    }
                });
        }
    }, [item.status, item.id]);

    let clientName = "Unknown Client";
    if (item.client_id) {
        const found = clients.find(c => c.value === item.client_id);
        if (found) clientName = found.label;
    }

    const renderAction = () => {
        if (item.status === 'idea') {
            return (
                <button
                    className="btn-purple btn-small w-full mt-4 h-8"
                    onClick={() => onMove(item, 'draft')}
                    disabled={isMutating}
                >
                    Move to Draft
                </button>
            );
        }
        if (['draft', 'awaiting_approval', 'approved'].includes(item.status)) {
            const isAwaiting = item.status === 'awaiting_approval';
            return (
                <button
                    className={`btn-stroke btn-small w-full mt-4 h-8 border-green-1 text-green-1 ${isAwaiting ? 'opacity-50 cursor-not-allowed text-orange-1 border-orange-1' : 'hover:bg-green-1 hover:text-white'}`}
                    onClick={() => !isAwaiting && onMove(item, 'scheduled')}
                    disabled={isMutating || isAwaiting}
                >
                    {isAwaiting ? 'Awaiting Client' : 'Schedule Post'}
                </button>
            );
        }
        if (item.status === 'scheduled') {
            return (
                <button
                    className="btn-stroke btn-small w-full mt-4 h-8 border-blue-1 text-blue-1 hover:bg-blue-1 hover:text-white"
                    onClick={() => onMove(item, 'published')}
                    disabled={isMutating}
                >
                    Mark Published
                </button>
            );
        }
        return null;
    };

    return (
        <div className={`card flex flex-col mt-4 px-5 py-5 transition-all duration-200 border border-n-1 dark:border-white/10 hover:border-purple-1 hover:shadow-primary-4 ${isMutating ? 'opacity-70' : ''}`}>

            <div className="flex justify-between items-start mb-3">
                <div className="label-stroke-purple shrink-0 text-xs">
                    {clientName}
                </div>
                {item.status === 'awaiting_approval' && (
                    <div className="bg-orange-1/20 text-orange-1 px-2 py-0.5 rounded text-xs font-bold leading-tight">
                        Reviewing
                    </div>
                )}
                {item.status === 'approved' && (
                    <div className="bg-green-1/20 text-green-1 px-2 py-0.5 rounded text-xs font-bold leading-tight">
                        Approved
                    </div>
                )}
            </div>

            <div className="mb-2 font-bold line-clamp-2 text-h6 leading-tight">
                <Link href={`/drafts/${item.id}`} className="hover:text-purple-1 hover:underline transition-colors block">
                    {item.title || "Untitled Draft"}
                </Link>
            </div>

            {item.content && (
                <Link href={`/drafts/${item.id}`} className="block text-sm text-secondary mb-4 line-clamp-3 hover:text-n-7 dark:hover:text-white transition-colors">
                    {item.content}
                </Link>
            )}

            <div className="flex flex-col gap-2 mt-auto">
                <div className="flex justify-between items-center text-xs text-muted">
                    <span>Created: {new Date(item.created_at || Date.now()).toLocaleDateString()}</span>
                    {item.scheduled_at && (
                        <span className="flex items-center font-bold text-n-7 dark:text-white">
                            <Icon className="icon-16 mr-1" name="calendar" />
                            {new Date(item.scheduled_at).toLocaleDateString()}
                        </span>
                    )}
                </div>

                {item.status === 'published' && (
                    <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-n-1 dark:border-white/10 text-xs text-center text-secondary font-medium">
                        <div><div className="text-blue-1 font-bold">{stats.impressions}</div><div>Views</div></div>
                        <div><div className="text-green-1 font-bold">{stats.comments}</div><div>Comments</div></div>
                        <div><div className="text-orange-1 font-bold">{stats.meetings}</div><div>Meetings</div></div>
                    </div>
                )}

                {renderAction()}
            </div>
        </div>
    );
};

export default TaskCard;
