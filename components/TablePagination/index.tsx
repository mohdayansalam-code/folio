import Icon from "@/components/Icon";

const TablePagination = () => (
    <div className="flex justify-between items-center mt-6">
        <div className="text-sm font-medium text-muted /50">
            Showing 10 of 24
        </div>
        <div className="flex">
            <button className="btn-stroke btn-square btn-small mr-2">
                <Icon name="arrow-prev" />
            </button>
            <button className="btn-stroke btn-square btn-small">
                <Icon name="arrow-next" />
            </button>
        </div>
    </div>
);

export default TablePagination;
