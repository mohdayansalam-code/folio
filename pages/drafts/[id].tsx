import dynamic from "next/dynamic";

const DraftEditorPage = dynamic(
    () => import("../../components/content/DraftEditor"),
    { ssr: false }
);

export default DraftEditorPage;
