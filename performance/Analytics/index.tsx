import Layout from "@/components/Layout";
import Icon from "@/components/Icon";
import CardChart from "@/components/CardChart";
import Statistics from "./Statistics";
import Chart from "./Chart";

import { reportsStatistics, barsData } from "@/mocks/finance";

const ReportsBarsPage = () => {
    return (
        <Layout title="Reports">
            {barsData.length === 0 ? (
                <div className="card shadow-primary-4 p-12 text-center max-w-2xl mx-auto flex flex-col items-center justify-center my-12">
                    <Icon className="icon-28 mb-4 text-muted dark:fill-white/50" name="bar-chart" />
                    <div className="text-h4 mb-2">No performance data yet</div>
                    <div className="text-secondary mb-6 max-w-md mx-auto">
                        Your performance metrics will appear here once your scheduled posts are published and start gathering impressions and engagements.
                    </div>
                    <button className="btn-purple btn-shadow h-12 px-6">
                        <Icon name="plus" />
                        <span>Connect LinkedIn</span>
                    </button>
                </div>
            ) : (
                <>
                    <div className="card mb-5">
                        <div className="card-head">
                            <div className="text-h6">Bars 12 columns</div>
                            <button className="group text-0">
                                <Icon
                                    className="icon-18 fill-n-1 transition-colors dark:fill-white group-hover:fill-purple-1"
                                    name="calendar"
                                />
                            </button>
                        </div>
                        <Statistics items={reportsStatistics} />
                        <Chart items={barsData} />
                    </div>
                    <CardChart title="Bars 12 columns">
                        <Chart items={barsData} />
                    </CardChart>
                    <div className="flex mt-5 -mx-2.5 lg:block lg:mx-0">
                        <div className="w-[calc(66.666%-1.25rem)] mx-2.5 lg:w-full lg:mx-0 lg:mb-5">
                            <CardChart title="Bars 8 columns">
                                <Chart items={barsData.slice(0, 8)} />
                            </CardChart>
                        </div>
                        <div className="w-[calc(33.333%-1.25rem)] mx-2.5 lg:w-full lg:mx-0">
                            <CardChart title="Bars 4 columns">
                                <Chart items={barsData.slice(8, 12)} />
                            </CardChart>
                        </div>
                    </div>
                </>
            )}
        </Layout>
    );
};

export default ReportsBarsPage;
