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
import { useRouter } from "next/router";
import { useToast } from "@/components/Toast";
import { getEntitlements } from "@/lib/entitlements";
import { supabase } from "@/utils/supabase";

const CustomersV1Page = () => {
    const router = useRouter();
    const { addToast } = useToast();
    const [type, setType] = useState<string>("all-customers");
    const [valueAll, setValueAll] = useState<boolean>(false);
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { mounted } = useHydrated();

    const isTablet = useMediaQuery({
        query: "(max-width: 1023px)",
    });

    const fetchState = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) {
            setClients(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchState();
    }, []);

    const { canCreateClient, limits } = getEntitlements('free', {
        currentClients: clients.length,
        currentDraftsThisMonth: 0 // Draft count not needed on this page
    });

    const handleCreateClient = async () => {
        if (!canCreateClient) {
            addToast(`Free plan allows ${limits.maxClients} client(s). Upgrade to Pro to add more.`, "error");
            return;
        }
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return setLoading(false);

        const { data, error } = await supabase.from('clients').insert({
            name: "New Client",
            user_id: user.id,
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

    const handleUpdateClient = (id: string, updates: any) => {
        setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    };

    const handleDeleteClient = (id: string) => {
        setClients(prev => prev.filter(c => c.id !== id));
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
                <button
                    className={`btn-purple btn-small ${!canCreateClient ? 'opacity-50' : ''}`}
                    onClick={handleCreateClient}
                >
                    <Icon name="plus" />
                    <span>Add Client</span>
                </button>
            </div>

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
                    <button
                        className={`btn-purple btn-shadow h-12 px-6 ${!canCreateClient ? 'opacity-50' : ''}`}
                        onClick={handleCreateClient}
                    >
                        <Icon name="plus" />
                        <span>Add Client</span>
                    </button>
                </div>
            ) : mounted && isTablet ? (
                <div className="card">
                    {filteredClients.map((customer) => (
                        <Item
                            item={customer}
                            key={customer.id}
                            onUpdateClient={handleUpdateClient}
                            onDeleteClient={handleDeleteClient}
                        />
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
                            <Row
                                item={customer}
                                key={customer.id}
                                onUpdateClient={handleUpdateClient}
                                onDeleteClient={handleDeleteClient}
                            />
                        ))}
                    </tbody>
                </table>
            )}
            {hasData && <TablePagination />}
        </Layout>
    );
};

export default CustomersV1Page;
