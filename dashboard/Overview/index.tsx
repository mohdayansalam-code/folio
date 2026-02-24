import Layout from "@/components/Layout";
import Statistics from "./Statistics";
import SalesOverview from "./SalesOverview";
import Customers from "./Customers";

const CrmPage = () => {
    return (
        <Layout title="Dashboard">
            <Statistics />
        </Layout>
    );
};

export default CrmPage;
