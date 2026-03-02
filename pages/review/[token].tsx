import dynamic from "next/dynamic";

const ClientReviewPage = dynamic(
    () => import("../../components/content/ClientReview"),
    { ssr: false }
);

export default ClientReviewPage;
