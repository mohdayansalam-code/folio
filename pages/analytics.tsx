import dynamic from "next/dynamic";

const AnalyticsPage = dynamic(() => import("../components/analytics/Dashboard"), {
    ssr: false
});

export default AnalyticsPage;
