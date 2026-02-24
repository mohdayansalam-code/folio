import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import Layout from "@/components/Layout";
import Tabs from "@/components/Tabs";
import Icon from "@/components/Icon";
import Sorting from "@/components/Sorting";
import Checkbox from "@/components/Checkbox";
import TablePagination from "@/components/TablePagination";
import Row from "./Row";
import Item from "./Item";
import { useHydrated } from "@/hooks/useHydrated";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/router";
import { useToast } from "@/components/Toast";

const CustomersV1Page = () => {
    const router = useRouter();
    const { addToast } = useToast();
    const [type, setType] = useState<string>("all-customers");
    const [valueAll, setValueAll] = useState<boolean>(false);
    const [clients, setClients] = useState<any[]>([]);
    const [plan, setPlan] = useState<string>("free");
    const [loading, setLoading] = useState(true);
    const { mounted } = useHydrated();

    const isTablet = useMediaQuery({
        query: "(max-width: 1023px)",
    });

    useEffect(() => {
        const fetchState = async () => {
            const { data: member } = await supabase.from('workspace_members').select('workspace_id').limit(1).single();
            if (member) {
                const { data: workspace } = await supabase.from('workspaces').select('plan').eq('id', member.workspace_id).single();
                if (workspace) setPlan(workspace.plan);
            }

            const { data, error } = await supabase
                .from('clients')
                .select('*')
                .order('created_at', { ascending: false });

            if (data) {
                setClients(data);
            }
            setLoading(false);
        };
        fetchState();
    }, []);

    const handleCreateClient = async () => {
        setLoading(true);
        const { data: workspaceData } = await supabase.from('workspace_members').select('workspace_id').limit(1).single();
        if (!workspaceData) return setLoading(false);

        const { data, error } = await supabase.from('clients').insert({
            name: "New Client",
            workspace_id: workspaceData.workspace_id,
            status: 'active'
        }).select('id').single();

        if (!error && data) {
            addToast("Client profile established.", "success");
            router.push(`/client-brain?onboarding=true`);
        } else {
            console.error(error);
            addToast("Failed to create client.", "error");
            setLoading(false);
        }
    };

    const handleDemoWorkspace = async () => {
        setLoading(true);
        const { data: workspaceData } = await supabase.from('workspace_members').select('workspace_id').limit(1).single();
        if (!workspaceData) return setLoading(false);

        const { data: clientData, error } = await supabase.from('clients').insert({
            name: "Stark Industries",
            niche: "Defense & Robotics",
            workspace_id: workspaceData.workspace_id,
            status: 'active'
        }).select('id').single();

        if (clientData) {
            await supabase.from('client_brain').insert({
                client_id: clientData.id,
                voice_tone: "Authoritative, Visionary",
                signature_stories: "Building the Arc Reactor in a cave.",
                offer_positioning: "We privatized world peace.",
                proof_results: "I am Iron Man.",
                ai_status: 'ready'
            });

            await supabase.from('posts').insert([
                { client_id: clientData.id, title: "Why I stopped building weapons", status: "idea" },
                { client_id: clientData.id, title: "The future of clean energy", status: "idea" },
                { client_id: clientData.id, title: "Managing Avengers Initiative", body: "It's tough.", status: "draft" },
                { client_id: clientData.id, title: "AI assistants vs JARVIS", body: "JARVIS is better.", status: "approved" },
                { client_id: clientData.id, title: "Thoughts on time travel", body: "It works.", status: "scheduled", scheduled_at: new Date(Date.now() + 86400000 * 2).toISOString() }
            ]);

            localStorage.setItem('folio_demo_mode', 'true');
            addToast("Demo Workspace Activated", "success");
            window.location.reload();
        } else {
            console.error(error);
            addToast("Failed to initialize demo mode.", "error");
            setLoading(false);
        }
    };

    const types = [
        { title: "All Clients", value: "all-customers" },
        { title: "Active", value: "active" },
        { title: "Paused", value: "paused" },
    ];

    const filteredClients = type === 'all-customers' ? clients : clients.filter(c => c.status === type);

    const hasData = clients.length > 0;

    return (
        <Layout title="Clients">
            <div className="flex mb-6 md:block md:mb-5">
                <Tabs
                    className="mr-auto md:ml-0 md:-mr-1"
                    classButton="md:grow md:ml-0 md:px-2"
                    items={types}
                    value={type}
                    setValue={setType}
                />
                <button className="btn-stroke btn-small mr-1.5 lg:hidden">
                    <Icon name="filters" />
                    <span>Sort: Recent</span>
                </button>
                {plan === 'free' && clients.length >= 1 ? (
                    <a href="https://whop.com/folio" target="_blank" rel="noreferrer" className="btn-stroke btn-small text-pink-1 border-pink-1 hover:bg-pink-1 hover:text-white">
                        <Icon name="lightning" />
                        <span>Upgrade</span>
                    </a>
                ) : (
                    <button className="btn-purple btn-small" onClick={handleCreateClient}>
                        <Icon name="plus" />
                        <span>Add Client</span>
                    </button>
                )}
            </div>

            {!loading && plan === 'free' && clients.length >= 1 && (
                <div className="card shadow-primary-4 mb-8 bg-pink-1/[0.05] border border-pink-1/20 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-pink-1/20 flex items-center justify-center">
                            <Icon className="icon-24 fill-pink-1" name="lightning" />
                        </div>
                        <div>
                            <div className="text-h6 mb-1 text-n-7 ">Workspace Limit Reached</div>
                            <div className="text-muted text-sm max-w-xl">
                                You are currently on the Free Plan which is limited to 1 active client. Upgrade to unlock more clients and unlimited AI generations.
                            </div>
                        </div>
                    </div>
                    <a href="https://whop.com/folio" target="_blank" rel="noreferrer" className="btn-pink btn-shadow h-12 px-8 shrink-0">
                        Upgrade to Pro
                    </a>
                </div>
            )}

            {loading ? (
                <div className="card text-center py-20 flex flex-col items-center justify-center">
                    <div className="text-h4 mb-2 text-secondary animate-pulse">Loading Pipeline...</div>
                </div>
            ) : !hasData ? (
                <div className="card shadow-primary-4 p-12 text-center max-w-2xl mx-auto flex flex-col items-center justify-center my-12">
                    <Icon className="icon-28 mb-4 text-muted dark:fill-white/50" name="profile" />
                    <div className="text-h4 mb-2">No clients yet</div>
                    <div className="text-secondary mb-6 max-w-md mx-auto">
                        Add your first client to start generating content, tracking performance, and managing your ghostwriting pipeline.
                    </div>
                    <button className="btn-purple btn-shadow h-12 px-6" onClick={handleCreateClient}>
                        <Icon name="plus" />
                        <span>Add Client</span>
                    </button>
                    <button className="text-sm font-bold mt-6 text-muted hover:text-purple-1 dark:hover:text-purple-1 transition-colors" onClick={handleDemoWorkspace}>
                        Explore with a demo workspace
                    </button>
                </div>
            ) : mounted && isTablet ? (
                <div className="card">
                    {filteredClients.map((customer) => (
                        <Item item={customer} key={customer.id} />
                    ))}
                </div>
            ) : (
                <table className="table-custom table-select">
                    <thead>
                        <tr>
                            <th className="th-custom">
                                <Checkbox value={valueAll} onChange={() => setValueAll(!valueAll)} />
                            </th>
                            <th className="th-custom"><Sorting title="Client Name" /></th>
                            <th className="th-custom"><Sorting title="Date Added" /></th>
                            <th className="th-custom"><Sorting title="LinkedIn" /></th>
                            <th className="th-custom"><Sorting title="Niche" /></th>
                            <th className="th-custom text-right"><Sorting title="Status" /></th>
                            <th className="th-custom text-right"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClients.map((customer) => (
                            <Row item={customer} key={customer.id} />
                        ))}
                    </tbody>
                </table>
            )}
            {hasData && <TablePagination />}
        </Layout>
    );
};

export default CustomersV1Page;
