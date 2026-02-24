import { useState } from "react";
import Layout from "@/components/Layout";
import Profile from "@/components/Profile";
import Tabs from "@/components/Tabs";
import Icon from "@/components/Icon";
import Account from "./Account";
import Security from "./Security";
import SocialNetworks from "./SocialNetworks";
import Notifications from "./Notifications";
import Switch from "@/components/Switch";
import ThemeToggle from "@/components/Header/ThemeToggle";

const SettingsPage = () => {
    const [type, setType] = useState<string>("workspace");

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
                        <button className="btn-stroke btn-small shrink-0 min-w-[6rem] ml-4 md:hidden">
                            <Icon name="dots" />
                            <span>Actions</span>
                        </button>
                    </div>
                    {type === "workspace" && (
                        <>
                            <div className="card shadow-primary-4 p-6 mb-6">
                                <div className="text-h6 mb-6">Workspace Settings</div>
                                <div className="text-sm font-bold text-secondary mb-2">Workspace Name</div>
                                <div className="w-full h-12 px-4 border border-n-1 flex items-center mb-6">Folio Team</div>
                                <div className="text-sm font-bold text-secondary mb-2">Workspace URL</div>
                                <div className="w-full h-12 px-4 border border-n-1 flex items-center mb-6">folio.app/team</div>
                                <button className="btn-purple w-full">Save Changes</button>
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
                            <div className="text-h6 mb-2">AI Content Engine</div>
                            <div className="text-sm text-secondary mb-6">You have used 12,040 / 50,000 words this month.</div>
                            <div className="w-full h-2 bg-n-3/20 rounded-full mb-6 overflow-hidden"><div className="w-1/4 h-full bg-purple-1"></div></div>
                            <button className="btn-stroke w-full">Manage AI Settings</button>
                        </div>
                    )}
                    {type === "billing" && (
                        <div className="card shadow-primary-4 p-6">
                            <div className="text-h6 mb-6">Subscription Plan</div>
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <div className="text-sm font-bold mb-1">Folio Pro Plan</div>
                                    <div className="text-xs text-secondary">$49/month • Renews on Nov 1</div>
                                </div>
                                <div className="label-stroke-green">Active</div>
                            </div>
                            <button className="btn-purple w-full mb-4">View Invoices</button>
                            <button className="btn-stroke w-full text-pink-1 hover:text-white hover:bg-pink-1 dark:text-pink-1">Cancel Subscription</button>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default SettingsPage;
