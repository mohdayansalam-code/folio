import Layout from "@/components/Layout";
import Statistics from "./Statistics";
import Focus from "./Focus";
import Activity from "./Activity";

const CrmPage = () => {
    return (
        <Layout title="Dashboard">
            <Focus />
            <div className="flex gap-8 lg:flex-col lg:gap-0">
                <div className="flex-grow">
                    <Statistics />
                </div>
                <div className="w-[20rem] shrink-0 lg:w-full lg:mt-8">
                    <Activity />
                </div>
            </div>
        </Layout>
    );
};

export default CrmPage;
