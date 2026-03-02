import dynamic from "next/dynamic";

const PerformancePage = dynamic(() => import("../components/performance/PerformancePage"), {
    ssr: false
});

export default PerformancePage;
