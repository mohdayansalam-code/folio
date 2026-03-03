import dynamic from "next/dynamic";

const SettingsPage = dynamic(() => import("../settings/Workspace"), { ssr: false });

export default SettingsPage;
