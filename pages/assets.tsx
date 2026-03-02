import dynamic from "next/dynamic";

const AssetsPage = dynamic(() => import("../assets/ClientAssets"), {
    ssr: false
});

export default AssetsPage;
