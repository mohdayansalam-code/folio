import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Profile from "@/components/Profile";
import Tabs from "@/components/Tabs";
import Icon from "@/components/Icon";
import ThemeToggle from "@/components/Header/ThemeToggle";
import Field from "@/components/forms/Field";
import { supabase } from "@/utils/supabase";
import toast from "react-hot-toast";
import { getEntitlements } from "@/lib/entitlements";
import { useAuth } from "@/context/AuthProvider";

const SettingsPage = () => {
    const { session } = useAuth();
    const [type, setType] = useState<string>("workspace");

    // Workspace State
    const [workspaceId, setWorkspaceId] = useState<string | null>(null);
    const [workspaceName, setWorkspaceName] = useState("");
    const [workspaceSlug, setWorkspaceSlug] = useState("");
    const [initialName, setInitialName] = useState("");
    const [initialSlug, setInitialSlug] = useState("");
    const [loadingWorkspace, setLoadingWorkspace] = useState(true);
    const [savingWorkspace, setSavingWorkspace] = useState(false);

    // Entitlements State
    const [entitlements, setEntitlements] = useState<any>(null);
    const [plan, setPlan] = useState<string>("free");

    useEffect(() => {
        const loadInitialData = async () => {
            if (!session?.user) return;
            try {
                // Fetch Workspace
                const { data: workspaces, error: wsError } = await supabase
                    .from("workspaces")
                    .select("*")
                    .eq("owner_id", session.user.id)
                    .limit(1);

                if (wsError) throw wsError;
                if (workspaces && workspaces.length > 0) {
                    const ws = workspaces[0];
                    setWorkspaceId(ws.id);
                    setWorkspaceName(ws.name || "");
                    setInitialName(ws.name || "");
                    setWorkspaceSlug(ws.slug || "");
                    setInitialSlug(ws.slug || "");
                }

                // Fetch User Plan
                const { data: userRecord } = await supabase
                    .from("users")
                    .select("current_plan")
                    .eq("email", session.user.email)
                    .single();

                const currentPlan = userRecord?.current_plan || "free";
                setPlan(currentPlan);

                // Assuming usage counts are 0 for basic display
                const usage = {
                    currentClients: 0,
                    currentDraftsThisMonth: 0,
                    currentAssets: 0,
                    currentPerformanceEntries: 0
                };
                setEntitlements(getEntitlements(currentPlan as any, usage));
            } catch (err: any) {
                console.error("Error loading settings data:", err);
                toast.error("Failed to load settings data.");
            } finally {
                setLoadingWorkspace(false);
            }
        };

        loadInitialData();
    }, [session]);

    const handleSaveWorkspace = async () => {
        if (!workspaceId) return;
        if (workspaceName.trim() === "") {
            toast.error("Workspace Name cannot be empty");
            return;
        }

        setSavingWorkspace(true);
        try {
            const updates: any = { name: workspaceName };

            const { error } = await supabase
                .from("workspaces")
                .update(updates)
                .eq("id", workspaceId);

            if (error) throw error;

            toast.success("Workspace updated successfully!");
            setInitialName(workspaceName);
        } catch (err: any) {
            console.error("Save error:", err);
            toast.error(err.message || "Failed to update workspace.");
        } finally {
            setSavingWorkspace(false);
        }
    };

    const isWorkspaceChanged = workspaceName !== initialName;

    const types = [
        {
            title: "Workspace",
            value: "workspace",
        },
        {
            title: "Features & AI",
            value: "features",
        },
        {
            title: "Billing",
            value: "billing",
        },
    ];

    if (loadingWorkspace) {
        return (
            <Layout title="Profile Settings">
                <div className="flex items-center justify-center w-full h-full pt-20">
                    <div className="w-8 h-8 rounded-full border-4 border-n-1 border-t-purple-1 animate-spin"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Profile Settings">
            <div className="flex pt-4 lg:block max-w-[64rem] w-full mx-auto">
                <div className="shrink-0 w-[20rem] 4xl:w-[14.7rem] lg:w-full lg:mb-8">
                    <Profile />
                </div>
                <div className="w-[calc(100%-20rem)] pl-[6.625rem] 4xl:w-[calc(100%-14.7rem)] 2xl:pl-10 lg:w-full lg:pl-0">
                    <div className="flex justify-between mb-6 md:overflow-auto md:-mx-5 md:scrollbar-none md:before:w-5 md:before:shrink-0 md:after:w-5 md:after:shrink-0">
                        <Tabs
                            className="2xl:ml-0 md:flex-nowrap"
                            classButton="2xl:ml-0 md:whitespace-nowrap"
                            items={types}
                            value={type}
                            setValue={setType}
                        />
                    </div>
                    {type === "workspace" && (
                        <>
                            <div className="card shadow-primary-4 p-6 mb-6">
                                <div className="text-h6 mb-6">Workspace Settings</div>
                                <Field
                                    className="mb-6"
                                    label="Workspace Name"
                                    placeholder="Enter workspace name"
                                    value={workspaceName}
                                    onChange={(e: any) => setWorkspaceName(e.target.value)}
                                    required
                                />
                                <Field
                                    className="mb-6"
                                    classInput="bg-n-2 cursor-not-allowed dark:bg-n-6 text-n-4"
                                    label="Workspace URL (Read-only)"
                                    placeholder="your-url"
                                    value={workspaceSlug}
                                    onChange={() => { }}
                                />
                                <button
                                    className={`btn-purple w-full ${!isWorkspaceChanged || savingWorkspace ? "opacity-50 pointer-events-none" : ""}`}
                                    onClick={handleSaveWorkspace}
                                >
                                    {savingWorkspace ? "Saving..." : "Save Changes"}
                                </button>
                                {!isWorkspaceChanged && <div className="text-center mt-3 text-sm text-secondary">No changes to save</div>}
                            </div>
                            <div className="card shadow-primary-4 p-6 mt-6">
                                <div className="text-h6 mb-6">Appearance</div>
                                <div className="flex justify-between items-center mb-4">
                                    <div className="text-sm font-bold text-secondary">Switch between light and dark mode</div>
                                    <ThemeToggle />
                                </div>
                            </div>
                        </>
                    )}
                    {type === "features" && (
                        <div className="card shadow-primary-4 p-6 mb-6 text-center">
                            <Icon className="icon-28 mb-4 mx-auto dark:fill-white" name="profile" />
                            <div className="text-h6 mb-2">Features & AI</div>
                            <div className="text-sm text-secondary mb-6">
                                View your plan entitlements and unlocked features based on your current subscription.
                            </div>

                            <div className="flex flex-col gap-4 text-left">
                                <div className="flex items-center justify-between p-4 border border-n-1 dark:border-white rounded-lg">
                                    <span className="font-bold text-sm">Analytics & Reporting</span>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${entitlements?.canViewAnalytics ? "bg-green-1/20 text-green-1" : "bg-pink-1/20 text-pink-1"}`}>
                                        {entitlements?.canViewAnalytics ? "Unlocked" : "Locked on Free"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-4 border border-n-1 dark:border-white rounded-lg">
                                    <span className="font-bold text-sm">Client Approvals</span>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${entitlements?.canSendForApproval ? "bg-green-1/20 text-green-1" : "bg-pink-1/20 text-pink-1"}`}>
                                        {entitlements?.canSendForApproval ? "Unlocked" : "Locked on Free"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-4 border border-n-1 dark:border-white rounded-lg">
                                    <span className="font-bold text-sm">Drafts Per Month</span>
                                    <span className="px-2 py-1 bg-purple-1/20 text-purple-1 rounded text-xs font-bold">
                                        Limit: {entitlements?.limits?.maxDraftsPerMonth || "Unlimited"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-4 border border-n-1 dark:border-white rounded-lg">
                                    <span className="font-bold text-sm">Active Clients</span>
                                    <span className="px-2 py-1 bg-purple-1/20 text-purple-1 rounded text-xs font-bold">
                                        Limit: {entitlements?.limits?.maxClients || "Unlimited"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                    {type === "billing" && (
                        <div className="card shadow-primary-4 p-6">
                            <div className="text-h6 mb-6">Subscription Plan</div>
                            <div className="flex items-center justify-between mb-6 p-5 border border-purple-1 bg-purple-1/5 rounded-xl">
                                <div>
                                    <div className="text-sm font-bold mb-1 capitalize">Folio {plan} Plan</div>
                                    <div className="text-xs text-secondary">Manage your subscription and billing details through Whop.</div>
                                </div>
                                <div className="label-stroke-green">Active</div>
                            </div>
                            <a
                                href="https://whop.com"
                                target="_blank"
                                rel="noreferrer"
                                className="btn-purple w-full mb-4 inline-flex items-center justify-center gap-2"
                            >
                                <Icon name="external-link" className="w-4 h-4" />
                                Manage on Whop
                            </a>
                            <div className="text-xs text-center text-secondary">
                                Note: Cancellations and plan changes are handled entirely via your Whop customer portal.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default SettingsPage;
