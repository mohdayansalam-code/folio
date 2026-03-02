import dynamic from "next/dynamic";

const ContentPipelinePage = dynamic(() => import("../content-pipeline/Kanban"), {
    ssr: false,
});

export default ContentPipelinePage;
