import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import Link from "next/link";
import { supabase } from "@/utils/supabase";

const Focus = () => {
    const [loading, setLoading] = useState(true);
    const [focus, setFocus] = useState<{
        title: string;
        description: string;
        actionText: string;
        actionLink: string;
        icon: string;
    } | null>(null);

    useEffect(() => {
        let mounted = true;

        const determineFocus = async () => {
            const email = localStorage.getItem('folio_user_email');
            if (!email) {
                setLoading(false);
                return;
            }

            try {
                // 1. Check Clients
                const { data: clients } = await supabase
                    .from('clients')
                    .select('id')
                    .eq('user_email', email)
                    .limit(1);

                if (!clients || clients.length === 0) {
                    setFocus({
                        title: "Add your first client",
                        description: "You haven't added any clients yet. Start by setting up a client profile to build their brain and pipeline.",
                        actionText: "Add Client",
                        actionLink: "/clients",
                        icon: "plus",
                    });
                    setLoading(false);
                    return;
                }

                // 2. Check Drafts
                const { data: drafts } = await supabase
                    .from('drafts')
                    .select('id, status, scheduled_at')
                    .eq('user_email', email);

                if (!drafts || drafts.length === 0) {
                    setFocus({
                        title: "Create your first draft",
                        description: "Your pipeline is empty. Use the Content Pipeline to draft your first post using your client's brain.",
                        actionText: "Create Draft",
                        actionLink: "/content-pipeline",
                        icon: "edit",
                    });
                    setLoading(false);
                    return;
                }

                // 3. Check Scheduling
                const unscheduledDrafts = drafts.filter(d => !d.scheduled_at && d.status === 'draft');
                if (unscheduledDrafts.length > 0) {
                    setFocus({
                        title: "Schedule your content",
                        description: `You have ${unscheduledDrafts.length} unscheduled drafts. Move them to the calendar to keep your consistency high.`,
                        actionText: "Open Pipeline",
                        actionLink: "/content-pipeline",
                        icon: "calendar",
                    });
                    setLoading(false);
                    return;
                }

                // Default: View Performance
                setFocus({
                    title: "Analyze client results",
                    description: "Everything is running smoothly! Review your client's latest performance metrics to prove your ROI.",
                    actionText: "View Performance",
                    actionLink: "/performance",
                    icon: "bar-chart",
                });
            } catch (error) {
                console.error("Error determining focus:", error);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        determineFocus();

        return () => {
            mounted = false;
        };
    }, []);

    if (loading) {
        return (
            <div className="card p-8 mb-8 animate-pulse text-center">
                <div className="h-6 bg-n-1 dark:bg-n-3 rounded w-1/4 mx-auto mb-4"></div>
                <div className="h-4 bg-n-1 dark:bg-n-3 rounded w-1/2 mx-auto mb-6"></div>
                <div className="h-10 bg-n-1 dark:bg-n-3 rounded w-32 mx-auto"></div>
            </div>
        );
    }

    if (!focus) return null;

    return (
        <div className="card p-10 mb-8 border border-purple-1/20 bg-gradient-to-br from-purple-1/5 to-transparent shadow-primary-4 text-center">
            <div className="w-16 h-16 rounded-full bg-purple-1/10 flex items-center justify-center mx-auto mb-6">
                <Icon className="icon-28 fill-purple-1" name={focus.icon} />
            </div>
            <h2 className="text-h3 mb-3 font-bold">{focus.title}</h2>
            <p className="text-secondary mb-8 max-w-xl mx-auto font-medium">
                {focus.description}
            </p>
            <Link href={focus.actionLink} className="btn-purple btn-shadow h-12 px-8">
                <Icon name={focus.icon === 'plus' ? 'plus' : focus.icon} />
                <span>{focus.actionText}</span>
            </Link>
        </div>
    );
};

export default Focus;
